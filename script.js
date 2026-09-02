// Dynamic Client JavaScript Logic for SkillsUSA Chapter Portal

// 1. Live Filter Matrix Logic for Positions/Pathways Grid
function filterItems(category) {
    // Select filter control buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Highlight selected button
    event.currentTarget.classList.add('active');

    // Retrieve target item grids
    const gridItems = document.querySelectorAll('.filter-item');
    
    gridItems.forEach(item => {
        if (category === 'all') {
            item.style.display = 'block';
        } else {
            if (item.classList.contains(category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        }
    });
}

// 2. Simple Dynamic September 2026 Calendar Constructor Script
document.addEventListener("DOMContentLoaded", () => {
    const calendarDaysContainer = document.getElementById("calendarDays");
    
    // Configuration properties for September 2026
    // Sept 1, 2026 begins on a Tuesday (Index 2 if Sunday is 0)
    const startingDayOfWeekIndex = 2; 
    const totalDaysInMonth = 30;

    // Local highlight dictionaries mapping specific dates to special events 
    const meetingDates = [10, 24]; // Meeting index days
    const specialEventDates = [15]; // FLC or Conference Prep dates

    // Render preceding empty layout gaps
    for (let i = 0; i < startingDayOfWeekIndex; i++) {
        const emptyElement = document.createElement("div");
        emptyElement.classList.add("empty-day");
        calendarDaysContainer.appendChild(emptyElement);
    }

    // Build functional numeric date boxes
    for (let day = 1; day <= totalDaysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.textContent = day;

        // Apply interactive marker CSS nodes if matching event models
        if (meetingDates.includes(day)) {
            dayElement.classList.add("has-event-meeting");
            dayElement.title = "Chapter Meeting Scheduled";
        } else if (specialEventDates.includes(day)) {
            dayElement.classList.add("has-event-special");
            dayElement.title = "Special Leadership Event";
        }

        calendarDaysContainer.appendChild(dayElement);
    }
});
