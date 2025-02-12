// References
const angleInput = document.getElementById("angleInput");
const colorsContainer = document.getElementById("colorsContainer");
const addColorBtn = document.getElementById("addColorBtn");
const removeColorBtn = document.getElementById("removeColorBtn");
const gradientPreview = document.getElementById("gradientPreview");
const cssOutput = document.getElementById("cssOutput");
const copyButton = document.getElementById("copyButton");

// Radio buttons for gradient type
// We get them all, and whichever is checked will define the type
const radios = document.querySelectorAll('input[name="gradientType"]');

// Initial color inputs
const color0 = document.getElementById("color0");
const color1 = document.getElementById("color1");

// Attach listeners to the *initial* color inputs
color0.addEventListener("input", generateGradient);
color1.addEventListener("input", generateGradient);

// Keep track of how many color inputs exist
let colorCount = 2;

/**
 * Collect all color values from the container
 */
function getColors() {
  const colorInputs = colorsContainer.querySelectorAll('input[type="color"]');
  return Array.from(colorInputs).map((input) => input.value);
}

/**
 * Get the current gradient type from the radio buttons (linear or radial)
 */
function getGradientType() {
  const selectedRadio = document.querySelector(
    'input[name="gradientType"]:checked'
  );
  return selectedRadio ? selectedRadio.value : "linear";
}

/**
 * Generate the gradient and update the preview + output
 */
function generateGradient() {
  const gradientType = getGradientType(); // "linear" or "radial"
  const angle = angleInput.value;
  const colors = getColors();

  // If only one color, just show a solid background
  if (colors.length === 1) {
    gradientPreview.style.background = colors[0];
    cssOutput.value = `background: ${colors[0]};`;
    return;
  }

  // Distribute stops evenly from 0% ... 100%
  const step = 100 / (colors.length - 1);
  const gradientStops = colors.map((color, index) => {
    const position = Math.round(step * index);
    return `${color} ${position}%`;
  });

  let gradientString = "";

  if (gradientType === "linear") {
    // e.g., linear-gradient(90deg, #ff0000 0%, #0000ff 100%)
    gradientString = `linear-gradient(${angle}deg, ${gradientStops.join(
      ", "
    )})`;
  } else {
    // e.g., radial-gradient(circle, #ff0000 0%, #0000ff 100%)
    // We ignore angle for radial
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
  // Avoid going below 1 color
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
  if (cssToCopy.trim() === "") return; // nothing to copy

  navigator.clipboard
    .writeText(cssToCopy)
    .then(() => {
      alert("Copied to clipboard!");
    })
    .catch((err) => {
      alert("Failed to copy text: " + err);
    });
});

// Listen for changes on BOTH radio buttons
radios.forEach((radio) => {
  radio.addEventListener("change", generateGradient);
});

// Angle changes
angleInput.addEventListener("input", generateGradient);

// Initialize the gradient on page load
window.addEventListener("DOMContentLoaded", generateGradient);
