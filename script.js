// References
const colorsContainer = document.getElementById("colorsContainer");
const addColorBtn = document.getElementById("addColorBtn");
const removeColorBtn = document.getElementById("removeColorBtn");
const gradientPreview = document.getElementById("gradientPreview");
const cssOutput = document.getElementById("cssOutput");
const copyButton = document.getElementById("copyButton");

// Toggle input for Linear (unchecked) vs Radial (checked)
const gradientToggle = document.getElementById("gradientToggle");

// Initial color inputs
const color0 = document.getElementById("color0");
const color1 = document.getElementById("color1");

// Attach event listeners so they update live
color0.addEventListener("input", generateGradient);
color1.addEventListener("input", generateGradient);

// Horizontal angle slider elements
const angleSlider = document.getElementById("angleSlider");
const sliderHandle = document.getElementById("sliderHandle");
const angleLabel = document.getElementById("angleLabel");

// We'll store the angle in degrees [0..360]
let currentAngle = 0;
let colorCount = 2; // how many color inputs exist

/**
 * Collect all color values from the container
 */
function getColors() {
  const colorInputs = colorsContainer.querySelectorAll('input[type="color"]');
  return Array.from(colorInputs).map((input) => input.value);
}

/**
 * Determine whether we should use linear or radial
 * Toggle checked => radial, otherwise => linear
 */
function getGradientType() {
  return gradientToggle.checked ? "radial" : "linear";
}

/**
 * Generate the gradient and update the preview + output
 */
function generateGradient() {
  const gradientType = getGradientType();
  // use our slider angle
  const angle = currentAngle;
  const colors = getColors();

  // If only one color, just show a solid background
  if (colors.length === 1) {
    gradientPreview.style.background = colors[0];
    cssOutput.value = `background: ${colors[0]};`;
    return;
  }

  // Distribute stops evenly from 0% to 100%
  const step = 100 / (colors.length - 1);
  const gradientStops = colors.map((color, index) => {
    const position = Math.round(step * index);
    return `${color} ${position}%`;
  });

  let gradientString = "";

  if (gradientType === "linear") {
    gradientString = `linear-gradient(${angle}deg, ${gradientStops.join(
      ", "
    )})`;
  } else {
    // Radial ignores the angle
    gradientString = `radial-gradient(circle, ${gradientStops.join(", ")})`;
  }

  // Apply to preview
  gradientPreview.style.background = gradientString;
  // Display CSS
  cssOutput.value = `background: ${gradientString};`;
}

/**
 * Add a new color input dynamically
 */
addColorBtn.addEventListener("click", () => {
  const newIndex = colorCount;
  colorCount++;

  // Create a new color picker
  const colorGroup = document.createElement("div");
  colorGroup.className = "color-group";

  const label = document.createElement("label");
  label.textContent = `Color ${newIndex + 1}:`;
  label.htmlFor = `color${newIndex}`;

  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.id = `color${newIndex}`;
  colorInput.value = "#000000"; // default color
  colorInput.addEventListener("input", generateGradient);

  // Append to DOM
  colorGroup.appendChild(label);
  colorGroup.appendChild(colorInput);
  colorsContainer.appendChild(colorGroup);

  generateGradient();
});

/**
 * Remove the last color input
 */
removeColorBtn.addEventListener("click", () => {
  if (colorCount > 1) {
    colorsContainer.removeChild(colorsContainer.lastElementChild);
    colorCount--;
    generateGradient();
  }
});

/**
 * Copy the generated CSS to clipboard
 */
copyButton.addEventListener("click", () => {
  const cssToCopy = cssOutput.value;
  if (cssToCopy.trim() === "") return;

  navigator.clipboard
    .writeText(cssToCopy)
    .then(() => {
      alert("Copied to clipboard!");
    })
    .catch((err) => {
      alert("Failed to copy text: " + err);
    });
});

/* 
  HORIZONTAL ANGLE SLIDER DRAG LOGIC 
  - The slider is ~200px wide.
  - 0 => angle 0°, 200 => angle 360° 
*/
let isDragging = false;

angleSlider.addEventListener("mousedown", (e) => {
  isDragging = true;
  updateSlider(e);
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    updateSlider(e);
  }
});

function updateSlider(e) {
  const rect = angleSlider.getBoundingClientRect();
  const sliderWidth = rect.width;
  let offsetX = e.clientX - rect.left;

  // clamp offsetX to [0, sliderWidth]
  if (offsetX < 0) offsetX = 0;
  if (offsetX > sliderWidth) offsetX = sliderWidth;

  // Convert offsetX -> angle
  const newAngle = Math.round((offsetX / sliderWidth) * 360);
  currentAngle = newAngle;

  // Move the handle
  const handleX = offsetX - 8;
  sliderHandle.style.left = `${handleX}px`;

  // Update the label
  angleLabel.textContent = `${currentAngle}°`;

  // Re-generate the gradient
  generateGradient();
}

// Listen for changes on the toggle
gradientToggle.addEventListener("change", generateGradient);

// On page load, initialize everything
window.addEventListener("DOMContentLoaded", () => {
  currentAngle = 0;
  sliderHandle.style.left = `-8px`;
  angleLabel.textContent = `${currentAngle}°`;
  generateGradient();
});
