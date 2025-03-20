// Array of JSON file paths from the new set
const jsonFiles = [
    'backpack1.json', 'backpack2.json',
    'Base.json', // Base is always visible
    'face1.json', 'face2.json', // Both faces must always be visible
	'socks1.json',
	    'shoes1.json', 'shoes2.json',
		'dress1.json', 'dress2.json',
		    'bag1.json', 'bag2.json',
		'scarf1.json', 'scarf2.json',
		 'bow1.json',
		 'hat1.json', 'hat2.json',

   
    


    
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

function toggleVisibility(itemId, categoryName) {
    const selectedItem = document.getElementById(itemId);
    if (!selectedItem) return;

    if (categoryName === 'base') return; // Prevent Base from being removed

    // Handle Face1 and Face2 separately to ensure one is always visible
    if (categoryName.startsWith('face1') || categoryName.startsWith('face2')) {
        const faceType = categoryName.startsWith('face1') ? 'face1' : 'face2';

        // Get all face items in the same face category
        const faceItems = document.querySelectorAll(`.${faceType}`);

        let isCurrentlyVisible = selectedItem.style.visibility === 'visible';

        // If the selected face item is already visible, do nothing (prevent turning it off)
        if (isCurrentlyVisible) return;

        // Hide all other face items in the same category
        faceItems.forEach(item => {
            item.style.visibility = 'hidden';
        });

        // Make the selected face item visible
        selectedItem.style.visibility = 'visible';

        return;
    }

    // For all other categories, ensure only one item in the category is visible at a time
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
}

// Ensure Base is always visible
function ensureBaseVisibility() {
    const baseItem = document.querySelector('.base');
    if (baseItem) baseItem.style.visibility = 'visible';
}

// Ensure both faces are always visible
function ensureFaceVisibility() {
    const faceItems = document.querySelectorAll('.face1, .face2');
    faceItems.forEach(face => {
        face.style.visibility = 'visible'; // Force both faces to stay visible
    });
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

// Start the game
function enterGame() {
    document.querySelector('.main-menu').style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';
}