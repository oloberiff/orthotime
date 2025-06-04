const map = L.map("map").setView([37.7749, -122.4194], 12); // Adjust coords as needed

// Create a list of month strings: "YYYY-MM"
const startYear = 2023;
const endYear = 2024;
const monthsList = [];
for (let y = startYear; y <= endYear; y++) {
  for (let m = 1; m <= 12; m++) {
    const mm = m.toString().padStart(2, "0");
    monthsList.push(`${y}-${mm}`);
  }
}

/* another scenario pakai folder yg ada aja YYYY-MM

const monthsList = ['2023-01',
                    '2023-02',];

*/

// Create tile layers dynamically
const orthophotos = {};
monthsList.forEach(dateStr => {
  // Replace URL template with your actual tiles path!
  orthophotos[dateStr] = L.tileLayer(`tiles/${dateStr}/{z}/{x}/{y}.png`, {
    maxZoom: 19,
    attribution: "Your attribution here",
    errorTileUrl: 'path/to/transparent-tile.png' //Optional fallback tile
  });
});

let currentIndex = 0;
let currentLayer = orthophotos[monthsList[currentIndex]];
currentLayer.addTo(map);

const slider = document.getElementById("timeSlider");
const dateLabel = document.getElementById("dateLabel");
const loadingIndicator = document.getElementById("loading");
const playPauseBtn = document.getElementById("playPauseBtn");

// Show/hide loading indicator
function showLoading() {
  loadingIndicator.style.display = "block";
}
function hideLoading() {
  loadingIndicator.style.display = "none";
}

// Add loading events to tile layer
function addLoadingEvents(layer) {
  layer.on("loading", showLoading);
  layer.on("load", hideLoading);
}

addLoadingEvents(currentLayer);

// Update map layer and label when slider moves
slider.addEventListener("input", (e) => {
  const idx = +e.target.value;
  if (idx === currentIndex) return;

  dateLabel.textContent = monthsList[idx];
  showLoading();

  map.removeLayer(currentLayer);
  currentLayer = orthophotos[monthsList[idx]];
  addLoadingEvents(currentLayer);
  currentLayer.addTo(map);

  currentIndex = idx;
});

// Play/pause animation
let playInterval = null;

playPauseBtn.addEventListener("click", () => {
  if (playInterval) {
    clearInterval(playInterval);
    playInterval = null;
    playPauseBtn.textContent = "Play ▶️";
  } else {
    playPauseBtn.textContent = "Pause ⏸️";
    playInterval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= monthsList.length) nextIndex = 0;
      slider.value = nextIndex;
      slider.dispatchEvent(new Event("input"));
    }, 1500);
  }
});
