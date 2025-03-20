document.addEventListener("DOMContentLoaded", () => {
    const buttonContainer = document.querySelector(".scrollable-buttons");
    
    function generateButtons() {
        buttonContainer.innerHTML = ""; // Clear previous buttons

        // Preset Buttons
        const presetTitle = document.createElement("h3");
        presetTitle.textContent = "Presets";
        presetTitle.style.margin = "10px 0";
        buttonContainer.appendChild(presetTitle);

        const presets = [
            { "name": "Default", "action": applyDefaultPreset },
    { "name": "Halloween", "action": applyHalloweenPreset },
    { "name": "Sea Creature", "action": applySeaCreaturePreset },
    { "name": "Star & Moon", "action": applySunMoonPreset },
    { "name": "Birthday", "action": applyBirthdayPreset }
	
	];

        presets.forEach(preset => {
            const presetButton = document.createElement("button");
            presetButton.textContent = preset.name;
            presetButton.classList.add("preset-button");
            presetButton.onclick = preset.action;
            buttonContainer.appendChild(presetButton);
        });

        
        

        
    }

    function toggleItem(itemId) {
        const selectedItem = document.getElementById(itemId);

        if (selectedItem) {
            selectedItem.style.visibility = 
                selectedItem.style.visibility === "visible" ? "hidden" : "visible";
        } else {
            console.warn(`Item not found: ${itemId}`);
        }
    }

    generateButtons(); // Load buttons when the page loads
});