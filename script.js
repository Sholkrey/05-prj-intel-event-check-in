// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCountEl = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greetingEl = document.getElementById("greeting");
const teamCounters = {
  water: document.getElementById("waterCount"),
  zero: document.getElementById("zeroCount"),
  power: document.getElementById("powerCount"),
};

// Attendance goal
const maxCount = 50;

// Load from localStorage or start fresh
let count = parseInt(localStorage.getItem("totalCount")) || 0;
let teamCounts = JSON.parse(localStorage.getItem("teamCounts")) || {
  water: 0,
  zero: 0,
  power: 0,
};
let attendeeList = JSON.parse(localStorage.getItem("attendeeList")) || [];

// Update UI from saved data
function updateUI() {
  attendeeCountEl.textContent = count;
  for (const team in teamCounters) {
    teamCounters[team].textContent = teamCounts[team];
  }
  const percent = Math.round((count / maxCount) * 100);
  progressBar.style.width = `${percent}%`;
  // Show attendee list
  let listHtml = "";
  for (let i = 0; i < attendeeList.length; i++) {
    const attendee = attendeeList[i];
    listHtml += `<div class="attendee-row">${attendee.name} <span class="attendee-team">(${attendee.teamName})</span></div>`;
  }
  let attendeeListEl = document.getElementById("attendeeList");
  if (!attendeeListEl) {
    attendeeListEl = document.createElement("div");
    attendeeListEl.id = "attendeeList";
    attendeeListEl.style.marginTop = "20px";
    attendeeListEl.style.textAlign = "left";
    form.parentNode.appendChild(attendeeListEl);
  }
  attendeeListEl.innerHTML = `<h4>Attendees</h4>${listHtml}`;
}

function saveProgress() {
  localStorage.setItem("totalCount", count);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendeeList", JSON.stringify(attendeeList));
}

function showGreeting(message, success) {
  greetingEl.textContent = message;
  greetingEl.style.display = "block";
  if (success) {
    greetingEl.classList.add("success-message");
  } else {
    greetingEl.classList.remove("success-message");
  }
}

function showCelebration(winningTeam) {
  showGreeting(`🎉 Attendance goal reached! ${winningTeam} wins! 🎉`, true);
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  if (!name || !team) {
    showGreeting("Please enter your name and select a team.", false);
    return;
  }

  // Prevent duplicate check-in
  for (let i = 0; i < attendeeList.length; i++) {
    if (attendeeList[i].name.toLowerCase() === name.toLowerCase()) {
      showGreeting(`Attendee ${name} already checked in.`, false);
      return;
    }
  }

  count++;
  teamCounts[team]++;
  attendeeList.push({ name: name, team: team, teamName: teamName });
  saveProgress();
  updateUI();

  const message = `Welcome ${name} from ${teamName}! You are attendee number ${count}.`;
  showGreeting(message, true);

  // Celebration feature
  if (count === maxCount) {
    // Find winning team
    let winningTeam = "";
    let maxTeamCount = 0;
    for (const t in teamCounts) {
      if (teamCounts[t] > maxTeamCount) {
        maxTeamCount = teamCounts[t];
        winningTeam = teamCounters[t].previousElementSibling.textContent;
      }
    }
    showCelebration(winningTeam);
  }

  form.reset();
});

// Initial UI update
updateUI();
