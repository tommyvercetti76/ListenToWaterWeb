// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC59ECKLt3rowOoavF76hV_djb--W4jekA",
    authDomain: "kaaykostore.firebaseapp.com",
    projectId: "kaaykostore",
    storageBucket: "kaaykostore.firebasestorage.app",
    messagingSenderId: "87383373015",
    appId: "1:87383373015:web:ee1ce56d4f5192ec67ec92",
    measurementId: "G-W7WN2NXM8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
    fetchProductData();
    setupModalCloseHandlers();
});

/**
 * Fetch product data from Firestore and populate the carousel.
 */
async function fetchProductData() {
    try {
        const querySnapshot = await getDocs(collection(db, "kaaykoproducts"));
        const items = [];

        querySnapshot.forEach(doc => {
            const item = doc.data();
            item.id = doc.id;

            fetchImagesByProductId(item.productID).then(images => {
                item.imgSrc = images;
                items.push(item);
                if (items.length === querySnapshot.size) populateCarousel(items);
            });
        });
    } catch (error) {
        console.error("Error fetching product data:", error);
    }
}

/**
 * Fetches images for a specific product from Firebase Storage.
 */
async function fetchImagesByProductId(productID) {
    try {
        const storageRef = ref(storage, `kaaykoStoreTShirtImages/${productID}`);
        const result = await listAll(storageRef);
        return await Promise.all(result.items.map(imageRef => getDownloadURL(imageRef)));
    } catch (error) {
        console.error("Error fetching images:", error);
        return [];
    }
}

/**
 * Populates the carousel with product items.
 */
function populateCarousel(items) {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = '';

    items.forEach(item => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';

        // Create and populate image container
        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';

        item.imgSrc.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'carousel-image';
            img.style.display = index === 0 ? 'block' : 'none';
            imgContainer.appendChild(img);
        });

        imgContainer.addEventListener('click', () => openModal(item));

        // Add image indicator dots below the image container for the carousel
        const imageIndicator = createImageIndicator(item.imgSrc.length, 0);
        carouselItem.appendChild(imgContainer);
        carouselItem.appendChild(imageIndicator);

        const title = createTextElement('h3', 'title', item.title);
        const description = createTextElement('p', 'description', item.description);
        const price = createTextElement('p', 'price', item.price);
        const voteButton = createVoteButton(item);

        carouselItem.append(title, description, price, voteButton);
        carousel.appendChild(carouselItem);

        // Add swipe functionality for images within imgContainer
        addSwipeFunctionality(imgContainer, item.imgSrc.length, imageIndicator);
    });
}

/**
 * Creates an image indicator for the carousel images.
 */
function createImageIndicator(length, currentImageIndex) {
    const imageIndicator = document.createElement('div');
    imageIndicator.className = 'image-indicator';
    for (let i = 0; i < length; i++) {
        const dot = document.createElement('span');
        dot.className = 'indicator-dot' + (i === currentImageIndex ? ' active' : '');
        imageIndicator.appendChild(dot);
    }
    return imageIndicator;
}

/**
 * Adds swipe functionality to the image container.
 */
function addSwipeFunctionality(container, length, indicator) {
    let startX = 0, currentImageIndex = 0;

    container.addEventListener('mousedown', e => { startX = e.clientX; });
    container.addEventListener('mouseup', e => handleSwipe(e.clientX - startX));
    container.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    container.addEventListener('touchend', e => handleSwipe(e.changedTouches[0].clientX - startX));

    function handleSwipe(deltaX) {
        if (Math.abs(deltaX) > 50) {
            const images = container.querySelectorAll('.carousel-image');
            images[currentImageIndex].style.display = 'none';
            indicator.children[currentImageIndex].classList.remove('active');
            currentImageIndex = deltaX < 0 ? (currentImageIndex + 1) % length : (currentImageIndex - 1 + length) % length;
            images[currentImageIndex].style.display = 'block';
            indicator.children[currentImageIndex].classList.add('active');
        }
    }
}

/**
 * Opens a modal to display images of the selected product.
 */
function openModal(item) {
    const modal = document.getElementById('modal');
    const modalImageContainer = document.getElementById('modal-image-container');
    modalImageContainer.innerHTML = ''; // Clear previous images

    item.imgSrc.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'modal-image';
        img.style.display = index === 0 ? 'block' : 'none'; // Show only the first image initially
        modalImageContainer.appendChild(img);
    });

    modal.classList.add('active'); // Show modal
    let currentImageIndex = 0;
    setupModalNavigation(modalImageContainer, item.imgSrc.length, currentImageIndex);
}

/**
 * Sets up navigation within the modal for swipe and button navigation.
 */
function setupModalNavigation(container, length, currentImageIndex) {
    const images = container.querySelectorAll('.modal-image');
    const leftButton = document.querySelector('.modal-nav-left');
    const rightButton = document.querySelector('.modal-nav-right');

    if (!leftButton || !rightButton) {
        console.error("Modal navigation buttons not found.");
        return;
    }

    function updateImageIndex(newIndex) {
        images[currentImageIndex].style.display = 'none';
        currentImageIndex = (newIndex + length) % length;
        images[currentImageIndex].style.display = 'block';
    }

    leftButton.onclick = () => updateImageIndex(currentImageIndex - 1);
    rightButton.onclick = () => updateImageIndex(currentImageIndex + 1);

    // Swipe functionality
    let startX = 0;
    container.addEventListener('mousedown', e => { startX = e.clientX; });
    container.addEventListener('mouseup', e => handleSwipe(e.clientX - startX));
    container.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    container.addEventListener('touchend', e => handleSwipe(e.changedTouches[0].clientX - startX));

    function handleSwipe(deltaX) {
        if (Math.abs(deltaX) > 50) {
            updateImageIndex(deltaX < 0 ? currentImageIndex + 1 : currentImageIndex - 1);
        }
    }
}

/**
 * Creates a text element (title or description) for a product.
 */
function createTextElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

/**
 * Creates a vote button for a product item with voting functionality.
 */
function createVoteButton(item) {
    const button = document.createElement('button');
    button.className = 'vote-button';
    button.textContent = 'Vote';
    
    button.addEventListener('click', async () => {
        try {
            const productRef = doc(db, "kaaykoproducts", item.id);
            await updateDoc(productRef, { votes: (item.votes || 0) + 1 });
            button.textContent = `${(item.votes || 0) + 1} Votes`;
            button.disabled = true;
        } catch (error) {
            console.error("Error updating vote count:", error);
        }
    });

    return button;
}

/**
 * Sets up modal close functionality.
 */
function setupModalCloseHandlers() {
    const modal = document.getElementById('modal');
    const closeButton = document.getElementById('close-modal-button');

    if (closeButton) {
        closeButton.onclick = () => closeModal(modal);
    }
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
    });
}

/**
 * Closes the modal.
 */
function closeModal(modal) {
    modal.classList.remove('active');
}