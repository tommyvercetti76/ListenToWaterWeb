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
const db = getFirestore(app); // Firestore instance
const storage = getStorage(app); // Storage instance for images

// Expose filter functions to the global window object
window.toggleFilterChips = toggleFilterChips;
window.toggleChip = toggleChip;

// DOM content load event to initialize fetching product data and setting up modal handlers
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded. Fetching product data...');
    fetchProductData(); // Load product data
    setupModalCloseHandlers(); // Set up modal close functionality
});

/**
 * Fetch product data from Firestore 'kaaykoproducts' collection and augment with images from Firebase Storage.
 */
async function fetchProductData() {
    try {
        const querySnapshot = await getDocs(collection(db, "kaaykoproducts"));
        const items = [];

        querySnapshot.forEach(doc => {
            const item = doc.data();
            item.id = doc.id; // Save document ID

            fetchImagesByProductId(item.productID).then(images => {
                item.imgSrc = images; // Attach images to item
                items.push(item);

                if (items.length === querySnapshot.size) {
                    window.carouselItems = items; // Store items for filtering
                    populateCarousel(window.carouselItems);
                }
            });
        });
    } catch (error) {
        console.error("Error fetching product data:", error);
    }
}

/**
 * Retrieve image URLs for a product from Firebase Storage.
 * @param {string} productID - Unique ID for product images.
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
 * Populate the carousel with product items, displaying images, details, price, and vote button.
 * @param {Array<Object>} items - Array of product objects.
 */
function populateCarousel(items) {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = '';

    items.forEach(item => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';

        // Image container and images
        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';
        let currentImageIndex = 0;
        const images = item.imgSrc.map((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'carousel-image';
            img.style.display = index === currentImageIndex ? 'block' : 'none';
            return img;
        });
        images.forEach(img => imgContainer.appendChild(img));

        // Image indicator dots
        const imageIndicator = document.createElement('div');
        imageIndicator.className = 'image-indicator';
        item.imgSrc.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'indicator-dot' + (index === currentImageIndex ? ' active' : '');
            imageIndicator.appendChild(dot);
        });
        imgContainer.appendChild(imageIndicator);
        carouselItem.appendChild(imgContainer);

        // Product details: title, description, price, and vote button
        const title = document.createElement('h3');
        title.className = 'title';
        title.textContent = item.title;

        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = item.description;

        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = item.price; // Use price range symbol (e.g., "$$")

        const voteButton = document.createElement('button');
        voteButton.className = 'vote-button';
        voteButton.textContent = 'Vote';

        const hasVoted = checkVoteCookie(item.id);
        if (hasVoted) {
            voteButton.classList.add('voted');
            voteButton.textContent = `${item.votes || 0} Votes`;
            voteButton.disabled = true;
        }

        voteButton.addEventListener('click', async () => {
            if (!hasVoted) {
                try {
                    const productRef = doc(db, "kaaykoproducts", item.id);
                    await updateDoc(productRef, {
                        votes: (item.votes || 0) + 1
                    });
                    item.votes = (item.votes || 0) + 1;
                    voteButton.classList.add('voted');
                    voteButton.textContent = `${item.votes} Votes`;
                    voteButton.disabled = true;
                    setVoteCookie(item.id);
                } catch (error) {
                    console.error("Error updating vote count:", error);
                }
            }
        });

        carouselItem.appendChild(title);
        carouselItem.appendChild(description);
        carouselItem.appendChild(price);
        carouselItem.appendChild(voteButton);
        carousel.appendChild(carouselItem);

        // Swipe functionality
        let startX = 0;
        imgContainer.addEventListener('mousedown', (e) => { startX = e.clientX; });
        imgContainer.addEventListener('mouseup', (e) => { handleSwipe(e.clientX - startX); });
        imgContainer.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
        imgContainer.addEventListener('touchend', (e) => { handleSwipe(e.changedTouches[0].clientX - startX); });

        function handleSwipe(deltaX) {
            if (Math.abs(deltaX) > 50) {
                images[currentImageIndex].style.display = 'none';
                imageIndicator.children[currentImageIndex].classList.remove('active');
                currentImageIndex = deltaX < 0 ? (currentImageIndex + 1) % images.length : (currentImageIndex - 1 + images.length) % images.length;
                images[currentImageIndex].style.display = 'block';
                imageIndicator.children[currentImageIndex].classList.add('active');
            }
        }
    });
}

/**
 * Filter management: toggle filter chips visibility and apply filters.
 */
function toggleFilterChips() {
    const filterChips = document.getElementById('filter-chips');
    filterChips.classList.toggle('hidden');
    filterChips.classList.toggle('active');
}

function toggleChip(chip) {
    chip.classList.toggle('selected');
    applyFilter();
}

function applyFilter() {
    const selectedAvailability = Array.from(document.querySelectorAll('.filter-chip.selected[data-filter]')).map(chip => chip.getAttribute('data-filter'));
    const selectedPrices = Array.from(document.querySelectorAll('.filter-chip.selected[data-price]')).map(chip => chip.getAttribute('data-price'));

    let filteredItems = window.carouselItems;
    if (selectedAvailability.length > 0) {
        filteredItems = filteredItems.filter(item => selectedAvailability.includes(item.availability));
    }
    if (selectedPrices.length > 0) {
        filteredItems = filteredItems.filter(item => selectedPrices.includes(item.price));
    }

    populateCarousel(filteredItems);
}

/**
 * Sets a cookie to track that the user has voted for a specific item.
 */
function setVoteCookie(id) {
    document.cookie = `voted_${id}=true; path=/; max-age=${60 * 60 * 24 * 30};`;
}

function checkVoteCookie(id) {
    return document.cookie.split(';').some(cookie => cookie.trim().startsWith(`voted_${id}=true`));
}

/**
 * Modal functionality
 */
function setupModalCloseHandlers() {
    const modal = document.getElementById('modal');
    modal.onclick = event => { if (event.target === modal) closeModal(); };
    document.getElementsByClassName("close")[0].onclick = closeModal;
}

function closeModal() {
    document.getElementById('modal').style.display = "none";
}