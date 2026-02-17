const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");
const waterCard = document.querySelector(".team-card.water");
const zeroCard = document.querySelector(".team-card.zero");
const powerCard = document.querySelector(".team-card.power");

let checkInCount = 0;
const maxGoal = 50;
let progressPercentage = 0;
let goalReached = false;

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

attendeeCount.textContent = checkInCount;
progressBar.style.width = "0%";

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

  console.log(`Name: ${attendeeName}`);
  console.log(`Team value: ${selectedTeam}`);
  console.log(`Team name: ${selectedTeamName}`);
  console.log(`Progress: ${progressPercentage}%`);

  checkInForm.reset();
  teamSelect.selectedIndex = 0;
  attendeeNameInput.focus();
});
