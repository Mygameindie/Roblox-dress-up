// Store the currently active preset
let currentPreset = null;

function applyPreset(presetFunction) {
    if (currentPreset) {
        resetPreset(); // Remove previously applied preset
    }
    presetFunction(); // Apply the new preset
    currentPreset = presetFunction; // Track active preset
}

function resetPreset() {
    // Hide all items before applying a new preset, except Base and Face
    hideSpecificCategories([
        "top1", "top2", "pants1", "pants2", "skirt1", "skirt2",
        "shoes1", "shoes2", "jacket1", "jacket2", "dress1", "dress2",
        "hat1", "hat2", "backpack1", "backpack2", "bag1", "bag2",
        "bow1", "scarf1", "scarf2", "socks1"
    ]);

    ensureBaseVisibility();
    ensureFaceVisibility();
}

// Function to ensure Base is always visible
function ensureBaseVisibility() {
    const baseItem = document.querySelector('.base');
    if (baseItem) baseItem.style.visibility = 'visible';
}

// Function to ensure at least one face is always visible
function ensureFaceVisibility() {
    const faceItems = document.querySelectorAll('.face1, .face2');
    if (faceItems.length > 0 && [...faceItems].every(item => item.style.visibility === 'hidden')) {
        faceItems[0].style.visibility = 'visible';
    }
}

// Function to show an item (ensuring no stacking in each category)
function showItem(itemId, categoryName) {
    if (categoryName === 'base' || categoryName.startsWith('face')) return; // Prevent Base & Face from being affected by presets

    hideSpecificCategories([categoryName]);

    const selectedItem = document.getElementById(itemId);
    if (selectedItem) {
        selectedItem.style.visibility = "visible";
        selectedItem.style.display = "block";
        selectedItem.style.position = "absolute";
        selectedItem.style.left = "0";
        selectedItem.style.top = "0";
        selectedItem.style.zIndex = getZIndex(categoryName);
    } else {
        console.warn(`Item not found: ${itemId} in category ${categoryName}`);
    }
}

// Apply Default Preset
function applyDefaultPreset() {
    applyPreset(() => {
        showItem("backpack1_1.png", "backpack1");
        showItem("bag1_1.png", "bag1");
        showItem("bag2_1.png", "bag2");
        showItem("hat2_1.png", "hat2");
        showItem("scarf1_1.png", "scarf1");
    });
}

// Apply Birthday Preset
function applyBirthdayPreset() {
    applyPreset(() => {
        showItem("backpack1_1.png", "backpack1");
        showItem("bag1_1.png", "bag1");
        showItem("bag2_1.png", "bag2");
        showItem("bow1_1.png", "bow1");
        showItem("hat1_4.png", "hat1");
        showItem("hat2_1.png", "hat2");
    });
}

// Apply Sun & Moon Preset
function applySunMoonPreset() {
    applyPreset(() => {
        showItem("backpack1_4.png", "backpack1");
        showItem("backpack2_3.png", "backpack2");
        showItem("dress1_1.png", "dress1");
        showItem("dress2_2.png", "dress2");
        showItem("hat2_4.png", "hat2");
        showItem("scarf1_4.png", "scarf1");
        showItem("scarf2_1.png", "scarf2");
        showItem("shoes1_2.png", "shoes1");
        showItem("shoes2_2.png", "shoes2");
    });
}

// Apply Sea Creature Preset
function applySeaCreaturePreset() {
    applyPreset(() => {
        showItem("backpack1_3.png", "backpack1");
        showItem("backpack2_2.png", "backpack2");
        showItem("bag1_3.png", "bag1");
        showItem("bag1_4.png", "bag1");
        showItem("hat1_2.png", "hat1");
        showItem("hat2_3b.png", "hat2");
        showItem("scarf1_3b.png", "scarf1");
    });
}

// Apply Halloween Preset
function applyHalloweenPreset() {
    applyPreset(() => {
        showItem("backpack1_2.png", "backpack1");
        showItem("backpack2_1.png", "backpack2");
        showItem("bag1_2.png", "bag1");
        showItem("dress2_1.png", "dress2");
        showItem("hat1_1.png", "hat1");
        showItem("hat2_2.png", "hat2");
        showItem("scarf1_2.png", "scarf1");
        showItem("shoes2_1.png", "shoes2");
        showItem("socks1_1.png", "socks1");
    });
}

// Helper function to hide items for specific categories
function hideSpecificCategories(categories) {
    categories.forEach(category => {
        const items = document.querySelectorAll(`.${category}`);
        items.forEach(item => {
            item.style.visibility = 'hidden';
        });
    });
}