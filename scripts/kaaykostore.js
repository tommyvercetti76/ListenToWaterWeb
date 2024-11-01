// Import necessary Firebase modules for Firebase v9
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

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
const db = getFirestore(app); // Firestore instance for database operations
const storage = getStorage(app); // Storage instance for accessing images

// Event listener for DOM content load to ensure elements are available
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded. Fetching product data...');
    fetchProductData(); // Load product data from Firestore
    setupFilterHandlers(); // Initialize filter controls for user selection
    setupModalCloseHandlers(); // Initialize modal close functionality
});

/**
 * fetchProductData()
 * Retrieves product data from the Firestore 'kaaykoproducts' collection.
 * Each product is then augmented with image URLs from Firebase Storage.
 */
async function fetchProductData() {
    try {
        // Fetch products from the Firestore 'kaaykoproducts' collection
        const querySnapshot = await getDocs(collection(db, "kaaykoproducts"));
        const items = [];

        querySnapshot.forEach(doc => {
            const item = doc.data();
            item.id = doc.id; // Store the document ID

            // Fetch images for each product based on its productID
            fetchImagesByProductId(item.productID).then(images => {
                item.imgSrc = images; // Attach fetched image URLs to the item
                items.push(item);

                // Populate the carousel once all items have been processed
                if (items.length === querySnapshot.size) {
                    window.carouselItems = items; // Store globally for filtering
                    populateCarousel(window.carouselItems);
                }
            });
        });
    } catch (error) {
        console.error("Error fetching product data:", error);
    }
}

/**
 * fetchImagesByProductId(productID)
 * Retrieves all image URLs for a product from Firebase Storage using the productID.
 * @param {string} productID - Unique identifier for each product used to locate its images.
 * @returns {Promise<Array<string>>} - Array of URLs for product images.
 */
async function fetchImagesByProductId(productID) {
    try {
        const storageRef = ref(storage, `kaaykoStoreTShirtImages/${productID}`); // Reference to product images
        const result = await listAll(storageRef); // List all items (images) in the product's folder
        return await Promise.all(result.items.map(imageRef => getDownloadURL(imageRef))); // Get URLs for all images
    } catch (error) {
        console.error("Error fetching images:", error);
        return []; // Return an empty array if an error occurs
    }
}

/**
 * populateCarousel(items)
 * Renders the products in the carousel, displaying one image at a time for each product with swipe support and a vote button.
 * @param {Array<Object>} items - Array of product objects to display.
 */
function populateCarousel(items) {
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = ''; // Clear any existing items

    items.forEach(item => {
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';

        // Create the image container
        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';

        // Initialize image index and create image elements
        let currentImageIndex = 0;
        const images = item.imgSrc.map((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = item.title;
            img.className = 'carousel-image';
            img.style.display = index === currentImageIndex ? 'block' : 'none';
            return img;
        });

        images.forEach(img => imgContainer.appendChild(img));

        // Create image indicator dots
        const imageIndicator = document.createElement('div');
        imageIndicator.className = 'image-indicator';

        item.imgSrc.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'indicator-dot' + (index === currentImageIndex ? ' active' : '');
            imageIndicator.appendChild(dot);
        });

        imgContainer.appendChild(imageIndicator);
        carouselItem.appendChild(imgContainer);

        // Create product details
        const title = document.createElement('h3');
        title.className = 'title';
        title.textContent = item.title;

        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = item.description;

        const price = document.createElement('p');
        price.className = 'price';
        price.textContent = formatPrice(item.price);

        // Voting functionality
        const voteButton = document.createElement('button');
        voteButton.className = 'vote-button';
        voteButton.textContent = 'Vote';
        
        // Check if the user has already voted for this item
        const hasVoted = checkVoteCookie(item.id);
        if (hasVoted) {
            voteButton.classList.add('voted');
            voteButton.textContent = `${item.votes || 0} Votes`;
            voteButton.disabled = true;
        }

        voteButton.addEventListener('click', async () => {
            if (!hasVoted) {
                try {
                    // Reference to the Firestore document
                    const productRef = doc(db, "kaaykoproducts", item.id); // Corrected doc usage
                    await updateDoc(productRef, {
                        votes: (item.votes || 0) + 1 // Increment vote count in Firestore
                    });
        
                    // Update UI and cookie after successful vote
                    item.votes = (item.votes || 0) + 1;
                    voteButton.classList.add('voted');
                    voteButton.textContent = `${item.votes} Votes`;
                    voteButton.disabled = true;
                    setVoteCookie(item.id); // Store the vote in a cookie
                } catch (error) {
                    console.error("Error updating vote count:", error);
                }
            }
        });

        carouselItem.appendChild(title);
        carouselItem.appendChild(description);
        carouselItem.appendChild(price);
        carouselItem.appendChild(voteButton);

        // Append the item to the carousel
        carousel.appendChild(carouselItem);

        // Swipe Functionality for Touch and Mouse
        let startX = 0;
        imgContainer.addEventListener('mousedown', (e) => {
            startX = e.clientX;
        });
        imgContainer.addEventListener('mouseup', (e) => {
            handleSwipe(e.clientX - startX);
        });
        imgContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        imgContainer.addEventListener('touchend', (e) => {
            handleSwipe(e.changedTouches[0].clientX - startX);
        });

        function handleSwipe(deltaX) {
            if (Math.abs(deltaX) > 50) { // Only trigger on a significant horizontal swipe
                images[currentImageIndex].style.display = 'none';
                imageIndicator.children[currentImageIndex].classList.remove('active');

                if (deltaX < 0) {
                    // Swipe left to go to the next image
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                } else {
                    // Swipe right to go to the previous image
                    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                }

                images[currentImageIndex].style.display = 'block';
                imageIndicator.children[currentImageIndex].classList.add('active');
            }
        }
    });
}

/**
 * setVoteCookie(id)
 * Sets a cookie to track that the user has voted for a specific item.
 * @param {string} id - The ID of the item the user has voted for.
 */
function setVoteCookie(id) {
    document.cookie = `voted_${id}=true; path=/; max-age=${60 * 60 * 24 * 30};`;
}

/**
 * checkVoteCookie(id)
 * Checks if the user has already voted for a specific item.
 * @param {string} id - The ID of the item to check.
 * @returns {boolean} - True if the user has voted for this item, false otherwise.
 */
function checkVoteCookie(id) {
    return document.cookie.split(';').some(cookie => cookie.trim().startsWith(`voted_${id}=true`));
}

/**
 * setupFilterHandlers()
 * Sets up event listeners for category and availability filters,
 * allowing users to filter displayed products based on selected criteria.
 */
function setupFilterHandlers() {
    const categoryFilter = document.getElementById('category-filter');
    const availabilityFilter = document.getElementById('availability-filter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterItems);
    } else {
        console.warn('Category filter element not found');
    }

    if (availabilityFilter) {
        availabilityFilter.addEventListener('change', filterItems);
    } else {
        console.warn('Availability filter element not found');
    }
}

/**
 * filterItems()
 * Filters products based on selected category and availability values,
 * then repopulates the carousel with the filtered list.
 */
function filterItems() {
    const category = document.getElementById('category-filter').value;
    const availability = document.getElementById('availability-filter').value;

    let filteredItems = window.carouselItems; // Start with the full list of items

    // Apply category filter if a specific category is selected
    if (category !== "All") filteredItems = filteredItems.filter(item => item.category === category);

    // Apply availability filter
    if (availability === "Available") filteredItems = filteredItems.filter(item => item.isAvailable);
    if (availability === "Unavailable") filteredItems = filteredItems.filter(item => !item.isAvailable);

    populateCarousel(filteredItems); // Repopulate carousel with filtered items
}

/**
 * openModal(item)
 * Opens a modal window to display detailed information about a selected product.
 * @param {Object} item - Product object containing details to display in the modal.
 */
function openModal(item) {
    // Generate HTML for each image to display in the modal
    const imagesHtml = item.imgSrc.map(src => `<img src="${src}" alt="${item.title}" style="width:100%;">`).join('');
    document.getElementById('modal-image').innerHTML = imagesHtml;
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-description').textContent = item.description;
    document.getElementById('modal-price').textContent = `Price: ${formatPrice(item.price)}`;
    document.getElementById('modal').style.display = "block"; // Show the modal
}

/**
 * closeModal()
 * Closes the currently open modal window.
 */
function closeModal() {
    document.getElementById('modal').style.display = "none";
}

/**
 * setupModalCloseHandlers()
 * Adds event listeners to close the modal when clicking outside the modal content
 * or on the close button.
 */
function setupModalCloseHandlers() {
    const modal = document.getElementById('modal');
    modal.onclick = event => { if (event.target === modal) closeModal(); }; // Close on outside click
    document.getElementsByClassName("close")[0].onclick = closeModal; // Close on button click
}

/**
 * formatPrice(price)
 * Formats a numeric price value as a currency string.
 * @param {number} price - The price to format.
 * @returns {string} - Formatted price with a dollar sign and two decimal places.
 */
function formatPrice(price) {
    return `$${Number(price).toFixed(2)}`; // Format price with two decimal places
}