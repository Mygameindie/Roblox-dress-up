// Array of JSON file paths from the new set
const jsonFiles = [
    'backpack1.json', 'backpack2.json',
    'Base.json', // Base is always visible
    'face1.json', 'face2.json',
    'bag1.json', 'bag2.json',
    'bow1.json',
    'dress1.json', 'dress2.json',
    'hat1.json', 'hat2.json',
    'scarf1.json', 'scarf2.json',
    'shoes1.json', 'shoes2.json',
    'socks1.json',
];

// Helper function to set z-index for categories
function getZIndex(categoryName) {
    const zIndexMap = {
        backpack: 1, base: 2, face: 3, dress: 4, socks: 5, shoes: 6,
        scarf: 7, bow: 8, bag: 9, hat: 10
    };
    return zIndexMap[categoryName] || 0;
}

// Load each JSON file
async function loadItemFile(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Error loading file: ${file}`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to load ${file}:`, error);
        return [];
    }
}

// Load items in batches to improve performance
async function loadItemsInBatches(batchSize = 3) {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');

    for (let i = 0; i < jsonFiles.length; i += batchSize) {
        const batch = jsonFiles.slice(i, i + batchSize);

        await Promise.all(batch.map(async file => {
            const data = await loadItemFile(file);
            const categoryName = file.replace('.json', '');

            // Ensure Base is always visible
            if (categoryName === 'base') {
                data.forEach(item => {
                    const itemId = item.id.endsWith('.png') ? item.id : `${item.id}.png`;

                    const img = document.createElement('img');
                    img.id = itemId;
                    img.src = item.src;
                    img.alt = item.alt;
                    img.classList.add(categoryName);
                    img.setAttribute('data-file', file);
                    img.style.visibility = 'visible';
                    img.style.position = 'absolute';
                    img.style.zIndex = getZIndex(categoryName);
                    baseContainer.appendChild(img);
                });

                return; // Exit function for Base
            }

            // Load other categories
            const categoryContainer = document.createElement('div');
            categoryContainer.classList.add('category');

            const categoryHeading = document.createElement('h3');
            categoryHeading.textContent = categoryName;
            categoryContainer.appendChild(categoryHeading);

            data.forEach(item => {
                const itemId = item.id.endsWith('.png') ? item.id : `${item.id}.png`;

                const img = document.createElement('img');
                img.id = itemId;
                img.src = item.src;
                img.alt = item.alt;
                img.classList.add(categoryName);
                img.setAttribute('data-file', file);
                img.style.visibility = item.visibility === "visible" ? "visible" : "hidden";
                img.style.position = 'absolute';
                img.style.zIndex = getZIndex(categoryName);
                baseContainer.appendChild(img);

                const button = document.createElement('img');
                button.src = item.src.replace('.png', 'b.png');
                button.alt = item.alt + ' Button';
                button.classList.add('item-button');
                button.onclick = () => toggleVisibility(itemId, categoryName);
                categoryContainer.appendChild(button);
            });

            controlsContainer.appendChild(categoryContainer);
        }));

        await new Promise(resolve => setTimeout(resolve, 10)); // Small delay for performance
    }

    ensureBaseVisibility();
    ensureFaceVisibility();
}

// Toggle visibility of items, ensuring only one item per category is visible
function toggleVisibility(itemId, categoryName) {
    const selectedItem = document.getElementById(itemId);
    if (!selectedItem) return;

    if (categoryName === 'base' || categoryName.startsWith('face')) return; // Prevents base & face from being removed

    // For all categories, ensure only one item in the category is visible at a time
    if (selectedItem.style.visibility === 'visible') {
        selectedItem.style.visibility = 'hidden';
    } else {
        document.querySelectorAll(`.${categoryName}`).forEach(item => {
            if (item.id !== itemId) {
                item.style.visibility = 'hidden';
            }
        });
        selectedItem.style.visibility = 'visible';
    }

    ensureBaseVisibility();
    ensureFaceVisibility();
}

// Ensure Base is always visible
function ensureBaseVisibility() {
    const baseItem = document.querySelector('.base');
    if (baseItem) baseItem.style.visibility = 'visible';
}

// Ensure at least one face is always visible
function ensureFaceVisibility() {
    const faceItems = document.querySelectorAll('.face1, .face2');
    if (faceItems.length > 0 && [...faceItems].every(item => item.style.visibility === 'hidden')) {
        faceItems[0].style.visibility = 'visible';
    }
}

// Adjust layout based on screen size
function adjustCanvasLayout() {
    const baseContainer = document.querySelector('.base-container');
    const controlsContainer = document.querySelector('.controls');
    const screenWidth = window.innerWidth;

    requestAnimationFrame(() => {
        if (screenWidth <= 600) {
            baseContainer.classList.add('mobile-layout');
            controlsContainer.classList.add('mobile-controls');
        } else {
            baseContainer.classList.add('desktop-layout');
            controlsContainer.classList.add('desktop-controls');
        }
    });
}

// Load items and adjust layout when the window loads
window.onload = () => {
    loadItemsInBatches();
    adjustCanvasLayout();
};

// Function to remove focus from button after interaction
function blurButton(event) {
    event.preventDefault(); // Prevent default focus behavior
    event.target.blur(); // Remove focus from the button
}

// Button logic for Base2 and Base3

function pressButton1(event) {
    blurButton(event);
    document.getElementById("base2-image").style.display = "block";
}

function releaseButton1(event) {
    blurButton(event);
    document.getElementById("base2-image").style.display = "none";
}

function pressButton2(event) {
    blurButton(event);
    document.getElementById("base3-image").style.display = "block";
}

function releaseButton2(event) {
    blurButton(event);
    document.getElementById("base3-image").style.display = "none";
}

// Add event listeners to buttons (Support Desktop & Mobile)
document.addEventListener("DOMContentLoaded", () => {
    const button1 = document.querySelector(".button-1");
    const button2 = document.querySelector(".button-2");

    if (button1) {
        button1.addEventListener("mousedown", pressButton1);
        button1.addEventListener("mouseup", releaseButton1);
        button1.addEventListener("touchstart", pressButton1, { passive: false });
        button1.addEventListener("touchend", releaseButton1, { passive: false });
    }

    if (button2) {
        button2.addEventListener("mousedown", pressButton2);
        button2.addEventListener("mouseup", releaseButton2);
        button2.addEventListener("touchstart", pressButton2, { passive: false });
        button2.addEventListener("touchend", releaseButton2, { passive: false });
    }
});

// Start the game
function enterGame() {
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
}