// Timezone data with common locations
const timezones = [
    { value: 'Pacific/Midway', label: '(GMT-11:00) Midway' },
    { value: 'Pacific/Honolulu', label: '(GMT-10:00) Hawaii' },
    { value: 'America/Anchorage', label: '(GMT-09:00) Alaska' },
    { value: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Time (US & Canada)' },
    { value: 'America/Denver', label: '(GMT-07:00) Mountain Time (US & Canada)' },
    { value: 'America/Chicago', label: '(GMT-06:00) Central Time (US & Canada)' },
    { value: 'America/New_York', label: '(GMT-05:00) Eastern Time (US & Canada)' },
    { value: 'America/Halifax', label: '(GMT-04:00) Atlantic Time (Canada)' },
    { value: 'America/St_Johns', label: '(GMT-03:30) Newfoundland' },
    { value: 'America/Sao_Paulo', label: '(GMT-03:00) Brasilia' },
    { value: 'Atlantic/South_Georgia', label: '(GMT-02:00) Mid-Atlantic' },
    { value: 'Atlantic/Azores', label: '(GMT-01:00) Azores' },
    { value: 'Europe/London', label: '(GMT+00:00) London' },
    { value: 'Europe/Paris', label: '(GMT+01:00) Paris' },
    { value: 'Europe/Helsinki', label: '(GMT+02:00) Helsinki' },
    { value: 'Europe/Moscow', label: '(GMT+03:00) Moscow' },
    { value: 'Asia/Dubai', label: '(GMT+04:00) Dubai' },
    { value: 'Asia/Karachi', label: '(GMT+05:00) Islamabad' },
    { value: 'Asia/Dhaka', label: '(GMT+06:00) Dhaka' },
    { value: 'Asia/Bangkok', label: '(GMT+07:00) Bangkok' },
    { value: 'Asia/Hong_Kong', label: '(GMT+08:00) Hong Kong' },
    { value: 'Asia/Tokyo', label: '(GMT+09:00) Tokyo' },
    { value: 'Australia/Sydney', label: '(GMT+10:00) Sydney' },
    { value: 'Pacific/Noumea', label: '(GMT+11:00) New Caledonia' },
    { value: 'Pacific/Auckland', label: '(GMT+12:00) Auckland' },
    { value: 'Pacific/Tongatapu', label: '(GMT+13:00) Nuku\'alofa' }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Populate timezone dropdown
    const timezoneSelect = document.getElementById('timezone');
    timezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz.value;
        option.textContent = tz.label;
        timezoneSelect.appendChild(option);
    });
    
    // Load saved clocks from localStorage
    loadSavedClocks();
    
    // Set up form submission
    document.getElementById('addClockForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addClock();
    });
    
    // Start updating all clocks every second
    setInterval(updateAllClocks, 1000);
});

// Add a new clock
function addClock() {
    const timezoneSelect = document.getElementById('timezone');
    const labelInput = document.getElementById('label');
    
    const timezone = timezoneSelect.value;
    const label = labelInput.value.trim() || getTimezoneName(timezone);
    
    if (!timezone) {
        alert('Please select a timezone');
        return;
    }
    
    // Create clock object
    const clock = {
        id: Date.now().toString(),
        timezone,
        label
    };
    
    // Save to localStorage
    saveClock(clock);
    
    // Add to display
    createClockElement(clock);
    
    // Reset form
    timezoneSelect.selectedIndex = 0;
    labelInput.value = '';
}

// Save clock to localStorage
function saveClock(clock) {
    const clocks = JSON.parse(localStorage.getItem('worldClocks') || '[]');
    clocks.push(clock);
    localStorage.setItem('worldClocks', JSON.stringify(clocks));
}

// Load saved clocks from localStorage
function loadSavedClocks() {
    const clocks = JSON.parse(localStorage.getItem('worldClocks') || '[]');
    clocks.forEach(clock => createClockElement(clock));
}

// Create clock element and add to DOM
function createClockElement(clock) {
    const clocksContainer = document.getElementById('clocksContainer');
    
    const clockElement = document.createElement('div');
    clockElement.className = 'clock-card bg-white rounded-lg shadow-md p-6 flex flex-col';
    clockElement.id = `clock-${clock.id}`;
    
    clockElement.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <h3 class="text-xl font-semibold text-gray-800">${clock.label}</h3>
            <button class="btn btn-circle btn-sm btn-ghost text-gray-500 hover:text-red-500 delete-clock" data-id="${clock.id}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div class="text-3xl font-bold text-center my-4" id="time-${clock.id}">00:00:00</div>
        <div class="text-lg text-center text-gray-600" id="date-${clock.id}">January 1, 2023</div>
        <div class="mt-4 text-sm text-gray-500">${getTimezoneLabel(clock.timezone)}</div>
    `;
    
    clocksContainer.appendChild(clockElement);
    
    // Add event listener for delete button
    clockElement.querySelector('.delete-clock').addEventListener('click', function() {
        deleteClock(clock.id);
    });
    
    // Update immediately
    updateClock(clock.id, clock.timezone);
}

// Update all clocks
function updateAllClocks() {
    const clocks = JSON.parse(localStorage.getItem('worldClocks') || '[]');
    clocks.forEach(clock => {
        updateClock(clock.id, clock.timezone);
    });
}

// Update a single clock
function updateClock(id, timezone) {
    try {
        const options = {
            timeZone: timezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        
        const dateOptions = {
            timeZone: timezone,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', options);
        const dateStr = now.toLocaleDateString('en-US', dateOptions);
        
        document.getElementById(`time-${id}`).textContent = timeStr;
        document.getElementById(`date-${id}`).textContent = dateStr;
    } catch (e) {
        console.error(`Error updating clock ${id}:`, e);
    }
}

// Delete a clock
function deleteClock(id) {
    // Remove from DOM
    const clockElement = document.getElementById(`clock-${id}`);
    if (clockElement) {
        clockElement.remove();
    }
    
    // Remove from localStorage
    const clocks = JSON.parse(localStorage.getItem('worldClocks') || '[]');
    const updatedClocks = clocks.filter(clock => clock.id !== id);
    localStorage.setItem('worldClocks', JSON.stringify(updatedClocks));
}

// Helper function to get timezone name
function getTimezoneName(timezone) {
    const tz = timezones.find(t => t.value === timezone);
    return tz ? tz.label.split(') ')[1] || timezone : timezone;
}

// Helper function to get timezone label
function getTimezoneLabel(timezone) {
    const tz = timezones.find(t => t.value === timezone);
    return tz ? tz.label : timezone;
}
