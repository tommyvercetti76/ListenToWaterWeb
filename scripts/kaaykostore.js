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

// Event listener to trigger data fetching and modal setup when the page content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchProductData();
    setupModalCloseHandlers();
});

/**
 * Fetches product data from Firestore and populates the carousel.
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
 * @param {string} productID - The unique ID of the product.
 * @returns {Promise<Array<string>>} - Array of image URLs.
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
 * @param {Array<Object>} items - The product items to display in the carousel.
 */
function populateCarousel(items) {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = '';

    items.forEach(item => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';

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

        // Image indicators for the carousel
        const imageIndicator = createImageIndicator(item.imgSrc.length, 0);
        carouselItem.appendChild(imgContainer);
        carouselItem.appendChild(imageIndicator);

        // Add text elements (title, description, price) and the like button
        const title = createTextElement('h3', 'title', item.title);
        const description = createTextElement('p', 'description', item.description);
        const price = createTextElement('p', 'price', item.price);
        const likeButtonContainer = createLikeButton(item);

        // Append text and buttons to the carousel item
        carouselItem.append(title, description, price, likeButtonContainer);
        carousel.appendChild(carouselItem);

        // Add swipe functionality for images within imgContainer
        addSwipeFunctionality(imgContainer, item.imgSrc.length, imageIndicator);
    });
}

/**
 * Creates an image indicator for the carousel images.
 * @param {number} length - The number of images.
 * @param {number} currentImageIndex - The index of the currently displayed image.
 * @returns {HTMLElement} - A div containing indicator dots.
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
 * Allows users to swipe through images in the carousel.
 * @param {HTMLElement} container - The image container element.
 * @param {number} length - The number of images in the container.
 * @param {HTMLElement} indicator - The indicator for tracking the current image.
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
 * @param {Object} item - The product item data.
 */
function openModal(item) {
    const modal = document.getElementById('modal');
    const modalImageContainer = document.getElementById('modal-image-container');
    modalImageContainer.innerHTML = '';

    item.imgSrc.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'modal-image';
        img.style.display = index === 0 ? 'block' : 'none';
        modalImageContainer.appendChild(img);
    });

    modal.classList.add('active');
    let currentImageIndex = 0;
    setupModalNavigation(modalImageContainer, item.imgSrc.length, currentImageIndex);
}

/**
 * Sets up navigation within the modal for swipe and button navigation.
 * Allows users to navigate images in the modal with buttons and swipe.
 * @param {HTMLElement} container - The modal image container element.
 * @param {number} length - The number of images in the container.
 * @param {number} currentImageIndex - Tracks the current image being displayed.
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
 * @param {string} tag - The HTML tag for the element.
 * @param {string} className - The class name to apply to the element.
 * @param {string} text - The text content of the element.
 * @returns {HTMLElement} - The created text element.
 */
function createTextElement(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

/**
 * Creates a like button for a product item with toggle functionality to track likes.
 * @param {Object} item - The product item.
 * @returns {HTMLElement} - The created heart button container with like count.
 */
function createLikeButton(item) {
    const button = document.createElement('button');
    button.className = 'heart-button';
    let isLiked = item.isLiked || false;  // Track if the user has liked the item
    let currentLikes = item.likes || 0;

    // Display current likes beside the button
    const likesCount = document.createElement('span');
    likesCount.className = 'likes-count';
    likesCount.textContent = `${currentLikes} Likes`;

    // Set initial visual state
    updateHeartButtonVisuals();

    button.addEventListener('click', async () => {
        try {
            // Toggle like state
            isLiked = !isLiked;
            currentLikes = isLiked ? currentLikes + 1 : currentLikes - 1;

            // Update Firestore with new like count and state
            const productRef = doc(db, "kaaykoproducts", item.id);
            await updateDoc(productRef, { likes: currentLikes, isLiked: isLiked });

            // Update visual state and like count display
            updateHeartButtonVisuals();
            likesCount.textContent = `${currentLikes} Likes`;
        } catch (error) {
            console.error("Error updating like count:", error);
        }
    });

    // Update the button’s appearance based on the like state
    function updateHeartButtonVisuals() {
        if (isLiked) {
            button.classList.add('liked');
        } else {
            button.classList.remove('liked');
        }
    }

    // Create a container for the heart button and like count
    const container = document.createElement('div');
    container.append(button, likesCount);
    return container;
}

/**
 * Sets up modal close functionality.
 * Allows closing the modal by clicking the close button or clicking outside the modal content.
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
 * @param {HTMLElement} modal - The modal element to close.
 */
function closeModal(modal) {
    modal.classList.remove('active');
}