// Fallback Starter Template Data
const defaultTemplateData = {
    events: [
        { title: "Kickoff Informational Meeting", date: "Sept 10, 3:30 PM" },
        { title: "Fall Leadership Conference", date: "Oct 24, All Day" }
    ],
    positions: [
        { title: "Chapter President", type: "Officer Position" },
        { title: "Automotive Service Technology", type: "Skill Competition" },
        { title: "Chapter Secretary", type: "Officer Position" }
    ],
    gallery: [
        { url: "https://picsum.photos/200?random=1" },
        { url: "https://picsum.photos/200?random=2" },
        { url: "https://picsum.photos/200?random=3" }
    ],
    files: [
        { name: "Chapter Bylaws.pdf", url: "#" },
        { name: "Meeting Minutes - Sept.pdf", url: "#" }
    ]
};

// Initialize app data state from browser localStorage or template defaults
let portalData = JSON.parse(localStorage.getItem('skillsusa_portal_data'));
if (!portalData) {
    portalData = { ...defaultTemplateData };
    localStorage.setItem('skillsusa_portal_data', JSON.stringify(portalData));
}

// Controls viewing shifts between Dashboard & Admin modes
function switchTab(targetTab) {
    document.querySelectorAll('.tab-view').forEach(view => view.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    
    if (targetTab === 'dashboard') {
        document.getElementById('dashboard-view').classList.add('active');
        event.currentTarget.classList.add('active');
        renderDashboard();
    } else if (targetTab === 'admin') {
        document.getElementById('admin-view').classList.add('active');
        event.currentTarget.classList.add('active');
    }
}

// Appends data rows input from Admin forms into browser storage array matrices
function addData(category) {
    if (category === 'events') {
        const title = document.getElementById('event-title').value.trim();
        const date = document.getElementById('event-date').value.trim();
        if (!title || !date) return alert("Please fill in all event details.");
        portalData.events.push({ title, date });
        document.getElementById('event-title').value = '';
        document.getElementById('event-date').value = '';
    } 
    else if (category === 'positions') {
        const title = document.getElementById('pos-title').value.trim();
        const type = document.getElementById('pos-type').value;
        if (!title) return alert("Please fill in position title.");
        portalData.positions.push({ title, type });
        document.getElementById('pos-title').value = '';
    } 
    else if (category === 'gallery') {
        const url = document.getElementById('gal-url').value.trim();
        if (!url) return alert("Please fill in an image link path.");
        portalData.gallery.push({ url });
        document.getElementById('gal-url').value = '';
    } 
    else if (category === 'files') {
        const name = document.getElementById('file-name').value.trim();
        const url = document.getElementById('file-url').value.trim() || "#";
        if (!name) return alert("Please fill in file display name.");
        portalData.files.push({ name, url });
        document.getElementById('file-name').value = '';
        document.getElementById('file-url').value = '';
    }

    localStorage.setItem('skillsusa_portal_data', JSON.stringify(portalData));
    alert("Saved successfully!");
}

// Clears added tracking strings down back to basic layout blueprints
function resetPortalData() {
    if (confirm("Are you sure you want to clear all data updates and restore template defaults?")) {
        portalData = JSON.parse(JSON.stringify(defaultTemplateData));
        localStorage.setItem('skillsusa_portal_data', JSON.stringify(portalData));
        alert("Portal storage wiped clean and reset.");
        renderDashboard();
    }
}

// Reads structured storage memory to layout blocks onto visible dashboard templates
function renderDashboard() {
    // Events
    const eventsContainer = document.getElementById('display-events');
    eventsContainer.innerHTML = portalData.events.map(ev => `
        <div class="item-row">
            <strong>${ev.title}</strong>
            <span class="badge">${ev.date}</span>
        </div>
    `).join('') || '<p style="color:#777;">No events scheduled.</p>';

    // Positions
    const positionsContainer = document.getElementById('display-positions');
    positionsContainer.innerHTML = portalData.positions.map(pos => `
        <div class="item-row">
            <span>${pos.title}</span>
            <span class="badge ${pos.type === 'Skill Competition' ? 'badge-alt' : ''}">${pos.type}</span>
        </div>
    `).join('') || '<p style="color:#777;">No positions registered.</p>';

    // Gallery
    const galleryContainer = document.getElementById('display-gallery');
    galleryContainer.innerHTML = portalData.gallery.map(img => `
        <img src="${img.url}" alt="Chapter Event Visual" onerror="this.src='https://picsum.photos/100?blur=2';">
    `).join('') || '<p style="color:#777; grid-column: 1/-1;">Gallery is empty.</p>';

    // Files
    const filesContainer = document.getElementById('display-files');
    filesContainer.innerHTML = portalData.files.map(f => `
        <div class="item-row">
            <a href="${f.url}" target="_blank" class="file-link"><i class="far fa-file-alt"></i> ${f.name}</a>
        </div>
    `).join('') || '<p style="color:#777;">No files uploaded.</p>';
}

// Initial Run Command on Load
document.addEventListener("DOMContentLoaded", () => {
    renderDashboard();
});
