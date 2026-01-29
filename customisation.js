
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- OPTIONS ARRAYS (50+ ENTRIES EACH) ---

export const bgOptions = Array.from({ length: 50 }, (_, i) => ({
    id: `bg-theme-${i + 1}`,
    name: `Theme ${i + 1}`
}));

// Naming a few specific ones for UI flavor
bgOptions[0].name = "Void Black";
bgOptions[1].name = "Matrix Code";
bgOptions[2].name = "Cyber Grid";
bgOptions[3].name = "Lava Lamp";
bgOptions[4].name = "Deep Space";
bgOptions[49].name = "Glitch Storm";

export const nameOptions = Array.from({ length: 50 }, (_, i) => ({
    id: `name-fx-${i + 1}`,
    name: `Effect ${i + 1}`
}));

nameOptions[0].name = "Standard";
nameOptions[1].name = "Neon Pink";
nameOptions[2].name = "Gold Leaf";
nameOptions[3].name = "Ice Shimmer";
nameOptions[49].name = "Corrupted";

export const bioOptions = Array.from({ length: 50 }, (_, i) => ({
    id: `bio-fx-${i + 1}`,
    name: `Style ${i + 1}`
}));

bioOptions[0].name = "Standard";
bioOptions[1].name = "Terminal Green";
bioOptions[2].name = "Gothic Red";
bioOptions[49].name = "Rainbow Wave";


// --- UI BUILDER ---

export function initCustomizationUI(container, user, db, currentStyles = {}) {
    container.innerHTML = '';
    container.className = "w-full h-full flex flex-col bg-gray-900 text-white relative";

    // Styles State
    let selection = {
        background: currentStyles.background || 'bg-theme-1',
        name: currentStyles.name || 'name-fx-1',
        bio: currentStyles.bio || 'bio-fx-1'
    };

    // Header / Tabs
    const header = document.createElement('div');
    header.className = "flex border-b-2 border-white bg-black";
    
    const tabs = ['BACKGROUND', 'NAME_FX', 'BIO_STYLE'];
    let activeTab = 'BACKGROUND';

    const renderTabs = () => {
        header.innerHTML = '';
        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.className = `flex-1 py-2 font-pixel text-[8px] md:text-[10px] hover:bg-purple-900 transition-colors ${activeTab === tab ? 'bg-purple-600 text-white' : 'text-gray-400'}`;
            btn.innerText = tab;
            btn.onclick = () => { activeTab = tab; renderContent(); renderTabs(); };
            header.appendChild(btn);
        });
    };

    // Content Area
    const contentArea = document.createElement('div');
    contentArea.className = "flex-1 overflow-y-auto p-2 grid grid-cols-3 gap-2";

    const renderContent = () => {
        contentArea.innerHTML = '';
        let options = [];
        let currentKey = '';

        if (activeTab === 'BACKGROUND') { options = bgOptions; currentKey = 'background'; }
        if (activeTab === 'NAME_FX') { options = nameOptions; currentKey = 'name'; }
        if (activeTab === 'BIO_STYLE') { options = bioOptions; currentKey = 'bio'; }

        options.forEach(opt => {
            const item = document.createElement('div');
            item.className = `cursor-pointer border border-gray-600 p-2 text-center text-[8px] hover:border-white transition-all ${selection[currentKey] === opt.id ? 'border-yellow-400 bg-gray-800' : 'bg-black'}`;
            
            // Preview Logic inside the button
            if (activeTab === 'BACKGROUND') {
                item.classList.add(opt.id); // Apply background class to button
                item.style.height = "50px";
            } else if (activeTab === 'NAME_FX') {
                const span = document.createElement('span');
                span.className = `font-bold text-lg ${opt.id}`;
                span.innerText = "Aa";
                item.appendChild(span);
            } else {
                const span = document.createElement('span');
                span.className = `font-bold text-xs ${opt.id}`;
                span.innerText = "Abc";
                item.appendChild(span);
            }

            // Label
            const label = document.createElement('div');
            label.className = "mt-1 truncate font-pixel text-[6px]";
            label.innerText = opt.name;
            item.appendChild(label);

            item.onclick = async () => {
                selection[currentKey] = opt.id;
                
                // Optimistic Update (Flash Preview)
                applyProfileStyles(document.getElementById('profile-modal'), selection);
                
                // Re-render to show selection border
                renderContent();

                // Save to Firestore
                try {
                    await updateDoc(doc(db, "users", user.uid), {
                        profileStyles: selection
                    });
                } catch(e) {
                    console.error("Save failed", e);
                }
            };

            contentArea.appendChild(item);
        });
    };

    // Footer (Close)
    const footer = document.createElement('div');
    footer.className = "border-t-2 border-white p-2 flex justify-end bg-black";
    const closeBtn = document.createElement('button');
    closeBtn.innerText = "DONE";
    closeBtn.className = "brutal-btn px-4 py-1 text-[10px]";
    closeBtn.onclick = () => {
        // Reload profile view
        window.openProfile(user.uid); 
    };
    footer.appendChild(closeBtn);

    renderTabs();
    renderContent();

    container.appendChild(header);
    container.appendChild(contentArea);
    container.appendChild(footer);
}

// Helper to apply styles to a container (Profile Modal)
export function applyProfileStyles(modalElement, styles) {
    if (!styles) return;

    // 1. Background
    // Remove old themes
    const classesToRemove = Array.from(modalElement.classList).filter(c => c.startsWith('bg-theme-'));
    modalElement.classList.remove(...classesToRemove);
    if (styles.background) modalElement.classList.add(styles.background);

    // 2. Name FX
    const nameEl = modalElement.querySelector('#modal-name');
    if (nameEl) {
        const nameClasses = Array.from(nameEl.classList).filter(c => c.startsWith('name-fx-'));
        nameEl.classList.remove(...nameClasses);
        if (styles.name) nameEl.classList.add(styles.name);
    }

    // 3. Bio FX
    const bioEl = modalElement.querySelector('#modal-bio');
    if (bioEl) {
        const bioClasses = Array.from(bioEl.classList).filter(c => c.startsWith('bio-fx-'));
        bioEl.classList.remove(...bioClasses);
        if (styles.bio) bioEl.classList.add(styles.bio);
    }
}
