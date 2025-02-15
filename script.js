// Select DOM elements
const colorsContainer = document.getElementById("colorsContainer");
const addColorBtn = document.getElementById("addColorBtn");
const removeColorBtn = document.getElementById("removeColorBtn");
const resetButton = document.getElementById("resetButton");
const cssOutput = document.getElementById("cssOutput");
const copyButton = document.getElementById("copyButton");

// Gradient type toggle
const gradientToggle = document.getElementById("gradientToggle");

// Animation toggle and duration input
const animateToggle = document.getElementById("animateToggle");
const durationInput = document.getElementById("durationInput");

// Initial color inputs
const color0 = document.getElementById("color0");
const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");

// Update gradient when color inputs change
[color0, color1, color2].forEach((input) => {
  input.addEventListener("input", generateGradient);
});

// Update gradient when toggles change
gradientToggle.addEventListener("change", generateGradient);
animateToggle.addEventListener("change", generateGradient);
durationInput.addEventListener("input", generateGradient);

// Horizontal angle slider elements
const angleSlider = document.getElementById("angleSlider");
const sliderHandle = document.getElementById("sliderHandle");
const angleLabel = document.getElementById("angleLabel");

// Current angle in degrees and color count
let currentAngle = 90; // Start at 90 degrees
let colorCount = 3;

// Retrieve current colors from inputs
function getColors() {
  const inputs = colorsContainer.querySelectorAll('input[type="color"]');
  return Array.from(inputs).map((input) => input.value);
}

// Get current gradient type (linear or radial)
function getGradientType() {
  return gradientToggle.checked ? "radial" : "linear";
}

// Generate the gradient, apply animation if enabled, and update the CSS output
function generateGradient() {
  const gradientType = getGradientType();
  const colors = getColors();

  // If only one color, show a solid background
  if (colors.length === 1) {
    document.body.style.background = colors[0];
    cssOutput.value = `background: ${colors[0]};`;
    return;
  }

  const step = 100 / (colors.length - 1);
  const stops = colors.map(
    (color, index) => `${color} ${Math.round(step * index)}%`
  );
  let gradientString = "";

  if (gradientType === "linear") {
    gradientString = `linear-gradient(${currentAngle}deg, ${stops.join(", ")})`;
  } else {
    gradientString = `radial-gradient(circle, ${stops.join(", ")})`;
  }

  // Apply the gradient to the body background
  document.body.style.background = gradientString;

  // If animation is enabled, use the user-specified duration
  let animationCSS = "";
  if (animateToggle.checked) {
    const duration = parseFloat(durationInput.value) || 5;
    document.body.style.backgroundSize = "150% 150%";
    document.body.style.animation = `animateGradient ${duration}s ease-in-out infinite alternate`;
    animationCSS = `\nanimation: animateGradient ${duration}s ease-in-out infinite alternate;\nbackground-size: 150% 150%;`;
  } else {
    document.body.style.backgroundSize = "auto";
    document.body.style.animation = "none";
  }

  // Update the generated CSS output
  cssOutput.value = `background: ${gradientString};${animationCSS}`;
}

// Add a new color input dynamically
addColorBtn.addEventListener("click", () => {
  const newIndex = colorCount;
  colorCount++;
  const colorGroup = document.createElement("div");
  colorGroup.className = "color-group";
  const label = document.createElement("label");
  label.textContent = `Color ${newIndex + 1}:`;
  label.htmlFor = `color${newIndex}`;
  const input = document.createElement("input");
  input.type = "color";
  input.id = `color${newIndex}`;
  input.value = "#000000"; // Default color
  input.addEventListener("input", generateGradient);
  colorGroup.appendChild(label);
  colorGroup.appendChild(input);
  colorsContainer.appendChild(colorGroup);
  generateGradient();
});

// Remove the last color input if more than one exists
removeColorBtn.addEventListener("click", () => {
  if (colorCount > 1) {
    colorsContainer.removeChild(colorsContainer.lastElementChild);
    colorCount--;
    generateGradient();
  }
});

// Reset settings to defaults
resetButton.addEventListener("click", () => {
  currentAngle = 90; // Start at 90 degrees
  sliderHandle.style.left = "calc(90% - 136px)"; // Set slider position to 90 degrees
  angleLabel.textContent = "90°"; // Set label text to 90°
  gradientToggle.checked = false;
  animateToggle.checked = false;
  durationInput.value = "5";
  document.getElementById("color0").value = "#ff0000";
  document.getElementById("color1").value = "#0000ff";
  document.getElementById("color2").value = "#000000";
  while (colorCount > 3) {
    colorsContainer.removeChild(colorsContainer.lastElementChild);
    colorCount--;
  }
  generateGradient();
});

// Copy-to-clipboard with a toast notification
function showToast() {
  const toast = document.getElementById("copyToast");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

copyButton.addEventListener("click", () => {
  const text = cssOutput.value;
  if (text.trim() === "") return;
  navigator.clipboard
    .writeText(text)
    .then(showToast)
    .catch((err) => alert("Failed to copy: " + err));
});

// Angle slider drag logic
let isDragging = false;
angleSlider.addEventListener("mousedown", (e) => {
  isDragging = true;
  updateSlider(e);
});
document.addEventListener("mouseup", () => (isDragging = false));
document.addEventListener("mousemove", (e) => {
  if (isDragging) updateSlider(e);
});

function updateSlider(e) {
  const rect = angleSlider.getBoundingClientRect();
  let offsetX = e.clientX - rect.left;
  if (offsetX < 0) offsetX = 0;
  if (offsetX > rect.width) offsetX = rect.width;

  // Update angle to match slider position
  currentAngle = Math.round((offsetX / rect.width) * 360);

  // Adjust handle and angle display
  sliderHandle.style.left = offsetX - 8 + "px"; // 8px is half the width of the slider handle
  angleLabel.textContent = `${currentAngle}°`; // Show angle in the label
  generateGradient(); // Generate new gradient with updated angle
}

// Minimize/Restore functionality for the app container
const minimizeButton = document.getElementById("minimizeButton");
const minimizerDisclaimer = document.querySelector(".minimizer-disclaimer");
minimizeButton.addEventListener("click", () => {
  const appContainer = document.querySelector(".app-container");
  appContainer.classList.toggle("minimized");
  if (appContainer.classList.contains("minimized")) {
    minimizeButton.textContent = "▢";
    minimizerDisclaimer.textContent = "Maximize";
  } else {
    minimizeButton.textContent = "–";
    minimizerDisclaimer.textContent = "Minimize";
  }
});

// Initialize on page load
window.addEventListener("DOMContentLoaded", () => {
  currentAngle = 90; // Start at 90 degrees
  sliderHandle.style.left = "calc(90% - 136px)"; // Set slider position to 90 degrees
  angleLabel.textContent = "90°"; // Set label text to 90°
  generateGradient();
});

// Select the angle slider wrapper
const angleSliderWrapper = document.querySelector(".angle-slider-wrapper");

// Update the generateGradient function to show/hide the angle slider based on the gradient type
function generateGradient() {
  const gradientType = getGradientType();
  const colors = getColors();

  // Hide or show the angle slider based on the gradient type
  if (gradientType === "radial") {
    angleSliderWrapper.style.display = "none"; // Hide the angle slider when radial is selected
  } else {
    angleSliderWrapper.style.display = "block"; // Show the angle slider when linear is selected
  }

  // If only one color, show a solid background
  if (colors.length === 1) {
    document.body.style.background = colors[0];
    cssOutput.value = `background: ${colors[0]};`;
    return;
  }

  const step = 100 / (colors.length - 1);
  const stops = colors.map(
    (color, index) => `${color} ${Math.round(step * index)}%`
  );
  let gradientString = "";

  if (gradientType === "linear") {
    gradientString = `linear-gradient(${currentAngle}deg, ${stops.join(", ")})`;
  } else {
    gradientString = `radial-gradient(circle, ${stops.join(", ")})`;
  }

  // Apply the gradient to the body background
  document.body.style.background = gradientString;

  // If animation is enabled, use the user-specified duration
  let animationCSS = "";
  if (animateToggle.checked) {
    const duration = parseFloat(durationInput.value) || 5;
    document.body.style.backgroundSize = "150% 150%";
    document.body.style.animation = `animateGradient ${duration}s ease-in-out infinite alternate`;
    animationCSS = `\nanimation: animateGradient ${duration}s ease-in-out infinite alternate;\nbackground-size: 150% 150%;
    \n@keyframes animateGradient {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }`;
  } else {
    document.body.style.backgroundSize = "auto";
    document.body.style.animation = "none";
  }

  // Update the generated CSS output
  cssOutput.value = `background: ${gradientString};${animationCSS}`;
}

// Update gradient when toggles change
gradientToggle.addEventListener("change", generateGradient);

