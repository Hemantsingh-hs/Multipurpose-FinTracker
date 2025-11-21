// FinTracker JavaScript - Fixed Version

let currentEditingId = null;
let currentEditingSection = null;

const sampleData = {
  roomOwner: [
    // {
    //   id: 1,
    //   tenantName: "John Doe",
    //   roomNumber: "101",
    //   rentAmount: 8000,
    //   joinDate: "2024-01-15",
    //   electricityBill: 500,
    //   status: "paid"
    // }
  ],
  pgOwner: [],
  messOwner: [],
  personalExpenses: []
};

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
  setupEventListeners();
  showDashboard();
});

// Initialize localStorage data
function initializeApp() {
  if (!localStorage.getItem("fintracker_data")) {
    localStorage.setItem("fintracker_data", JSON.stringify(sampleData));
  }
  updateDashboardStats();
}

// Add all event listeners
function setupEventListeners() {
  // Dashboard button
  document.getElementById("dashboardBtn").addEventListener("click", showDashboard);

  // Room section
//   document.getElementById("addRoomBtn").addEventListener("click", () => showForm("room"));

  document.getElementById("addRoomBtn").addEventListener("click", () => {
  console.log("✅ Add Room button clicked!");
  showForm("room");
});

  document.getElementById("cancelRoomForm").addEventListener("click", () => hideForm("room"));
  document.getElementById("roomOwnerForm").addEventListener("submit", handleRoomSubmit);

  // PG section
  document.getElementById("addPGBtn").addEventListener("click", () => showForm("pg"));
  document.getElementById("cancelPGForm").addEventListener("click", () => hideForm("pg"));
  document.getElementById("pgOwnerForm").addEventListener("submit", handlePgSubmit);

  // Mess section
  document.getElementById("addMessBtn").addEventListener("click", () => showForm("mess"));
  document.getElementById("cancelMessForm").addEventListener("click", () => hideForm("mess"));
  document.getElementById("messOwnerForm").addEventListener("submit", handleMessSubmit);

  // Personal section
  document.getElementById("addPersonalBtn").addEventListener("click", () => showForm("personal"));
  document.getElementById("cancelPersonalForm").addEventListener("click", () => hideForm("personal"));
  document.getElementById("personalExpensesForm").addEventListener("submit", handlePersonalSubmit);
}

// Utility functions
function getData() {
  return JSON.parse(localStorage.getItem("fintracker_data")) || sampleData;
}

function saveData(data) {
  localStorage.setItem("fintracker_data", JSON.stringify(data));
  updateDashboardStats();
}

function generateId(section) {
  const data = getData();
  const items = data[section] || [];
  return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

// Section display
function showDashboard() {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById("dashboard").classList.remove("hidden");
  updateDashboardStats();
}

function showSection(sectionName) {
  document.getElementById("dashboard").classList.add("hidden");
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(sectionName + "Section").classList.remove("hidden");
  loadSectionData(sectionName);
}

// Load and display section data
function loadSectionData(section) {
  const data = getData();

  if (section === "room") displayRoomData(data.roomOwner);
  if (section === "pg") displayPgData(data.pgOwner);
  if (section === "mess") displayMessData(data.messOwner);
  if (section === "personal") displayPersonalData(data.personalExpenses);
}

// Show / hide form
function showForm(section) {
  document.getElementById(section + "Form").classList.remove("hidden");
  const today = new Date().toISOString().split("T")[0];

  if (section === "room") document.getElementById("joinDate").value = today;
  if (section === "pg") document.getElementById("pgJoinDate").value = today;
  if (section === "mess") document.getElementById("messDate").value = today;
  if (section === "personal") document.getElementById("expenseDate").value = today;
}

function hideForm(section) {
  document.getElementById(section + "Form").classList.add("hidden");
  currentEditingId = null;
  currentEditingSection = null;
}

// ---------------------- ROOM ------------------------
function handleRoomSubmit(e) {
  e.preventDefault();
  const data = getData();

  const formData = {
    tenantName: document.getElementById("tenantName").value,
    roomNumber: document.getElementById("roomNumber").value,
    rentAmount: parseInt(document.getElementById("rentAmount").value),
    joinDate: document.getElementById("joinDate").value,
    electricityBill: parseInt(document.getElementById("electricityBill").value) || 0,
    status: document.getElementById("roomStatus").value
  };

  if (currentEditingId && currentEditingSection === "room") {
    const index = data.roomOwner.findIndex(r => r.id === currentEditingId);
    data.roomOwner[index] = { ...formData, id: currentEditingId };
  } else {
    formData.id = generateId("roomOwner");
    data.roomOwner.push(formData);
  }

  saveData(data);
  hideForm("room");
  displayRoomData(data.roomOwner);
}

// Display Room data
function displayRoomData(rooms) {
  const tbody = document.querySelector("#roomTable tbody");
  if (!rooms.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center">No tenants yet. Click "Add New Tenant".</td></tr>`;
    return;
  }

  tbody.innerHTML = rooms
    .map(
      r => `
      <tr>
        <td>${r.tenantName}</td>
        <td>${r.roomNumber}</td>
        <td>₹${r.rentAmount}</td>
        <td>${r.joinDate}</td>
        <td>₹${r.electricityBill}</td>
        <td>${r.status}</td>
        <td>
          <button class="btn btn--ghost" onclick="editRecord('room', ${r.id})">✏️</button>
          <button class="btn btn--ghost" onclick="deleteRecord('room', ${r.id})">🗑️</button>
        </td>
      </tr>`
    )
    .join("");
}

// ---------------------- PG ------------------------
function handlePgSubmit(e) {
  e.preventDefault();
  const data = getData();

  const formData = {
    memberName: document.getElementById("memberName").value,
    bedNumber: document.getElementById("bedNumber").value,
    monthlyRent: parseInt(document.getElementById("monthlyRent").value),
    pgJoinDate: document.getElementById("pgJoinDate").value,
    electricityCharge: parseInt(document.getElementById("electricityCharge").value) || 0,
    foodCharge: parseInt(document.getElementById("foodCharge").value) || 0,
    status: document.getElementById("pgMemberStatus").value
  };

  if (currentEditingId && currentEditingSection === "pg") {
    const index = data.pgOwner.findIndex(m => m.id === currentEditingId);
    data.pgOwner[index] = { ...formData, id: currentEditingId };
  } else {
    formData.id = generateId("pgOwner");
    data.pgOwner.push(formData);
  }

  saveData(data);
  hideForm("pg");
  displayPgData(data.pgOwner);
}

function displayPgData(members) {
  const tbody = document.querySelector("#pgTable tbody");
  if (!members.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center">No members added.</td></tr>`;
    return;
  }

  tbody.innerHTML = members
    .map(
      m => `
      <tr>
        <td>${m.memberName}</td>
        <td>${m.bedNumber}</td>
        <td>₹${m.monthlyRent}</td>
        <td>${m.pgJoinDate}</td>
        <td>₹${m.electricityCharge}</td>
        <td>₹${m.foodCharge}</td>
        <td>${m.status}</td>
        <td>
          <button class="btn btn--ghost" onclick="editRecord('pg', ${m.id})">✏️</button>
          <button class="btn btn--ghost" onclick="deleteRecord('pg', ${m.id})">🗑️</button>
        </td>
      </tr>`
    )
    .join("");
}

// ---------------------- MESS ------------------------
function handleMessSubmit(e) {
  e.preventDefault();
  const data = getData();

  const formData = {
    date: document.getElementById("messDate").value,
    mealType: document.getElementById("mealType").value,
    expense: parseInt(document.getElementById("expense").value),
    memberCount: parseInt(document.getElementById("memberCount").value)
  };

  if (currentEditingId && currentEditingSection === "mess") {
    const index = data.messOwner.findIndex(m => m.id === currentEditingId);
    data.messOwner[index] = { ...formData, id: currentEditingId };
  } else {
    formData.id = generateId("messOwner");
    data.messOwner.push(formData);
  }

  saveData(data);
  hideForm("mess");
  displayMessData(data.messOwner);
}

function displayMessData(records) {
  const tbody = document.querySelector("#messTable tbody");
  if (!records.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">No food records yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = records
    .map(
      r => `
      <tr>
        <td>${r.date}</td>
        <td>${r.mealType}</td>
        <td>₹${r.expense}</td>
        <td>${r.memberCount}</td>
        <td>₹${(r.expense / r.memberCount).toFixed(2)}</td>
        <td>
          <button class="btn btn--ghost" onclick="editRecord('mess', ${r.id})">✏️</button>
          <button class="btn btn--ghost" onclick="deleteRecord('mess', ${r.id})">🗑️</button>
        </td>
      </tr>`
    )
    .join("");
}

// ---------------------- PERSONAL ------------------------
function handlePersonalSubmit(e) {
  e.preventDefault();
  const data = getData();

  const formData = {
    description: document.getElementById("expenseDescription").value,
    amount: parseInt(document.getElementById("expenseAmount").value),
    category: document.getElementById("expenseCategory").value,
    date: document.getElementById("expenseDate").value
  };

  if (currentEditingId && currentEditingSection === "personal") {
    const index = data.personalExpenses.findIndex(p => p.id === currentEditingId);
    data.personalExpenses[index] = { ...formData, id: currentEditingId };
  } else {
    formData.id = generateId("personalExpenses");
    data.personalExpenses.push(formData);
  }

  saveData(data);
  hideForm("personal");
  displayPersonalData(data.personalExpenses);
}

function displayPersonalData(items) {
  const tbody = document.querySelector("#personalTable tbody");
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center">No expenses yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = items
    .map(
      i => `
      <tr>
        <td>${i.date}</td>
        <td>${i.description}</td>
        <td>₹${i.amount}</td>
        <td>${i.category}</td>
        <td>
          <button class="btn btn--ghost" onclick="editRecord('personal', ${i.id})">✏️</button>
          <button class="btn btn--ghost" onclick="deleteRecord('personal', ${i.id})">🗑️</button>
        </td>
      </tr>`
    )
    .join("");
}

// ---------------------- EDIT / DELETE ------------------------
function editRecord(section, id) {
  const data = getData();
  currentEditingId = id;
  currentEditingSection = section;

  if (section === "room") {
    const r = data.roomOwner.find(x => x.id === id);
    if (!r) return;
    document.getElementById("tenantName").value = r.tenantName;
    document.getElementById("roomNumber").value = r.roomNumber;
    document.getElementById("rentAmount").value = r.rentAmount;
    document.getElementById("joinDate").value = r.joinDate;
    document.getElementById("electricityBill").value = r.electricityBill;
    document.getElementById("roomStatus").value = r.status;
    showForm("room");
  }

  if (section === "pg") {
    const m = data.pgOwner.find(x => x.id === id);
    if (!m) return;
    document.getElementById("memberName").value = m.memberName;
    document.getElementById("bedNumber").value = m.bedNumber;
    document.getElementById("monthlyRent").value = m.monthlyRent;
    document.getElementById("pgJoinDate").value = m.pgJoinDate;
    document.getElementById("electricityCharge").value = m.electricityCharge;
    document.getElementById("foodCharge").value = m.foodCharge;
    document.getElementById("pgMemberStatus").value = m.status;
    showForm("pg");
  }

  if (section === "mess") {
    const rec = data.messOwner.find(x => x.id === id);
    if (!rec) return;
    document.getElementById("messDate").value = rec.date;
    document.getElementById("mealType").value = rec.mealType;
    document.getElementById("expense").value = rec.expense;
    document.getElementById("memberCount").value = rec.memberCount;
    showForm("mess");
  }

  if (section === "personal") {
    const exp = data.personalExpenses.find(x => x.id === id);
    if (!exp) return;
    document.getElementById("expenseDescription").value = exp.description;
    document.getElementById("expenseAmount").value = exp.amount;
    document.getElementById("expenseCategory").value = exp.category;
    document.getElementById("expenseDate").value = exp.date;
    showForm("personal");
  }
}

function deleteRecord(section, id) {
  if (!confirm("Are you sure you want to delete this record?")) return;

  const data = getData();
  if (section === "room") data.roomOwner = data.roomOwner.filter(x => x.id !== id);
  if (section === "pg") data.pgOwner = data.pgOwner.filter(x => x.id !== id);
  if (section === "mess") data.messOwner = data.messOwner.filter(x => x.id !== id);
  if (section === "personal") data.personalExpenses = data.personalExpenses.filter(x => x.id !== id);

  saveData(data);
  loadSectionData(section);
}

// ---------------------- DASHBOARD ------------------------
// function updateDashboardStats() {
//   const data = getData();
//   document.getElementById("roomStats").textContent = `${data.roomOwner.length} Tenants`;
//   document.getElementById("pgStats").textContent = `${data.pgOwner.length} Members`;
//   document.getElementById("messStats").textContent = `₹${data.messOwner.reduce((s, r) => s + r.expense, 0)} Total`;
//   document.getElementById("personalStats").textContent = `₹${data.personalExpenses.reduce((s, e) => s + e.amount, 0)} Spent`;
// }

// REPLACE your old updateDashboardStats function with this one

function updateDashboardStats() {
  const data = getData();
  
  // 1. Get Room Tenant Count (from the new system's storage)
  const roomCount = getRoomTenantCount();
  
  // 2. Get other data
  const pgCount = data.pgOwner.length;
  const messExpenses = data.messOwner || [];
  const personalExpenses = data.personalExpenses || [];
  
  const messTotal = messExpenses.reduce((s, r) => s + r.expense, 0);
  const personalTotal = personalExpenses.reduce((s, e) => s + e.amount, 0);

  // 3. Update Room Owner Card
  document.getElementById("roomStats").textContent = `${roomCount} Active Tenants`;
  document.getElementById("roomCountBadge").textContent = roomCount;

  // 4. Update PG Owner Card
  document.getElementById("pgStats").textContent = `${pgCount} Members`;
  document.getElementById("pgCountBadge").textContent = pgCount;

  // 5. Update Mess Owner Card
  document.getElementById("messStats").textContent = `${messExpenses.length} Expenses`;
  document.getElementById("messCountBadge").textContent = messExpenses.length;

  // 6. Update Personal Expenses Card
  document.getElementById("personalStats").textContent = `₹${personalTotal} This Month`;
  document.getElementById("personalCountBadge").textContent = `₹${personalTotal}`;
}

function getLocalStorageSize() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += ((localStorage[key].length + key.length) * 2); // bytes (2 bytes per char)
    }
  }
  console.log("Approx localStorage size:", (total / 1024).toFixed(2), "KB");
}

getLocalStorageSize();

// 🔍 Search records in each section
function searchRecords(section) {
  const query = document.getElementById(section + "Search").value.toLowerCase();
  const data = getData();

  let filtered = [];

  switch (section) {
    case "room":
      filtered = data.roomOwner.filter(r =>
        r.tenantName.toLowerCase().includes(query) ||
        r.roomNumber.toLowerCase().includes(query)
      );
      displayRoomData(filtered);
      break;

    case "pg":
      filtered = data.pgOwner.filter(m =>
        m.memberName.toLowerCase().includes(query) ||
        m.bedNumber.toLowerCase().includes(query)
      );
      displayPgData(filtered);
      break;

    case "mess":
      filtered = data.messOwner.filter(rec =>
        rec.mealType.toLowerCase().includes(query) ||
        rec.date.toLowerCase().includes(query)
      );
      displayMessData(filtered);
      break;

    case "personal":
      filtered = data.personalExpenses.filter(exp =>
        exp.description.toLowerCase().includes(query) ||
        exp.category.toLowerCase().includes(query)
      );
      displayPersonalData(filtered);
      break;
  }
}


// new changes done above in the file update/new.html



                    const MAX_OCCUPANTS = 6;
                    const VIEWS = ['BUILDING_CONFIG_VIEW', 'FLOOR_CONFIG_VIEW', 'MAP_VIEW', 'DETAIL_VIEW', 'TENANT_VIEW', 'REPORT_VIEW'];
                    
                    // Structure: { BuildingId: { name: 'BuildingName', Floors: {FloorName: {RoomKey: { occupants: [], roomDetails: '' } } } } }
                    let buildingData = {}; 
                    let currentBuildingId = null; 
                    let currentRoomKey = null; 
                    let selectedMonthKey = getCurrentMonthKey(); 
                    const CURRENCY_SYMBOL = '₹';
                    
                    // Global Chart Instances
                    let roomChart = null; 
                    let buildingFinancialChart = null; 
                    let buildingOccupancyChart = null; 
                    let floorBarChart = null; 
            
                    // Variables for Modal State
                    let currentAction = null; // 'delete' or 'leave'
                    let occupantToActOnId = null;
            
                    // --- Date Helper Functions ---
                    function getCurrentMonthKey() {
                        const now = new Date();
                        const year = now.getFullYear();
                        const month = String(now.getMonth() + 1).padStart(2, '0');
                        return `${year}-${month}`; // e.g., "2025-11"
                    }
            
                    function getMonthName(monthKey) {
                        if (!monthKey) return "Invalid Month";
                        const [year, month] = monthKey.split('-').map(Number);
                        const date = new Date(year, month - 1, 1);
                        return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
                    }
                    
                    // --- LLM API Setup ---
                    const API_KEY = ""; // Placeholder, Canvas handles this
                    const API_URL = `https://generativ言語age.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;
                    const MAX_RETRIES = 3;
            
                    async function fetchGemini(payload) {
                        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
                            try {
                                const response = await fetch(API_URL, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(payload)
                                });
            
                                if (response.status === 429 && attempt < MAX_RETRIES - 1) {
                                    const delay = Math.pow(2, attempt) * 1000;
                                    await new Promise(resolve => setTimeout(resolve, delay));
                                    continue;
                                }
            
                                if (!response.ok) {
                                    throw new Error(`API call failed with status: ${response.status}`);
                                }
            
                                const result = await response.json();
                                const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "Error: Could not retrieve generated text. Check console for details.";
                                return text;
            
                            } catch (error) {
                                if (attempt === MAX_RETRIES - 1) {
                                    console.error("Gemini API failed after all retries:", error);
                                    return `Error: Failed to connect to AI after multiple attempts. ${error.message}`;
                                }
                            }
                        }
                        return "Error: An unexpected issue occurred during API communication.";
                    }
                    
                    // Helper function to create default occupant data structure
                    function createDefaultOccupant(name, aadhar, joinDate, securityAmount, proofStatus, proofFileName) {
                        return {
                            id: crypto.randomUUID(), 
                            name: name || '',
                            aadhar: aadhar || '',
                            joinDate: joinDate || '',
                            leaveDate: '', 
                            securityAmount: securityAmount || 0,
                            idProofStatus: proofStatus || 'Missing', 
                            idProofFileName: proofFileName || 'None', 
                            monthlyLedger: {} 
                        };
                    }

                    // Store/Load Building Data in a specific LocalStorage key
                    const BUILDING_STORAGE_KEY = "fintracker_building_data";
                    function loadBuildingData() {
                        const data = localStorage.getItem(BUILDING_STORAGE_KEY);
                        if (data) {
                            buildingData = JSON.parse(data);
                        } else {
                            // If no data, initialize with an empty object
                            buildingData = {};
                        }
                    }

                    function saveBuildingData() {
                        localStorage.setItem(BUILDING_STORAGE_KEY, JSON.stringify(buildingData));
                    }
            
                    document.addEventListener('DOMContentLoaded', () => {
                        loadBuildingData(); // Load data when DOM is ready
                        
                        const buildingNameInput = document.getElementById('building-name');
                        const addBuildingBtn = document.getElementById('add-building-btn');
                        const buildingListContainer = document.getElementById('building-list-container');
                        const floorConfigTitle = document.getElementById('floor-config-title');
                        const mapBuildingName = document.getElementById('map-building-name');
                        const reportBuildingName = document.getElementById('report-building-name');
                        const backToBuildingsBtn = document.getElementById('back-to-buildings-btn');
            
                        const floorCountInput = document.getElementById('floor-count');
                        const finalizeStructureBtn = document.getElementById('finalize-structure');
                        const mainNav = document.getElementById('main-nav');
                        const mapDisplay = document.getElementById('map-display');
                        const detailTitle = document.getElementById('detail-title');
                        const roomGeneralDetailsInput = document.getElementById('room-general-details');
                        const occupantRegistryBody = document.getElementById('occupant-registry-body');
                        const monthlyLedgerBody = document.getElementById('monthly-ledger-body');
                        const tenantRegistryBody = document.getElementById('tenant-registry-body');
                        const tenantSearchInput = document.getElementById('tenant-search');
                        const monthSelector = document.getElementById('month-selector');
                        const floorInputsContainer = document.getElementById('floor-inputs-container');
                        const pastOccupantsContainer = document.getElementById('past-occupants-container');
                        const pastOccupantsBody = document.getElementById('past-occupants-body');
                        const togglePastOccupantsBtn = document.getElementById('toggle-past-occupants');
                        
                        // Occupant Add Form Elements
                        const regNameInput = document.getElementById('reg-name');
                        const regAadharInput = document.getElementById('reg-aadhar');
                        const regJoinDateInput = document.getElementById('reg-join-date');
                        const regSecurityInput = document.getElementById('reg-security');
                        const regProofFileInput = document.getElementById('reg-proof-file'); 
                        const idProofFilenameSpan = document.getElementById('id-proof-filename'); 
                        const addOccupantBtn = document.getElementById('add-occupant-btn');
                        const regStatus = document.getElementById('reg-status');
            
                        // Financial Add Form Elements
                        const finNameSelect = document.getElementById('fin-name');
                        const finDateInput = document.getElementById('fin-date');
                        const finBaseRentInput = document.getElementById('fin-base-rent');
                        const finBillsInput = document.getElementById('fin-bills');
                        const finPaidInput = document.getElementById('fin-paid');
                        const finProofFileInput = document.getElementById('fin-proof-file');
                        const proofFilenameSpan = document.getElementById('proof-filename');
                        const addFinancialBtn = document.getElementById('add-financial-btn');
                        const finStatus = document.getElementById('fin-status');
                        
                        // LLM and Modal Elements
                        const aiOutputContainer = document.getElementById('ai-output-container');
                        const aiOutput = document.getElementById('ai-output');
                        const aiLoadingIndicator = document.getElementById('ai-loading-indicator');
                        const generateRentNoticeBtn = document.getElementById('generate-rent-notice-btn');
                        const generateActionPlanBtn = document.getElementById('generate-action-plan-btn');
                        const copyAiOutputBtn = document.getElementById('copy-ai-output');
                        
                        // Unified Action Modal Elements
                        const actionModal = document.getElementById('action-modal');
                        const modalTitle = document.getElementById('modal-title');
                        const modalBody = document.getElementById('modal-body');
                        const leaveDateContainer = document.getElementById('leave-date-container');
                        const leaveDateInput = document.getElementById('leave-date-input');
                        const confirmActionBtn = document.getElementById('confirm-action-btn');
                        const cancelActionBtn = document.getElementById('cancel-action-btn');
            
            
                        // --- UI Setup: Attachment Simulation ---
                        finProofFileInput.addEventListener('change', (e) => {
                            proofFilenameSpan.textContent = e.target.files.length > 0 ? e.target.files[0].name : 'No file selected.';
                        });
                        
                        regProofFileInput.addEventListener('change', (e) => {
                            idProofFilenameSpan.textContent = e.target.files.length > 0 ? e.target.files[0].name : 'Max 5MB (simulated)';
                        });
            
                        // --- VIEW MANAGEMENT & Navigation ---
                        function showView(viewName) {
                            VIEWS.forEach(view => {
                                const el = document.getElementById(view);
                                if (el) el.classList.add('hidden');
                            });
                            const targetEl = document.getElementById(viewName);
                            if (targetEl) targetEl.classList.remove('hidden');
            
                            document.querySelectorAll('.nav-button').forEach(btn => {
                                if (btn.dataset.view === viewName) {
                                    btn.classList.replace('text-gray-500', 'text-blue-600');
                                    btn.classList.replace('border-transparent', 'border-blue-600');
                                } else {
                                    btn.classList.replace('text-blue-600', 'text-gray-500');
                                    btn.classList.replace('border-transparent', 'border-transparent');
                                }
                            });
                            
                            const shouldShowNav = currentBuildingId && viewName !== 'BUILDING_CONFIG_VIEW' && viewName !== 'FLOOR_CONFIG_VIEW';
                            mainNav.classList.toggle('hidden', !shouldShowNav);
            
            
                            if (viewName === 'BUILDING_CONFIG_VIEW') {
                                renderBuildingConfig();
                                floorInputsContainer.innerHTML = '<p class="text-gray-500 text-center">Define the number of rooms for each floor here.</p>';
                                finalizeStructureBtn.classList.add('hidden');
                                saveBuildingData(); // Always save on exiting a major view
                            } else if (viewName === 'REPORT_VIEW') {
                                renderReport();
                            } else if (viewName === 'TENANT_VIEW') {
                                renderTenantRegistry();
                            } else if (viewName === 'MAP_VIEW' && currentBuildingId) {
                                renderMap();
                                saveBuildingData();
                            }
                        }
                        
                        // Initial load for the new Room System
                        if (document.getElementById('roomSection') && !document.getElementById('roomSection').classList.contains('hidden')) {
                            showView('BUILDING_CONFIG_VIEW');
                        }
            
                        document.querySelectorAll('.nav-button').forEach(button => {
                            button.addEventListener('click', (e) => showView(e.currentTarget.dataset.view));
                        });
            
                        // --- BUILDING CONFIGURATION LOGIC ---
                        addBuildingBtn.addEventListener('click', () => {
                            const name = buildingNameInput.value.trim();
                            if (!name) {
                                alert('Please enter a name for the building.');
                                return;
                            }
                            
                            const newId = crypto.randomUUID();
                            buildingData[newId] = {
                                name: name,
                                Floors: {}
                            };
                            
                            buildingNameInput.value = '';
                            saveBuildingData();
                            renderBuildingConfig();
                            alert(`Building "${name}" registered!`);
                        });
            
                        function renderBuildingConfig() {
                            buildingListContainer.innerHTML = '';
                            const buildingIds = Object.keys(buildingData);
            
                            // if (buildingIds.length === 0) {
                            //     buildingListContainer.innerHTML = '<p class="text-gray-500 text-center col-span-full">No buildings registered yet.</p>';
                            //     return;
                            // }
            
                            // buildingIds.forEach(id => {
                            //     const building = buildingData[id];
                            //     const floorCount = Object.keys(building.Floors).length;
                                
                            //     const card = document.createElement('div');
                            //     card.className = 'building-card p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col justify-between';
                            //     card.innerHTML = `
                            //         <div>
                            //             <h4 class="text-xl font-bold text-gray-900 mb-2">${building.name}</h4>
                            //             <p class="text-sm text-gray-600">Floors Configured: <span class="font-semibold">${floorCount}</span></p>
                            //             <p class="text-xs text-gray-500">ID: ${id.substring(0, 8)}...</p>
                            //         </div>
                            //         <button data-id="${id}" class="select-building-btn mt-3 w-full px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition duration-150 text-sm">
                            //             ${floorCount > 0 ? 'Manage Property' : 'Add Floors & Rooms'}
                            //         </button>
                            //     `;
                            //     buildingListContainer.appendChild(card);
                            // });
                            buildingIds.forEach(id => {
    const building = buildingData[id];
    const floorCount = Object.keys(building.Floors).length;
    const roomCount = floorCount * 10; // adjust if you have actual room data

    const card = document.createElement('div');
    card.className = 'property-card fade-in';

    // Image
    const img = document.createElement('div');
    img.className = 'property-image';
    // img.style.backgroundImage = `url("https://source.unsplash.com/600x400/?building,architecture&${id}")`;
    img.style.backgroundImage = 'url("https://picsum.photos/600/400")';


    // Content
    const content = document.createElement('div');
    content.className = 'property-content';

    const title = document.createElement('h2');
    title.className = 'property-title';
    title.textContent = building.name;

    const subtitle = document.createElement('p');
    subtitle.className = 'property-subtitle';
    subtitle.textContent = `ID: ${id.substring(0, 8)}...`;

    content.appendChild(title);
    content.appendChild(subtitle);

    // Stats section
    const stats = document.createElement('div');
    stats.className = 'property-stats';
    stats.innerHTML = `
        <div class="stat">
            <div class="value">${floorCount}</div>
            <div class="type">Floors</div>
        </div>
        <div class="stat border">
            <div class="value">${roomCount}</div>
            <div class="type">Rooms</div>
        </div>
    `;

    // Footer button
    const footer = document.createElement('div');
    footer.className = 'property-footer';

    const btn = document.createElement('button');
    btn.className = 'property-btn select-building-btn';
    btn.dataset.id = id;
    btn.textContent = floorCount > 0 ? 'Manage Property' : 'Add Floors & Rooms';

    footer.appendChild(btn);

    // Combine card
    card.appendChild(img);
    card.appendChild(content);
    card.appendChild(stats);
    card.appendChild(footer);

    buildingListContainer.appendChild(card);
});

                        }
                        
                        buildingListContainer.addEventListener('click', (e) => {
                            if (e.target.classList.contains('select-building-btn')) {
                                const id = e.target.dataset.id;
                                currentBuildingId = id;
                                const building = buildingData[id];
                                
                                floorConfigTitle.textContent = `2. Configure Floors for ${building.name}`;
                                mapBuildingName.textContent = building.name;
                                reportBuildingName.textContent = building.name;
                                
                                const floors = building.Floors;
                                const floorNames = Object.keys(floors);
                                
                                if (floorNames.length > 0) {
                                    floorCountInput.value = floorNames.length;
                                    document.getElementById('generate-floor-inputs').click();
                                    floorNames.forEach((floorName, index) => {
                                        const roomCount = Object.keys(floors[floorName]).length;
                                        const input = document.getElementById(`floor-${index + 1}-rooms`);
                                        if (input) input.value = roomCount;
                                    });
                                    finalizeStructureBtn.classList.remove('hidden');
                                    showView('MAP_VIEW');
                                } else {
                                    floorCountInput.value = '';
                                    floorInputsContainer.innerHTML = '<p class="text-gray-500 text-center">Define the number of rooms for each floor here.</p>';
                                    finalizeStructureBtn.classList.add('hidden');
                                    showView('FLOOR_CONFIG_VIEW');
                                }
                            }
                        });
                        
                        backToBuildingsBtn.addEventListener('click', () => {
                            currentBuildingId = null;
                            showView('BUILDING_CONFIG_VIEW');
                        });
            
            
                        // --- FLOOR CONFIGURATION LOGIC ---
                        document.getElementById('generate-floor-inputs').addEventListener('click', () => {
                            const floorCount = parseInt(floorCountInput.value, 10);
                            if (isNaN(floorCount) || floorCount < 1 || floorCount > 50) {
                                alert('Please enter a valid number of floors (1-50).');
                                return;
                            }
                            
                            floorInputsContainer.innerHTML = ''; 
                            for (let i = 1; i <= floorCount; i++) {
                                const floorInputDiv = document.createElement('div');
                                floorInputDiv.className = 'flex items-center space-x-3';
                                floorInputDiv.innerHTML = `
                                    <label for="floor-${i}-rooms" class="w-28 text-sm font-medium text-gray-700">Floor ${i} Rooms:</label>
                                    <input type="number" id="floor-${i}-rooms" min="0" max="100" class="floor-room-input block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 8">
                                `;
                                floorInputsContainer.appendChild(floorInputDiv);
                            }
                            finalizeStructureBtn.classList.remove('hidden');
                        });
            
                        finalizeStructureBtn.addEventListener('click', () => {
                            if (!currentBuildingId) return;
                            const roomInputs = document.querySelectorAll('.floor-room-input');
                            if (roomInputs.length === 0) return;
            
                            const currentFloors = buildingData[currentBuildingId].Floors;
                            const newFloors = {};
                            
                            roomInputs.forEach((input, index) => {
                                const floorName = `Floor ${index + 1}`;
                                const roomCount = parseInt(input.value, 10);
                                if (isNaN(roomCount) || roomCount < 0) {
                                    alert(`Invalid room count for ${floorName}. Please correct.`);
                                    return;
                                }
                                newFloors[floorName] = {};
                                for (let j = 1; j <= roomCount; j++) {
                                    const roomKey = `R-${j}`;
                                    
                                    const existingData = currentFloors[floorName] && currentFloors[floorName][roomKey] ? currentFloors[floorName][roomKey] : {
                                        occupants: [],
                                        roomDetails: ''
                                    };
                                    newFloors[floorName][roomKey] = existingData;
                                }
                            });
            
                            buildingData[currentBuildingId].Floors = newFloors;
                            saveBuildingData();
                            showView('MAP_VIEW');
                        });
            
                        // --- MAP VIEW LOGIC ---
                        function renderMap() {
                            mapDisplay.innerHTML = '';
                            if (!currentBuildingId || !buildingData[currentBuildingId]) return;
            
                            const building = buildingData[currentBuildingId];
                            const floors = building.Floors;
                            let hasRooms = false;
                            const currentKey = getCurrentMonthKey();
            
                            Object.keys(floors).reverse().forEach(floorName => {
                                const rooms = floors[floorName];
                                const roomKeys = Object.keys(rooms);
                                if (roomKeys.length > 0) hasRooms = true;
            
                                const floorDiv = document.createElement('div');
                                floorDiv.className = 'p-4 bg-gray-100 rounded-lg shadow-inner';
                                
                                const floorTitle = document.createElement('h3');
                                floorTitle.className = 'text-lg font-bold mb-3 text-gray-700';
                                floorTitle.textContent = floorName;
                                floorDiv.appendChild(floorTitle);
            
                                const roomsGrid = document.createElement('div');
                                roomsGrid.className = 'flex flex-wrap gap-3';
                                
                                roomKeys.forEach(roomKey => {
                                    const roomData = rooms[roomKey];
                                    const activeOccupants = roomData.occupants.filter(o => !o.leaveDate); 
                                    
                                    let totalRoomRent = 0;
                                    activeOccupants.forEach(o => {
                                        const monthlyRecords = o.monthlyLedger[currentKey] || [];
                                        if (monthlyRecords.length > 0) {
                                            const latestRecord = monthlyRecords.reduce((latest, current) => 
                                                (current.date > latest.date ? current : latest), monthlyRecords[0]);
                                                
                                            totalRoomRent += (parseFloat(latestRecord.baseRent) || 0);
                                        }
                                    });
            
                                    const isOccupied = activeOccupants.length > 0;
                                    const roomFullKey = `${floorName}|${roomKey}`;
                                    
                                    const roomDiv = document.createElement('div');
                                    roomDiv.dataset.roomKey = roomFullKey;
                                    roomDiv.className = `room-block w-24 h-24 flex flex-col items-center justify-center p-1 rounded-lg cursor-pointer transition-all duration-200 border-2 text-center ${
                                        isOccupied 
                                        ? 'bg-red-500 hover:bg-red-600 text-white border-red-700 shadow-md' 
                                        : 'bg-green-100 hover:bg-green-200 text-green-800 border-green-300 shadow-sm'
                                    }`;
                                    roomDiv.innerHTML = `
                                        <span class="text-xl font-bold">${roomKey}</span>
                                        <span class="text-xs mt-1 font-medium">${activeOccupants.length} / ${MAX_OCCUPANTS}</span>
                                        <span class="text-sm font-bold mt-1">${CURRENCY_SYMBOL}${totalRoomRent.toFixed(0)}*</span>
                                    `;
                                    roomDiv.addEventListener('click', handleRoomClick);
                                    roomsGrid.appendChild(roomDiv);
                                });
                                
                                floorDiv.appendChild(roomsGrid);
                                mapDisplay.appendChild(floorDiv);
                            });
            
                            if (!hasRooms) {
                                mapDisplay.innerHTML = '<p class="text-gray-500 text-center py-10">No rooms configured. Please go to the Structure Setup.</p>';
                            }
                        }
            
                        // --- DETAIL VIEW: Global Handlers ---
                        
                        function handleRoomClick(e) {
                            currentRoomKey = e.currentTarget.dataset.roomKey;
                            const [floorName, roomKey] = currentRoomKey.split('|');
                            const roomData = buildingData[currentBuildingId].Floors[floorName][roomKey];
            
                            detailTitle.textContent = `Room Details: ${buildingData[currentBuildingId].name.substring(0, 15)}... / ${currentRoomKey}`;
                            roomGeneralDetailsInput.value = roomData.roomDetails || '';
                            
                            regStatus.textContent = '';
                            finStatus.textContent = '';
                            aiOutputContainer.classList.add('hidden');
                            
                            renderOccupantRegistryTable(roomData.occupants);
                            renderPastOccupants(roomData.occupants); 
                            
                            selectedMonthKey = getCurrentMonthKey();
                            populateMonthSelector(roomData.occupants);
            
                            renderMonthlyLedgerTable(roomData.occupants, selectedMonthKey);
                            renderRoomChart(roomData.occupants); // RENDER CHART
                            
                            finDateInput.value = new Date().toISOString().split('T')[0];
                            
                            regProofFileInput.value = null;
                            idProofFilenameSpan.textContent = 'Max 5MB (simulated)';
            
                            showView('DETAIL_VIEW');
                        }
            
                        document.getElementById('save-room-details').addEventListener('click', () => {
                            if (!currentBuildingId || !currentRoomKey) return;
                            const [floorName, roomKey] = currentRoomKey.split('|');
                            buildingData[currentBuildingId].Floors[floorName][roomKey].roomDetails = roomGeneralDetailsInput.value.trim();
                            saveBuildingData();
                            
                            alert(`General Notes for ${currentRoomKey} saved!`);
                            renderMap();
                        });
                        
                        // --- ROOM FINANCIAL CHART LOGIC ---
                        function renderRoomChart(occupants) {
                            if (roomChart) {
                                roomChart.destroy();
                            }
            
                            const currentKey = getCurrentMonthKey();
                            const activeOccupants = occupants.filter(o => o.name && !o.leaveDate); 
                            
                            let totalExpected = 0;
                            let totalCollected = 0;
            
                            activeOccupants.forEach(o => {
                                const monthlyRecords = o.monthlyLedger[currentKey] || [];
                                totalExpected += monthlyRecords.reduce((sum, r) => sum + r.baseRent + r.bills, 0);
                                totalCollected += monthlyRecords.reduce((sum, r) => sum + r.paidAmount, 0);
                            });
                            
                            let totalDue = totalExpected - totalCollected;
                            if (totalDue < 0) totalDue = 0; // Don't show negative due
                            if (totalCollected > totalExpected) totalCollected = totalExpected; // Cap collected at expected for viz
            
                            const ctx = document.getElementById('room-financial-chart').getContext('2d');
                            
                            const data = {
                                labels: [`Paid: ${CURRENCY_SYMBOL}${totalCollected.toFixed(0)}`, `Due: ${CURRENCY_SYMBOL}${totalDue.toFixed(0)}`],
                                datasets: [{
                                    label: 'Rent Status',
                                    data: [totalCollected, totalDue],
                                    backgroundColor: [
                                        'rgb(52, 211, 153)', // Paid: Green-400
                                        'rgb(248, 113, 113)'  // Due: Red-400
                                    ],
                                    hoverOffset: 4
                                }]
                            };
            
                            const config = {
                                type: 'doughnut',
                                data: data,
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                        title: {
                                            display: true,
                                            text: `Total Expected: ${CURRENCY_SYMBOL}${totalExpected.toFixed(2)}`,
                                            font: { size: 14 }
                                        }
                                    }
                                }
                            };
            
                            roomChart = new Chart(ctx, config);
                        }
            
            
                        // --- OCCUPANT REGISTRY LOGIC ---
                        
                        function renderOccupantRegistryTable(occupants) {
                            occupantRegistryBody.innerHTML = '';
                            const activeOccupants = occupants.filter(o => o.name && !o.leaveDate); 
            
                            addOccupantBtn.textContent = `Add Occupant to Room (${activeOccupants.length}/${MAX_OCCUPANTS} used)`;
                            addOccupantBtn.disabled = activeOccupants.length >= MAX_OCCUPANTS;
            
                            if (activeOccupants.length === 0) {
                                occupantRegistryBody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-gray-500">No active occupants registered.</td></tr>';
                                finNameSelect.innerHTML = '<option value="">-- Add Occupant First --</option>';
                                return;
                            }
                            
                            finNameSelect.innerHTML = '<option value="">-- Select Occupant --</option>';
                            activeOccupants.forEach(o => {
                                const option = document.createElement('option');
                                option.value = o.id;
                                option.textContent = o.name;
                                finNameSelect.appendChild(option);
                            });
            
            
                            activeOccupants.forEach((o) => {
                                const proofClass = o.idProofStatus === 'Uploaded' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                                
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td class="text-sm font-medium text-center">${o.name}</td>
                                    <td class="text-sm text-center">${o.aadhar}</td>
                                    <td class="text-sm text-center">${o.joinDate}</td>
                                    <td class="text-sm text-center">${CURRENCY_SYMBOL}${o.securityAmount.toFixed(2)}</td>
                                    <td class="text-sm text-center">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${proofClass}">${o.idProofStatus}</span>
                                        <span class="text-xs text-gray-500 block">${o.idProofFileName}</span>
                                    </td>
                                    <td class="flex space-x-2 justify-end actions-cell">
                                        <button data-id="${o.id}" data-name="${o.name}" data-action="leave" class="action-button text-orange-600 hover:text-orange-800 text-sm">Leave</button>
                                        <button data-id="${o.id}" data-name="${o.name}" data-action="delete" class="action-button text-red-600 hover:text-red-800 text-sm">Delete</button>
                                    </td>
                                `;
                                occupantRegistryBody.appendChild(row);
                            });
                        }
            
                        // Occupant Add Action
                        addOccupantBtn.addEventListener('click', () => {
                            if (!currentBuildingId || !currentRoomKey) return;
                            const [floorName, roomKey] = currentRoomKey.split('|');
                            const roomData = buildingData[currentBuildingId].Floors[floorName][roomKey];
                            
                            if (roomData.occupants.filter(o => !o.leaveDate).length >= MAX_OCCUPANTS) {
                                regStatus.textContent = 'Maximum 6 active occupants reached.';
                                return;
                            }
            
                            const name = regNameInput.value.trim();
                            if (!name) { regStatus.textContent = 'Name is required.'; return; }
                            
                            const hasFile = regProofFileInput.files.length > 0;
                            const proofStatus = hasFile ? 'Uploaded' : 'Missing';
                            const proofFileName = hasFile ? regProofFileInput.files[0].name : 'None';
            
            
                            const newOccupant = createDefaultOccupant(
                                name,
                                regAadharInput.value.trim(),
                                regJoinDateInput.value,
                                parseFloat(regSecurityInput.value) || 0,
                                proofStatus, 
                                proofFileName  
                            );
                            
                            roomData.occupants.push(newOccupant);
                            saveBuildingData();
                            
                            renderOccupantRegistryTable(roomData.occupants);
                            renderMonthlyLedgerTable(roomData.occupants, selectedMonthKey);
                            renderRoomChart(roomData.occupants); // UPDATE CHART
            
                            // Reset inputs
                            regNameInput.value = '';
                            regAadharInput.value = '';
                            regJoinDateInput.value = '';
                            regSecurityInput.value = 0;
                            regProofFileInput.value = null; 
                            idProofFilenameSpan.textContent = 'Max 5MB (simulated)';
                            regStatus.textContent = `Occupant ${name} added successfully! (ID Proof Status: ${proofStatus})`;
                        });
                        
                        // --- Unified Action Modal Setup (Delegated Listener) ---
                        occupantRegistryBody.addEventListener('click', (e) => {
                            if (!currentBuildingId || !currentRoomKey || !e.target.classList.contains('action-button')) return;
                            
                            const occupantId = e.target.dataset.id;
                            const occupantName = e.target.dataset.name;
                            currentAction = e.target.dataset.action;
                            occupantToActOnId = occupantId;
            
                            // Configure Modal based on action
                            if (currentAction === 'delete') {
                                modalTitle.textContent = 'CONFIRM PERMANENT DELETION';
                                modalBody.innerHTML = `Are you absolutely sure you want to permanently delete **<span class="font-bold text-red-600">${occupantName}</span>** and ALL of their associated financial history? **This action cannot be undone.**`;
                                confirmActionBtn.textContent = 'Confirm Delete';
                                confirmActionBtn.classList.replace('bg-red-600', 'bg-red-800');
                                leaveDateContainer.classList.add('hidden');
                            } else if (currentAction === 'leave') {
                                modalTitle.textContent = 'Record Occupant Departure';
                                modalBody.innerHTML = `Please confirm **<span class="font-bold text-orange-600">${occupantName}</span>** is leaving the room.`;
                                confirmActionBtn.textContent = 'Confirm Leave';
                                confirmActionBtn.classList.replace('bg-red-800', 'bg-red-600');
                                leaveDateContainer.classList.remove('hidden');
                                leaveDateInput.value = new Date().toISOString().split('T')[0];
                            }
                            
                            actionModal.classList.remove('hidden');
                        });
            
                        cancelActionBtn.addEventListener('click', () => {
                            actionModal.classList.add('hidden');
                            occupantToActOnId = null;
                            currentAction = null;
                        });
                        
                        confirmActionBtn.addEventListener('click', () => {
                            if (!occupantToActOnId || !currentBuildingId || !currentRoomKey) return;
                            
                            const [floorName, roomKey] = currentRoomKey.split('|');
                            const roomData = buildingData[currentBuildingId].Floors[floorName][roomKey];
                            const occupantIndex = roomData.occupants.findIndex(o => o.id === occupantToActOnId);
                            const occupantName = roomData.occupants[occupantIndex].name;
            
            
                            if (currentAction === 'delete') {
                                // Execute Delete
                                roomData.occupants.splice(occupantIndex, 1);
                                regStatus.textContent = `Occupant ${occupantName} permanently deleted.`;
                            } else if (currentAction === 'leave') {
                                // Execute Leave
                                const leaveDate = leaveDateInput.value;
                                if (!leaveDate) {
                                    alert('Please select a valid leave date to proceed.');
                                    return;
                                }
                                roomData.occupants[occupantIndex].leaveDate = leaveDate;
                                regStatus.textContent = `${occupantName} marked as left on ${leaveDate}.`;
                            }
                            
                            // Save data after change
                            saveBuildingData();

                            // Re-render all views affected by change in occupant status
                            renderOccupantRegistryTable(roomData.occupants);
                            renderMonthlyLedgerTable(roomData.occupants, selectedMonthKey);
                            renderRoomChart(roomData.occupants); // UPDATE CHART
                            renderPastOccupants(roomData.occupants);
                            renderMap();
            
                            actionModal.classList.add('hidden');
                            occupantToActOnId = null;
                            currentAction = null;
                        });
                        
                        // --- PAST OCCUPANTS LOGIC ---
                        
                        togglePastOccupantsBtn.addEventListener('click', () => {
                            const isHidden = pastOccupantsContainer.classList.toggle('hidden');
                            togglePastOccupantsBtn.innerHTML = isHidden 
                                ? '&#x25BC; Show Past Occupants (Historical Records)' 
                                : '&#x25B2; Hide Past Occupants (Historical Records)';
                        });
            
                        function renderPastOccupants(occupants) {
                            pastOccupantsBody.innerHTML = '';
                            const leftOccupants = occupants.filter(o => o.name && o.leaveDate).sort((a, b) => b.leaveDate.localeCompare(a.leaveDate));
                            
                            if (leftOccupants.length === 0) {
                                pastOccupantsBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-gray-400">No past occupants recorded for this room.</td></tr>';
                                return;
                            }
            
                            leftOccupants.forEach(o => {
                                const row = document.createElement('tr');
                                row.innerHTML = `
                                    <td class="text-sm font-medium text-gray-700">${o.name}</td>
                                    <td class="text-sm text-gray-500">${o.joinDate}</td>
                                    <td class="text-sm font-semibold text-gray-700">${o.leaveDate}</td>
                                    <td class="text-sm text-gray-500 text-right">${CURRENCY_SYMBOL}${o.securityAmount.toFixed(2)}</td>
                                `;
                                pastOccupantsBody.appendChild(row);
                            });
                        }
            
            
                        // --- MONTHLY LEDGER LOGIC ---
                        
                        function populateMonthSelector(occupants) {
                            const monthSelector = document.getElementById('month-selector');
                            monthSelector.innerHTML = '';
                            
                            const availableMonths = new Set();
                            
                            let date = new Date();
                            for (let i = 0; i < 12; i++) {
                                const year = date.getFullYear();
                                const month = String(date.getMonth() + 1).padStart(2, '0');
                                availableMonths.add(`${year}-${month}`);
                                date.setMonth(date.getMonth() - 1);
                            }
            
                            occupants.forEach(o => {
                                Object.keys(o.monthlyLedger).forEach(monthKey => {
                                    if (o.monthlyLedger[monthKey].length > 0) {
                                        availableMonths.add(monthKey);
                                    }
                                });
                            });
            
                            const sortedMonths = Array.from(availableMonths).sort((a, b) => b.localeCompare(a));
                            const currentMonthKey = getCurrentMonthKey();
            
                            sortedMonths.forEach(monthKey => {
                                const option = document.createElement('option');
                                option.value = monthKey;
                                option.textContent = getMonthName(monthKey);
                                if (monthKey === selectedMonthKey || monthKey === currentMonthKey) {
                                    option.selected = true;
                                    selectedMonthKey = monthKey;
                                }
                                monthSelector.appendChild(option);
                            });
                        }
            
                        monthSelector.addEventListener('change', (e) => {
                            selectedMonthKey = e.target.value;
                            if (currentBuildingId && currentRoomKey) {
                                const [floorName, roomKey] = currentRoomKey.split('|');
                                renderMonthlyLedgerTable(buildingData[currentBuildingId].Floors[floorName][roomKey].occupants, selectedMonthKey);
                            }
                        });
                        
                        // Financial Add Action
                        addFinancialBtn.addEventListener('click', () => {
                            if (!currentBuildingId || !currentRoomKey) return;
                            const [floorName, roomKey] = currentRoomKey.split('|');
                            const roomData = buildingData[currentBuildingId].Floors[floorName][roomKey];
            
                            const occupantId = finNameSelect.value;
                            const entryDate = finDateInput.value;
                            
                            if (!occupantId || !entryDate) {
                                finStatus.textContent = 'Please select Occupant and Date.';
                                return;
                            }
            
                            const occupantIndex = roomData.occupants.findIndex(o => o.id === occupantId);
                            const occupant = roomData.occupants[occupantIndex];
                            
                            if (!occupant) { finStatus.textContent = 'Occupant not found.'; return; }
                            if (occupant.leaveDate) { finStatus.textContent = `${occupant.name} has left the property. Cannot add new entry.`; return; }
                            
                            const saveMonthKey = entryDate.substring(0, 7); 
            
                            const newEntry = {
                                id: crypto.randomUUID(),
                                date: entryDate,
                                baseRent: parseFloat(finBaseRentInput.value) || 0,
                                bills: parseFloat(finBillsInput.value) || 0,
                                paidAmount: parseFloat(finPaidInput.value) || 0,
                                proofStatus: finProofFileInput.files.length > 0 ? 'Verified' : 'Pending',
                                proofFileName: finProofFileInput.files.length > 0 ? finProofFileInput.files[0].name : 'None'
                            };
            
                            if (!occupant.monthlyLedger[saveMonthKey]) {
                                occupant.monthlyLedger[saveMonthKey] = [];
                            }
            
                            occupant.monthlyLedger[saveMonthKey].push(newEntry);
                            saveBuildingData();

                            
                            if (saveMonthKey !== selectedMonthKey) {
                                selectedMonthKey = saveMonthKey;
                                populateMonthSelector(roomData.occupants);
                            }
            
                            renderMonthlyLedgerTable(roomData.occupants, selectedMonthKey);
                            renderRoomChart(roomData.occupants); // UPDATE CHART
                            
                            finNameSelect.value = '';
                            finBaseRentInput.value = 0;
                            finBillsInput.value = 0;
                            finPaidInput.value = 0;
                            finProofFileInput.value = null; 
                            proofFilenameSpan.textContent = 'No file selected.';
                            finStatus.textContent = `Financial entry saved for ${occupant.name}.`;
                        });
                        
                        function renderMonthlyLedgerTable(occupants, monthKey) {
                            monthlyLedgerBody.innerHTML = '';
                            let totalDueInRoom = 0;
                            let hasRecords = false;
            
                            occupants.forEach(occupant => {
                                if (!occupant.name) return; 
            
                                const monthlyRecords = occupant.monthlyLedger[monthKey] || [];
                                
                                if (monthlyRecords.length === 0) {
                                    return;
                                }
                                
                                hasRecords = true;
            
                                monthlyRecords.forEach(record => {
                                    const totalExpected = record.baseRent + record.bills;
                                    const dueAmount = totalExpected - record.paidAmount;
                                    totalDueInRoom += dueAmount;
            
                                    const dueClass = dueAmount > 0 ? 'text-red-600 font-bold' : 'text-green-600';
                                    const proofClass = record.proofStatus === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
            
                                    const row = document.createElement('tr');
                                    row.innerHTML = `
                                        <td class="text-sm font-medium text-gray-900">${occupant.name}</td>
                                        <td class="text-sm text-gray-600">${record.date}</td>
                                        <td class="text-sm text-gray-600 text-center">${CURRENCY_SYMBOL}${record.baseRent.toFixed(2)}</td>
                                        <td class="text-sm text-gray-600 text-center">${CURRENCY_SYMBOL}${record.bills.toFixed(2)}</td>
                                        <td class="text-sm ${dueClass} text-center">${CURRENCY_SYMBOL}${dueAmount.toFixed(2)}</td>
                                        <td class="text-sm text-gray-600 text-center">${CURRENCY_SYMBOL}${record.paidAmount.toFixed(2)}</td>
                                        <td class="text-sm text-center">
                                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${proofClass}">${record.proofStatus}</span>
                                            <span class="text-xs text-gray-500 block">${record.proofFileName}</span>
                                        </td>
                                        <td class="flex space-x-2 justify-end actions-cell">
                                            <button data-record-id="${record.id}" data-occupant-id="${occupant.id}" class="delete-financial text-red-600 hover:text-red-800 text-sm">Delete</button>
                                        </td>
                                    `;
                                    monthlyLedgerBody.appendChild(row);
                                });
                            });
                            
                            if (!hasRecords) {
                                monthlyLedgerBody.innerHTML = `<tr><td colspan="8" class="p-4 text-center text-gray-500">No financial entries found for ${getMonthName(monthKey)}.</td></tr>`;
                            }
            
                            if (monthKey === getCurrentMonthKey()) {
                                checkAndToggleRentNoticeButton(totalDueInRoom);
                            } else {
                                generateRentNoticeBtn.classList.add('hidden');
                            }
                        }
            
                        // Financial Delete Action (Delegated Listener)
                        monthlyLedgerBody.addEventListener('click', (e) => {
                            if (!currentBuildingId || !currentRoomKey || !e.target.dataset.recordId) return;
                            const [floorName, roomKey] = currentRoomKey.split('|');
                            const roomData = buildingData[currentBuildingId].Floors[floorName][roomKey];
                            const recordId = e.target.dataset.recordId;
                            const occupantId = e.target.dataset.occupantId;
                            const monthKey = selectedMonthKey;
            
                            if (e.target.classList.contains('delete-financial')) {
                                
                                const occupant = roomData.occupants.find(o => o.id === occupantId);
            
                                if (occupant && occupant.monthlyLedger[monthKey]) {
                                    occupant.monthlyLedger[monthKey] = occupant.monthlyLedger[monthKey].filter(record => record.id !== recordId);
                                    saveBuildingData();
                                }
            
                                renderMonthlyLedgerTable(roomData.occupants, monthKey);
                                renderRoomChart(roomData.occupants); // UPDATE CHART
                                finStatus.textContent = 'Monthly financial record deleted.';
                            }
                        });
            
            
                        // --- LLM Visibility Toggle ---
                        function checkAndToggleRentNoticeButton(totalDue) {
                            if (totalDue > 0) {
                                generateRentNoticeBtn.classList.remove('hidden');
                            } else {
                                generateRentNoticeBtn.classList.add('hidden');
                            }
                        }
            
                        // --- LLM Logic Functions ---
            
                        async function generateRentNoticeDraft(roomKey, occupants) {
                            const currentMonthKey = getCurrentMonthKey();
                            const currentMonthName = getMonthName(currentMonthKey);
                            
                            const activeOccupants = occupants.filter(o => o.name && !o.leaveDate);
            
                            const tenantsDue = activeOccupants
                                .map((o) => {
                                    const monthlyRecords = o.monthlyLedger[currentMonthKey] || [];
                                    const totalExpected = monthlyRecords.reduce((sum, r) => sum + r.baseRent + r.bills, 0);
                                    const totalPaid = monthlyRecords.reduce((sum, r) => sum + r.paidAmount, 0);
                                    const due = totalExpected - totalPaid;
                                    
                                    if (due > 0) {
                                        return `${o.name} owes ${CURRENCY_SYMBOL}${due.toFixed(2)} (Total Expected: ${CURRENCY_SYMBOL}${totalExpected.toFixed(2)}, Total Paid: ${CURRENCY_SYMBOL}${totalPaid.toFixed(2)}).`;
                                    }
                                    return null;
                                })
                                .filter(d => d !== null);
            
                            if (tenantsDue.length === 0) {
                                return "Error: No active balance due found for the current month to draft a notice.";
                            }
            
                            const tenantNames = activeOccupants.map(o => o.name).join(' and ');
                            
                            const systemPrompt = `You are a professional property manager in India. Draft a concise, polite, yet firm rent reminder message (suitable for WhatsApp or email subject/body). The tone should be professional and clear, stating the building, room, the tenants, the payment month (${currentMonthName}), the total amount due, and a soft deadline (e.g., 'Please pay by end of day tomorrow'). Always use the Indian Rupee symbol (₹). Do not use markdown (e.g., no asterisks or bolding).`;
                            const userQuery = `Draft a rent reminder for building ${buildingData[currentBuildingId].name} / room ${roomKey}. The active occupants are ${tenantNames}. The following breakdown shows who owes what for ${currentMonthName}: ${tenantsDue.join(' ')}`;
            
                            const payload = {
                                contents: [{ parts: [{ text: userQuery }] }],
                                systemInstruction: { parts: [{ text: systemPrompt }] },
                                config: { temperature: 0.3 }
                            };
                            
                            aiLoadingIndicator.classList.remove('hidden');
                            const result = await fetchGemini(payload);
                            aiLoadingIndicator.classList.add('hidden');
                            return result;
                        }
            
                        async function generateRoomActionPlan(roomKey, notes, occupants) {
                            const currentMonthKey = getCurrentMonthKey();
                            const activeOccupants = occupants.filter(o => o.name.trim() !== '' && !o.leaveDate); 
                            
                            const dueTenants = activeOccupants.filter(o => {
                                const monthlyRecords = o.monthlyLedger[currentMonthKey] || [];
                                const totalExpected = monthlyRecords.reduce((sum, r) => sum + r.baseRent + r.bills, 0);
                                const totalPaid = monthlyRecords.reduce((sum, r) => sum + r.paidAmount, 0);
                                return (totalExpected - totalPaid) > 0;
                            });
                            
                            const names = activeOccupants.map(o => o.name).join(', ');
            
                            const systemPrompt = `You are an operational assistant for a property manager in India. Analyze the provided room status and general notes for ACTIVE tenants. Generate a 3-point action plan. Focus on: (1) Urgent financial tasks (due amounts for the current month), (2) Administrative risks (missing Aadhar, potential lease renewal based on join date, missing ID Proof), and (3) Operational tasks (from general notes). Present the plan as a simple numbered list, starting each point with a short verb.`;
                            
                            let policyDetails = 'No specific general room notes provided.';
                            if (notes) {
                                policyDetails = `Room General Notes: "${notes}"`;
                            }
                            
                            let financialStatus = `Active Occupants: ${names}. All tenants are current on rent this month.`;
                            if (dueTenants.length > 0) {
                                financialStatus = `Active Occupants: ${names}. WARNING: ${dueTenants.map(t => t.name).join(', ')} have a pending balance this month.`;
                            }
                            
                            let adminRisks = activeOccupants.map(o => {
                                let risks = [];
                                if (!o.aadhar || o.aadhar.length < 10) risks.push(`Missing Aadhar number/document.`);
                                if (o.joinDate && new Date(o.joinDate).getFullYear() < new Date().getFullYear() - 1) risks.push(`Check for lease renewal needed (Joined: ${o.joinDate}).`);
                                if (o.idProofStatus === 'Missing') risks.push(`Missing ID Proof.`); 
                                
                                return risks.length > 0 ? `${o.name}: ${risks.join(' ')}` : null;
                            }).filter(r => r !== null).join(' ');
                            
                            if (!adminRisks) adminRisks = "No immediate administrative risks found.";
            
            
                            const userQuery = `Building: ${buildingData[currentBuildingId].name}. Room: ${roomKey}. ${policyDetails}. Financial Status (Active Tenants): ${financialStatus}. Admin Risks (Active Tenants): ${adminRisks}. Generate the action plan.`;
            
                            const payload = {
                                contents: [{ parts: [{ text: userQuery }] }],
                                systemInstruction: { parts: [{ text: systemPrompt }] },
                                config: { temperature: 0.5 }
                            };
                            
                            aiLoadingIndicator.classList.remove('hidden');
                            const result = await fetchGemini(payload);
                            aiLoadingIndicator.classList.add('hidden');
                            return result;
                        }
            
                        // --- Event Listeners for LLM Buttons ---
                        generateRentNoticeBtn.addEventListener('click', async () => {
                            aiOutputContainer.classList.add('hidden');
                            if (!currentBuildingId || !currentRoomKey) return;
                            const [floorName, roomKey] = currentRoomKey.split('|');
                            const occupants = buildingData[currentBuildingId].Floors[floorName][roomKey].occupants;
            
                            const draft = await generateRentNoticeDraft(currentRoomKey, occupants);
                            
                            aiOutput.textContent = draft;
                            aiOutputContainer.classList.remove('hidden');
                        });
            
                        generateActionPlanBtn.addEventListener('click', async () => {
                            aiOutputContainer.classList.add('hidden');
                            if (!currentBuildingId || !currentRoomKey) return;
                            const [floorName, roomKey] = currentRoomKey.split('|');
                            const roomData = buildingData[currentBuildingId].Floors[floorName][roomKey];
            
                            const plan = await generateRoomActionPlan(currentRoomKey, roomData.roomDetails, roomData.occupants);
                            
                            aiOutput.textContent = plan;
                            aiOutputContainer.classList.remove('hidden');
                        });
            
                        // --- Copy to Clipboard Logic ---
                        copyAiOutputBtn.addEventListener('click', () => {
                            const textToCopy = aiOutput.textContent;
                            if (!textToCopy) return;
            
                            navigator.clipboard.writeText(textToCopy).then(() => {
                                const originalText = copyAiOutputBtn.textContent;
                                copyAiOutputBtn.textContent = 'Copied!';
                                setTimeout(() => {
                                    copyAiOutputBtn.textContent = originalText;
                                }, 1500);
                            }).catch(err => {
                                console.error('Could not copy text: ', err);
                            });
                        });
            
            
                        // --- GLOBAL TENANT REGISTRY VIEW LOGIC (Across All Buildings) ---
                        function getAllActiveOccupants() {
                            const currentKey = getCurrentMonthKey();
                            const activeTenants = [];
                            
                            Object.keys(buildingData).forEach(buildingId => {
                                const building = buildingData[buildingId];
                                const floors = building.Floors;
                                
                                Object.keys(floors).forEach(floorName => {
                                    const rooms = floors[floorName];
                                    Object.keys(rooms).forEach(roomKey => {
                                        const room = rooms[roomKey];
                                        
                                        room.occupants.filter(o => o.name.trim() !== '' && !o.leaveDate).forEach(occupant => {
                                            const monthlyRecords = occupant.monthlyLedger[currentKey] || [];
                                            
                                            const totalExpected = monthlyRecords.reduce((sum, r) => sum + r.baseRent + r.bills, 0);
                                            const totalPaid = monthlyRecords.reduce((sum, r) => sum + r.paidAmount, 0);
                                            const dueAmount = totalExpected - totalPaid;
                                            
                                            const latestBaseRent = monthlyRecords.length > 0 ? monthlyRecords[monthlyRecords.length - 1].baseRent : 0;
                                            const isVerified = monthlyRecords.some(r => r.proofStatus === 'Verified');
                                            
                                            activeTenants.push({
                                                buildingName: building.name,
                                                room: `${floorName} / ${roomKey}`,
                                                name: occupant.name,
                                                aadhar: occupant.aadhar || 'N/A',
                                                joinDate: occupant.joinDate || 'N/A',
                                                securityAmount: occupant.securityAmount,
                                                baseRent: latestBaseRent,
                                                totalDue: totalExpected,
                                                paidAmount: totalPaid,
                                                dueAmount: dueAmount,
                                                proofStatus: isVerified ? 'Verified' : 'Pending'
                                            });
                                        });
                                    });
                                });
                            });
                            return activeTenants;
                        }
            
                        function renderTenantRegistry(searchTerm = '') {
                            const allTenants = getAllActiveOccupants();
                            tenantRegistryBody.innerHTML = '';
                            
                            const filteredTenants = allTenants.filter(tenant => 
                                tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                tenant.aadhar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                tenant.buildingName.toLowerCase().includes(searchTerm.toLowerCase()) 
                            );
            
                            if (filteredTenants.length === 0) {
                                tenantRegistryBody.innerHTML = '<tr><td colspan="9" class="p-4 text-center text-gray-500">No active tenants found or no results match your search.</td></tr>';
                                return;
                            }
            
                            filteredTenants.forEach(tenant => {
                                const row = document.createElement('tr');
                                const dueClass = tenant.dueAmount > 0 ? 'text-red-600 font-bold' : 'text-green-600';
                                const proofClass = tenant.proofStatus === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
            
                                row.innerHTML = `
                                    <td class="text-sm font-medium text-gray-900">${tenant.buildingName} / ${tenant.room}</td>
                                    <td class="text-sm font-medium text-gray-900">${tenant.name}</td>
                                    <td class="text-sm text-gray-600">${tenant.aadhar}</td>
                                    <td class="text-sm text-gray-600">${tenant.joinDate}</td>
                                    <td class="text-sm text-gray-600 text-right">${CURRENCY_SYMBOL}${tenant.securityAmount.toFixed(2)}</td>
                                    <td class="text-sm text-gray-600 text-right">${CURRENCY_SYMBOL}${tenant.baseRent.toFixed(2)}</td>
                                    <td class="text-sm text-gray-600 text-right">${CURRENCY_SYMBOL}${tenant.totalDue.toFixed(2)}</td>
                                    <td class="text-sm text-gray-600 ${dueClass} text-right"> ${CURRENCY_SYMBOL}${tenant.dueAmount.toFixed(2)}</td>
                                    <td class="text-sm text-center"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${proofClass}">${tenant.proofStatus}</span></td>
                                `;
                                tenantRegistryBody.appendChild(row);
                            });
                        }
                        
                        tenantSearchInput.addEventListener('input', (e) => renderTenantRegistry(e.target.value));
            
                        // --- REPORT LOGIC (Now with Charts) ---
                        function renderReport() {
                            if (!currentBuildingId || !buildingData[currentBuildingId]) return;
            
                            const reportMetrics = document.getElementById('report-metrics');
                            
                            // Destroy previous chart instances
                            if (buildingFinancialChart) buildingFinancialChart.destroy();
                            if (buildingOccupancyChart) buildingOccupancyChart.destroy();
                            if (floorBarChart) floorBarChart.destroy();
                            
                            const floors = buildingData[currentBuildingId].Floors;
                            let totalRooms = 0;
                            let occupiedRoomsCount = 0;
                            let totalPeople = 0;
                            let totalExpectedRent = 0;
                            let totalCollected = 0;
                            let totalSecurityHeld = 0;
                            const currentKey = getCurrentMonthKey();
                            
                            reportMetrics.innerHTML = '';
                            
                            // Data for Bar Chart
                            const floorLabels = [];
                            const floorExpectedData = [];
                            const floorDueData = [];
            
                            Object.keys(floors).forEach(floorName => {
                                const rooms = floors[floorName];
                                const floorRooms = Object.keys(rooms).length;
                                let floorOccupiedRooms = 0;
                                let floorPeople = 0;
                                let floorExpectedRent = 0;
                                let floorDue = 0;
                                
                                Object.keys(rooms).forEach(roomKey => {
                                    const room = rooms[roomKey];
                                    totalRooms++;
                                    
                                    const activeOccupants = room.occupants.filter(o => o.name.trim() !== '' && !o.leaveDate);
                                    const roomPeopleCount = activeOccupants.length;
                                    
                                    activeOccupants.forEach(occupant => {
                                        const monthlyRecords = occupant.monthlyLedger[currentKey] || [];
                                        
                                        const expected = monthlyRecords.reduce((sum, r) => sum + r.baseRent + r.bills, 0);
                                        const collected = monthlyRecords.reduce((sum, r) => sum + r.paidAmount, 0);
                                        const security = occupant.securityAmount;
                                        
                                        floorExpectedRent += expected;
                                        
                                        totalCollected += collected;
                                        totalExpectedRent += expected;
                                        totalSecurityHeld += security;
            
                                        if (expected > collected) floorDue += (expected - collected);
                                    });
            
                                    if (roomPeopleCount > 0) {
                                        occupiedRoomsCount++;
                                        floorOccupiedRooms++;
                                    }
                                    floorPeople += roomPeopleCount;
                                    totalPeople += roomPeopleCount;
                                });
                                
                                // Push data for bar chart
                                floorLabels.push(floorName);
                                floorExpectedData.push(floorExpectedRent.toFixed(2));
                                floorDueData.push(floorDue.toFixed(2));
                            });
            
                            // Calculate overall metrics
                            const overallOccupancyRate = totalRooms > 0 ? ((occupiedRoomsCount / totalRooms) * 100).toFixed(1) : 0;
                            const totalDue = totalExpectedRent - totalCollected;
                            
                            // --- 1. Render KPI Cards ---
                            const metrics = [
                                { title: 'Total Rooms Occupied', value: `${occupiedRoomsCount} / ${totalRooms}`, color: 'text-blue-600', icon: '&#9728;' },
                                { title: 'Total People (Active)', value: totalPeople, color: 'text-yellow-600', icon: '&#9993;' },
                                { title: 'Total Expected Rent', value: `${CURRENCY_SYMBOL}${totalExpectedRent.toFixed(2)}`, color: 'text-green-600', icon: '&#8377;' },
                                { title: 'Total Unpaid (Due)', value: `${CURRENCY_SYMBOL}${totalDue.toFixed(2)}`, color: 'text-red-600', icon: '&#9733;' }
                            ];
                            
                            metrics.forEach(metric => {
                                const card = document.createElement('div');
                                card.className = 'p-6 bg-white rounded-lg shadow-md border border-gray-200';
                                card.innerHTML = `
                                    <div class="flex items-center">
                                        <span class="text-3xl ${metric.color} mr-4">${metric.icon}</span>
                                        <div>
                                            <p class="text-sm font-medium text-gray-500">${metric.title}</p>
                                            <p class="text-2xl font-bold ${metric.color}">${metric.value}</p>
                                        </div>
                                    </div>
                                `;
                                reportMetrics.appendChild(card);
                            });
                            
                            // --- 2. Render Building Financial Doughnut ---
                            const financialCtx = document.getElementById('building-financial-chart').getContext('2d');
                            buildingFinancialChart = new Chart(financialCtx, {
                                type: 'doughnut',
                                data: {
                                    labels: [`Collected: ${CURRENCY_SYMBOL}${totalCollected.toFixed(0)}`, `Due: ${CURRENCY_SYMBOL}${totalDue.toFixed(0)}`],
                                    datasets: [{
                                        data: [totalCollected, totalDue],
                                        backgroundColor: ['rgb(52, 211, 153)', 'rgb(248, 113, 113)'],
                                        hoverOffset: 4
                                    }]
                                },
                                options: { responsive: true, maintainAspectRatio: false }
                            });
            
                            // --- 3. Render Building Occupancy Doughnut ---
                            const vacantRooms = totalRooms - occupiedRoomsCount;
                            const occupancyCtx = document.getElementById('building-occupancy-chart').getContext('2d');
                            buildingOccupancyChart = new Chart(occupancyCtx, {
                                type: 'doughnut',
                                data: {
                                    labels: [`Occupied: ${occupiedRoomsCount}`, `Vacant: ${vacantRooms}`],
                                    datasets: [{
                                        data: [occupiedRoomsCount, vacantRooms],
                                        backgroundColor: ['rgb(239, 68, 68)', 'rgb(229, 231, 235)'],
                                        hoverOffset: 4
                                    }]
                                },
                                options: { responsive: true, maintainAspectRatio: false }
                            });
                            
                            // --- 4. Render Floor Breakdown Bar Chart ---
                            const barCtx = document.getElementById('floor-breakdown-chart').getContext('2d');
                            floorBarChart = new Chart(barCtx, {
                                type: 'bar',
                                data: {
                                    labels: floorLabels,
                                    datasets: [
                                        {
                                            label: 'Total Expected Rent',
                                            data: floorExpectedData,
                                            backgroundColor: 'rgb(59, 130, 246)', // Blue
                                        },
                                        {
                                            label: 'Total Amount Due',
                                            data: floorDueData,
                                            backgroundColor: 'rgb(248, 113, 113)', // Red
                                        }
                                    ]
                                },
                                options: {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                callback: function(value) { return CURRENCY_SYMBOL + value; }
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
               
