// --- Security Configuration Engine ---
const ADMIN_PASSWORD = "SkillsUSA2026";

// --- State Database Engine ---
let appData = JSON.parse(localStorage.getItem('skillsusa_portal_data')) || [
    // Pre-populate with default items if empty
    { id: "1", type: "event", title: "Chapter Kickoff Meeting", datetime: "Oct 12, 4:00 PM", desc: "Introduction to Competitions and officer election schedules." },
    { id: "2", type: "role", title: "Chapter President", category: "Officer", desc: "Leads local meetings and coordinates chapter tasks." },
    { id: "3", type: "role", title: "Welding Fabrication", category: "Competition", desc: "Team structural design and manufacturing skill assessment." },
    { id: "4", type: "file", title: "Meeting Minutes - Sept", url: "#", desc: "Official layout documentation from our planning council." },
    { id: "5", type: "gallery", title: "State Conference", url: "https://unsplash.com" }
];

// --- Authentication Session Check ---
function checkAuth() {
    return sessionStorage.getItem('admin_authenticated') === 'true';
}

// --- App Initialization Setup ---
document.addEventListener("DOMContentLoaded", () => {
    renderDashboard();
    setupEventListeners();
    setupDynamicFormInputs();
});

// --- Core Workspace Router ---
function setupEventListeners() {
    const loginBtn = document.getElementById("admin-login-btn");
    const logoutBtn = document.getElementById("admin-logout-btn");
    const dashboardView = document.getElementById("dashboard-view");
    const adminView = document.getElementById("admin-view");
    const dashboardNavBtn = document.getElementById("view-dashboard-btn");

    // Enforced Password Protected Access Routing
    loginBtn.addEventListener("click", () => {
        if (checkAuth()) {
            showAdminPanel();
        } else {
            const passwordAttempt = prompt("Enter Chapter Admin Password:");
            if (passwordAttempt === ADMIN_PASSWORD) {
                sessionStorage.setItem('admin_authenticated', 'true');
                showAdminPanel();
            } else if (passwordAttempt !== null) {
                alert("Incorrect password. Access denied.");
            }
        }
    });

    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem('admin_authenticated');
        showDashboardView();
        alert("Logged out successfully.");
    });

    dashboardNavBtn.addEventListener("click", showDashboardView);

    // Filtering controls for Roles/Competitions
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            renderRoles(e.target.dataset.filter);
        });
    });

    // Form Submissions
    document.getElementById("item-type").addEventListener("change", setupDynamicFormInputs);
    document.getElementById("admin-form").addEventListener("submit", handleFormSubmit);
    document.getElementById("cancel-edit-btn").addEventListener("click", resetAdminForm);
}

function showAdminPanel() {
    document.getElementById("admin-view").classList.remove("hidden");
    document.getElementById("dashboard-view").classList.add("hidden");
    document.getElementById("admin-login-btn").classList.add("hidden");
    document.getElementById("admin-logout-btn").classList.remove("hidden");
    document.getElementById("view-dashboard-btn").classList.remove("active");
    renderManagementTable();
}

function showDashboardView() {
    document.getElementById("dashboard-view").classList.remove("hidden");
    document.getElementById("admin-view").classList.add("hidden");
    document.getElementById("view-dashboard-btn").classList.add("active");
    if (checkAuth()) {
        document.getElementById("admin-login-btn").classList.add("hidden");
        document.getElementById("admin-logout-btn").classList.remove("hidden");
    } else {
        document.getElementById("admin-login-btn").classList.remove("hidden");
        document.getElementById("admin-logout-btn").classList.add("hidden");
    }
    renderDashboard();
}

// --- Dynamic Form Renderer ---
function setupDynamicFormInputs() {
    const type = document.getElementById("item-type").value;
    const container = document.getElementById("dynamic-inputs");
    container.innerHTML = ""; // Clear old variables

    if (!type) return;

    // Common configurations
    let fields = `<div class="form-group"><label>Title / Name</label><input type="text" id="input-title" required placeholder="e.g., Regional Leadership Conference"></div>`;

    if (type === "event") {
        fields += `<div class="form-group"><label>Date & Time String</label><input type="text" id="input-datetime" required placeholder="e.g., Oct 24, 5:00 PM"></div>`;
    } else if (type === "role") {
        fields += `<div class="form-group"><label>Role Classification</label><select id="input-category" required><option value="Officer">Officer Position</option><option value="Competition">Skills Competition</option></select></div>`;
    } else if (type === "gallery" || type === "file") {
        fields += `<div class="form-group"><label>${type === 'gallery' ? 'Image Web URL' : 'File Target URL'}</label><input type="text" id="input-url" required placeholder="e.g., https://google.com..."></div>`;
    }

    fields += `<div class="form-group"><label>Short Description</label><textarea id="input-desc" rows="3" placeholder="Brief outline detailing the entry..."></textarea></div>`;
    container.innerHTML = fields;
}

// --- CRUD Database Operations ---
function handleFormSubmit(e) {
    e.preventDefault();
    if (!checkAuth()) return alert("Session expired. Please log in again.");

    const id = document.getElementById("item-id").value;
    const action = document.getElementById("form-action").value;
    const type = document.getElementById("item-type").value;

    const newItem = {
        id: action === "edit" ? id : Date.now().toString(),
        type: type,
        title: document.getElementById("input-title").value,
        desc: document.getElementById("input-desc").value
    };

    if (type === "event") newItem.datetime = document.getElementById("input-datetime").value;
    if (type === "role") newItem.category = document.getElementById("input-category").value;
    if (type === "gallery" || type === "file") newItem.url = document.getElementById("input-url").value;

    if (action === "edit") {
        const index = appData.findIndex(item => item.id === id);
        if (index !== -1) appData[index] = newItem;
    } else {
        appData.push(newItem);
    }

    saveData();
    resetAdminForm();
    renderManagementTable();
    alert("Database update executed successfully!");
}

function startEdit(id) {
    const item = appData.find(i => i.id === id);
    if (!item) return;

    document.getElementById("form-title").innerText = "Modify Existing Entry";
    document.getElementById("form-action").value = "edit";
    document.getElementById("item-id").value = item.id;
    
    const typeSelect = document.getElementById("item-type");
    typeSelect.value = item.type;
    typeSelect.disabled = true; // Prevent changing item type mid-edit

    setupDynamicFormInputs();

    // Populate values
    document.getElementById("input-title").value = item.title;
    document.getElementById("input-desc").value = item.desc;
    if (item.type === "event") document.getElementById("input-datetime").value = item.datetime;
    if (item.type === "role") document.getElementById("input-category").value = item.category;
    if (item.type === "gallery" || item.type === "file") document.getElementById("input-url").value = item.url;

    document.getElementById("submit-btn").innerText = "Update Item";
    document.getElementById("cancel-edit-btn").classList.remove("hidden");
    
    // Scroll smoothly to form workspace view
    document.getElementById("admin-form").scrollIntoView({ behavior: 'smooth' });
}

function deleteItem(id) {
    if (confirm("Are you sure you want to permanently delete this item?")) {
        appData = appData.filter(item => item.id !== id);
        saveData();
        renderManagementTable();
    }
}

function resetAdminForm() {
    document.getElementById("admin-form").reset();
    document.getElementById("form-title").innerText = "Create New Entry";
    document.getElementById("form-action").value = "create";
    document.getElementById("item-id").value = "";
    
    const typeSelect = document.getElementById("item-type");
    typeSelect.disabled = false;
    
    document.getElementById("dynamic-inputs").innerHTML = "";
    document.getElementById("submit-btn").innerText = "Save Entry";
    document.getElementById("cancel-edit-btn").classList.add("hidden");
}

function saveData() {
    localStorage.setItem('skillsusa_portal_data', JSON.stringify(appData));
}

// --- Public Dashboard UI Render Engine ---
function renderDashboard() {
    renderEvents();
    renderRoles("all");
    renderFiles();
    renderGallery();
}

function renderEvents() {
    const container = document.getElementById("events-list");
    const events = appData.filter(i => i.type === "event");
    container.innerHTML = events.length ? "" : "<p>No upcoming events or meetings currently posted.</p>";
    events.forEach(ev => {
        container.innerHTML += `
            <div class="timeline-item">
                <span class="event-time"><i class="fa-regular fa-clock"></i> ${ev.datetime}</span>
                <div class="event-title">${ev.title}</div>
                <p style="font-size: 0.9rem; color: #64748B;">${ev.desc}</p>
            </div>`;
    });
}

function renderRoles(filter) {
    const container = document.getElementById("roles-list");
    const roles = appData.filter(i => i.type === "role" && (filter === "all" || i.category === filter));container.innerHTML = roles.length ? "" : "No entries found.";roles.forEach(r => {const badgeClass = r.category === "Officer" ? "badge-officer" : "badge-competition";container.innerHTML +=  <div class="role-card"> <span class="badge ${badgeClass}">${r.category}</span> <strong style="display:block; font-size:1rem;">${r.title}</strong> <p style="font-size:0.85rem; color:#475569; margin-top:2px;">${r.desc}</p> </div>;});}function renderFiles() {const container = document.getElementById("files-list");const files = appData.filter(i => i.type === "file");container.innerHTML = files.length ? "" : "No documentation uploads listed yet.";files.forEach(f => {container.innerHTML +=  <a href="${f.url}" target="_blank" class="file-link"> <i class="fa-solid fa-file-pdf"></i> <div> <strong style="font-size:0.9rem; display:block;">${f.title}</strong> <span style="font-size:0.75rem; color:#64748B;">${f.desc}</span> </div> </a>;});}function renderGallery() {const container = document.getElementById("gallery-grid");const photos = appData.filter(i => i.type === "gallery");container.innerHTML = photos.length ? "" : "No image gallery objects uploaded.";photos.forEach(p => {container.innerHTML +=  <div class="gallery-card"> <img src="${p.url}" alt="${p.title}" onerror="this.src='https://unsplash.com'"> <div class="gallery-caption">${p.title}</div> </div>;});}// --- Management Table Interface Render Engine ---function renderManagementTable() {const tbody = document.getElementById("management-table-body");tbody.innerHTML = appData.length ? "" : "No entries exist in database yet.";appData.forEach(item => {let secondColumn = item.desc;let thirdColumn = "";if (item.type === "event") thirdColumn = ⏱️ ${item.datetime};if (item.type === "role") thirdColumn = 🏷️ Category: <b>${item.category}</b>;if (item.type === "gallery" || item.type === "file") {thirdColumn = <a href="${item.url}" target="_blank" class="text-primary" style="word-break:break-all;">${item.url}</a>;}tbody.innerHTML += `${item.type}${item.title}\({thirdColumn}<br>\){secondColumn}`;});}
