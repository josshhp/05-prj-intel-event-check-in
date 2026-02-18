const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");
const waterAttendeeList = document.getElementById("waterAttendeeList");
const zeroAttendeeList = document.getElementById("zeroAttendeeList");
const powerAttendeeList = document.getElementById("powerAttendeeList");
const waterCard = document.querySelector(".team-card.water");
const zeroCard = document.querySelector(".team-card.zero");
const powerCard = document.querySelector(".team-card.power");
const storageKey = "intelEventCheckInState";

let checkInCount = 0;
const maxGoal = 50;
let progressPercentage = 0;
let goalReached = false;
let attendeeEntries = [];

function getTeamValueFromEntry(entry) {
  if (
    entry.teamValue === "water" ||
    entry.teamValue === "zero" ||
    entry.teamValue === "power"
  ) {
    return entry.teamValue;
  }

  if (entry.teamName === "Team Water Wise") {
    return "water";
  }

  if (entry.teamName === "Team Net Zero") {
    return "zero";
  }

  if (entry.teamName === "Team Renewables") {
    return "power";
  }

  return "";
}

function addEmptyTeamMessage(listElement) {
  const emptyItem = document.createElement("li");
  emptyItem.className = "team-attendee-empty";
  emptyItem.textContent = "No attendees yet.";
  listElement.appendChild(emptyItem);
}

function renderAttendeeListsByTeam() {
  waterAttendeeList.innerHTML = "";
  zeroAttendeeList.innerHTML = "";
  powerAttendeeList.innerHTML = "";

  let waterHasAttendees = false;
  let zeroHasAttendees = false;
  let powerHasAttendees = false;

  for (let i = 0; i < attendeeEntries.length; i = i + 1) {
    const entry = attendeeEntries[i];
    const teamValue = getTeamValueFromEntry(entry);
    const emptyItem = document.createElement("li");
    emptyItem.className = "team-attendee-item";
    emptyItem.textContent = entry.name;

    if (teamValue === "water") {
      waterAttendeeList.appendChild(emptyItem);
      waterHasAttendees = true;
    }

    if (teamValue === "zero") {
      zeroAttendeeList.appendChild(emptyItem);
      zeroHasAttendees = true;
    }

    if (teamValue === "power") {
      powerAttendeeList.appendChild(emptyItem);
      powerHasAttendees = true;
    }
  }

  if (waterHasAttendees === false) {
    addEmptyTeamMessage(waterAttendeeList);
  }

  if (zeroHasAttendees === false) {
    addEmptyTeamMessage(zeroAttendeeList);
  }

  if (powerHasAttendees === false) {
    addEmptyTeamMessage(powerAttendeeList);
  }
}

function saveCheckInState() {
  const state = {
    checkInCount: checkInCount,
    goalReached: goalReached,
    waterCount: Number(waterCount.textContent),
    zeroCount: Number(zeroCount.textContent),
    powerCount: Number(powerCount.textContent),
    attendeeEntries: attendeeEntries,
  };

  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.log("Could not save check-in state to localStorage.", error);
  }
}

function loadCheckInState() {
  try {
    const savedState = localStorage.getItem(storageKey);

    if (!savedState) {
      attendeeCount.textContent = checkInCount;
      progressBar.style.width = "0%";
      return;
    }

    const parsedState = JSON.parse(savedState);

    checkInCount = Number(parsedState.checkInCount) || 0;
    goalReached = parsedState.goalReached === true;

    waterCount.textContent = Number(parsedState.waterCount) || 0;
    zeroCount.textContent = Number(parsedState.zeroCount) || 0;
    powerCount.textContent = Number(parsedState.powerCount) || 0;

    if (Array.isArray(parsedState.attendeeEntries)) {
      attendeeEntries = parsedState.attendeeEntries;
    } else {
      attendeeEntries = [];
    }

    attendeeCount.textContent = checkInCount;

    progressPercentage = (checkInCount / maxGoal) * 100;
    progressPercentage = Math.min(progressPercentage, 100);
    progressBar.style.width = `${progressPercentage}%`;

    if (checkInCount >= maxGoal) {
      goalReached = true;
      highlightWinningTeam();
    }

    renderAttendeeListsByTeam();
  } catch (error) {
    console.log("Could not load check-in state from localStorage.", error);
    attendeeCount.textContent = 0;
    progressBar.style.width = "0%";
    attendeeEntries = [];
    renderAttendeeListsByTeam();
  }
}

function highlightWinningTeam() {
  const waterTotal = Number(waterCount.textContent);
  const zeroTotal = Number(zeroCount.textContent);
  const powerTotal = Number(powerCount.textContent);

  let winningTeamName = "Team Water Wise";
  let winningTeamCard = waterCard;
  let highestTotal = waterTotal;

  if (zeroTotal > highestTotal) {
    highestTotal = zeroTotal;
    winningTeamName = "Team Net Zero";
    winningTeamCard = zeroCard;
  }

  if (powerTotal > highestTotal) {
    winningTeamName = "Team Renewables";
    winningTeamCard = powerCard;
  }

  waterCard.classList.remove("winner-team");
  zeroCard.classList.remove("winner-team");
  powerCard.classList.remove("winner-team");

  winningTeamCard.classList.add("winner-team");

  return winningTeamName;
}

loadCheckInState();
renderAttendeeListsByTeam();

checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;
  const selectedTeamName = teamSelect.options[teamSelect.selectedIndex].text;

  if (attendeeName === "" || selectedTeam === "") {
    greeting.textContent = "Please enter a name and select a team.";
    greeting.style.display = "block";
    greeting.classList.remove("success-message");
    return;
  }

  greeting.textContent = `Welcome, ${attendeeName}! You are checked in with ${selectedTeamName}.`;
  greeting.style.display = "block";
  greeting.classList.add("success-message");

  checkInCount = checkInCount + 1;
  attendeeCount.textContent = checkInCount;

  const selectedTeamCountElement = document.getElementById(
    `${selectedTeam}Count`,
  );

  if (selectedTeamCountElement) {
    const currentTeamCount = Number(selectedTeamCountElement.textContent);
    selectedTeamCountElement.textContent = currentTeamCount + 1;
  }

  attendeeEntries.push({
    name: attendeeName,
    teamName: selectedTeamName,
    teamValue: selectedTeam,
  });
  renderAttendeeListsByTeam();

  progressPercentage = (checkInCount / maxGoal) * 100;
  progressPercentage = Math.min(progressPercentage, 100);
  progressBar.style.width = `${progressPercentage}%`;

  if (checkInCount >= maxGoal && goalReached === false) {
    goalReached = true;
    const winningTeamName = highlightWinningTeam();
    greeting.textContent = `🎉 Goal reached! ${winningTeamName} won the check-in challenge!`;
    greeting.style.display = "block";
    greeting.classList.add("success-message");
  }

  saveCheckInState();

  console.log(`Name: ${attendeeName}`);
  console.log(`Team value: ${selectedTeam}`);
  console.log(`Team name: ${selectedTeamName}`);
  console.log(`Progress: ${progressPercentage}%`);

  checkInForm.reset();
  teamSelect.selectedIndex = 0;
  attendeeNameInput.focus();
});
