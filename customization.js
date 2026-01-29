
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- OPTIONS ARRAYS (50+ ENTRIES EACH) ---

export const bgOptions = Array.from({ length: 50 }, (_, i) => ({
    id: `bg-theme-${i + 1}`,
    name: `Theme ${i + 1}`
}));

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

export const textColorOptions = Array.from({ length: 50 }, (_, i) => ({
    id: `msg-text-${i + 1}`,
    name: `Color ${i + 1}`
}));

textColorOptions[0].name = "Standard White";
textColorOptions[1].name = "Neon Green";
textColorOptions[2].name = "Hot Pink";
textColorOptions[3].name = "Cyber Blue";
textColorOptions[49].name = "Rainbow Flow";


// --- UI BUILDER ---

export function initCustomizationUI(container, user, db, currentStyles = {}) {
    container.innerHTML = '';
    // Main Split Layout: Left Preview, Right Controls
    container.className = "w-full h-full flex flex-col md:flex-row bg-gray-900 text-white overflow-hidden";

    // Styles State
    let selection = {
        background: currentStyles.background || 'bg-theme-1',
        name: currentStyles.name || 'name-fx-1',
        bio: currentStyles.bio || 'bio-fx-1',
        textColor: currentStyles.textColor || 'msg-text-1'
    };

    // --- LEFT: PREVIEW AREA ---
    const previewPane = document.createElement('div');
    previewPane.className = "w-full md:w-1/2 h-1/3 md:h-full relative border-b-4 md:border-b-0 md:border-r-4 border-white flex items-center justify-center p-6 bg-black overflow-hidden relative";
    
    // Background layer for preview (Separate div to apply bg styles easily)
    const previewBg = document.createElement('div');
    previewBg.className = "absolute inset-0 z-0 " + selection.background; // Apply initial bg
    previewPane.appendChild(previewBg);

    // Card Container (Floats above background)
    const card = document.createElement('div');
    card.className = "w-full max-w-[300px] border-4 border-white p-4 relative brutal-shadow bg-gray-900/80 backdrop-blur-md flex flex-col gap-3 z-10";
    
    // We grab user data from the DOM just in case, or fallback to defaults
    const pfpSrc = document.getElementById('modal-pfp')?.src || "https://api.dicebear.com/7.x/pixel-art/svg?seed=Meme";
    const bannerSrc = document.getElementById('modal-banner')?.src || "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif";
    const displayName = user.displayName || "YOU";

    card.innerHTML = `
        <div class="h-20 bg-purple-900 relative overflow-hidden group border-2 border-white">
             <img src="${bannerSrc}" class="w-full h-full object-cover opacity-80">
        </div>
        <div class="absolute top-16 left-4 w-14 h-14 border-2 border-white bg-black z-10">
             <img src="${pfpSrc}" class="w-full h-full object-cover">
        </div>
        <div class="mt-6">
            <h2 id="prev-name" class="font-glitch text-xl truncate ${selection.name}">${displayName}</h2>
            <div id="prev-bio" class="text-xs mt-2 p-2 border-l-2 border-pink-500 min-h-[30px] ${selection.bio}">
                Previewing your bio style... The void stares back.
            </div>
            <div class="mt-2 text-[8px] text-gray-400 font-pixel">LVL: 999 | CHAT PREVIEW:</div>
            <div class="mt-1 text-xs ${selection.textColor}">"Hello World"</div>
        </div>
    `;
    previewPane.appendChild(card);
    container.appendChild(previewPane);


    // --- RIGHT: CONTROLS AREA ---
    const controlsPane = document.createElement('div');
    controlsPane.className = "w-full md:w-1/2 flex flex-col h-2/3 md:h-full bg-gray-900 relative z-20";

    // Header / Tabs
    const header = document.createElement('div');
    header.className = "flex border-b-2 border-white bg-black shrink-0 flex-wrap"; 
    
    const tabs = ['BACKGROUND', 'NAME_FX', 'BIO_STYLE', 'TEXT_COLOR'];
    let activeTab = 'BACKGROUND';

    const renderTabs = () => {
        header.innerHTML = '';
        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.className = `flex-1 py-3 font-pixel text-[8px] md:text-[10px] hover:bg-purple-900 transition-colors ${activeTab === tab ? 'bg-purple-600 text-white' : 'text-gray-400'}`;
            btn.innerText = tab.replace('_', ' ');
            btn.onclick = () => { activeTab = tab; renderContent(); renderTabs(); };
            header.appendChild(btn);
        });
    };

    // Content Area
    const contentArea = document.createElement('div');
    contentArea.className = "flex-1 overflow-y-auto p-2 grid grid-cols-4 gap-2 content-start bg-gray-800";

    const renderContent = () => {
        contentArea.innerHTML = '';
        let options = [];
        let currentKey = '';

        if (activeTab === 'BACKGROUND') { options = bgOptions; currentKey = 'background'; }
        if (activeTab === 'NAME_FX') { options = nameOptions; currentKey = 'name'; }
        if (activeTab === 'BIO_STYLE') { options = bioOptions; currentKey = 'bio'; }
        if (activeTab === 'TEXT_COLOR') { options = textColorOptions; currentKey = 'textColor'; }

        options.forEach(opt => {
            const item = document.createElement('div');
            item.className = `cursor-pointer border border-gray-600 aspect-square flex flex-col items-center justify-center hover:border-white transition-all relative overflow-hidden group ${selection[currentKey] === opt.id ? 'border-yellow-400 ring-2 ring-yellow-400 z-10' : 'bg-black'}`;
            
            // Visual Preview inside button
            if (activeTab === 'BACKGROUND') {
                item.classList.add(opt.id); 
            } else if (activeTab === 'NAME_FX') {
                const span = document.createElement('span');
                span.className = `font-bold text-lg ${opt.id}`;
                span.innerText = "Aa";
                item.appendChild(span);
            } else if (activeTab === 'TEXT_COLOR') {
                 const span = document.createElement('span');
                 span.className = `font-bold text-sm ${opt.id}`;
                 span.innerText = "Tx";
                 item.appendChild(span);
            } else {
                const span = document.createElement('span');
                span.className = `font-bold text-xs ${opt.id}`;
                span.innerText = "Bi";
                item.appendChild(span);
            }

            // Label
            const label = document.createElement('div');
            label.className = "absolute bottom-0 w-full bg-black/70 text-[6px] text-center py-1 font-pixel truncate px-1";
            label.innerText = opt.name;
            item.appendChild(label);

            item.onclick = async () => {
                selection[currentKey] = opt.id;
                
                // 1. Update Preview Pane Immediately
                if(currentKey === 'background') {
                    previewBg.className = "absolute inset-0 z-0 " + opt.id;
                } else if (currentKey === 'name') {
                    const el = card.querySelector('#prev-name');
                    // Reset classes
                    el.className = "font-glitch text-xl truncate " + opt.id;
                } else if (currentKey === 'bio') {
                    const el = card.querySelector('#prev-bio');
                    el.className = "text-xs mt-2 p-2 border-l-2 border-pink-500 min-h-[30px] " + opt.id;
                } else if (currentKey === 'textColor') {
                    // Update chat preview text
                    const el = card.lastElementChild;
                    el.className = "mt-1 text-xs " + opt.id;
                }

                // 2. Re-render grid to show selection state
                renderContent();

                // 3. Save to Firestore (Optimistic)
                try {
                    await updateDoc(doc(db, "users", user.uid), {
                        profileStyles: selection
                    });
                    
                    // 4. Also update the real hidden profile modal in background so when we close it matches
                    applyProfileStyles(document.getElementById('profile-modal'), selection);

                } catch(e) {
                    console.error("Save failed", e);
                }
            };

            contentArea.appendChild(item);
        });
    };

    // Footer
    const footer = document.createElement('div');
    footer.className = "border-t-2 border-white p-3 flex justify-between bg-black shrink-0 items-center";
    
    const hint = document.createElement('span');
    hint.className = "text-[8px] text-gray-500 font-pixel hidden md:block";
    hint.innerText = "CHANGES AUTO-SAVE TO VOID";
    footer.appendChild(hint);

    const closeBtn = document.createElement('button');
    closeBtn.innerText = "FINISH CUSTOMIZATION";
    closeBtn.className = "brutal-btn px-6 py-2 text-[10px] font-bold bg-green-500 hover:bg-green-400";
    closeBtn.onclick = () => {
        // Trigger generic profile reload/close customization logic
        // We can call a global function or just re-open profile
        window.openProfile(user.uid); 
    };
    footer.appendChild(closeBtn);

    renderTabs();
    renderContent();

    controlsPane.appendChild(header);
    controlsPane.appendChild(contentArea);
    controlsPane.appendChild(footer);

    container.appendChild(controlsPane);
}

// Helper to apply styles to the ACTUAL profile modal (hidden or visible)
export function applyProfileStyles(modalElement, styles) {
    if (!styles || !modalElement) return;

    const contentContainer = modalElement.querySelector('#modal-content-container');
    if(!contentContainer) return;

    // 1. Background
    // Remove old themes
    const classesToRemove = Array.from(contentContainer.classList).filter(c => c.startsWith('bg-theme-'));
    contentContainer.classList.remove(...classesToRemove);
    if (styles.background) contentContainer.classList.add(styles.background);

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
