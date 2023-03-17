const activeToolEl = document.getElementById("active-tool") as HTMLElement;
const brushColorBtn = document.getElementById(
  "brush-color"
) as HTMLButtonElement;
const brushIcon = document.getElementById("brush") as HTMLElement;
const brushSize = document.getElementById("brush-size") as HTMLElement;
const brushSlider = document.getElementById("brush-slider") as HTMLInputElement;
const bucketColorBtn = document.getElementById(
  "bucket-color"
) as HTMLButtonElement;
const eraser = document.getElementById("eraser") as HTMLElement;
const clearCanvasBtn = document.getElementById(
  "clear-canvas"
) as HTMLButtonElement;
const saveStorageBtn = document.getElementById(
  "save-storage"
) as HTMLButtonElement;
const loadStorageBtn = document.getElementById(
  "load-storage"
) as HTMLButtonElement;
const clearStorageBtn = document.getElementById(
  "clear-storage"
) as HTMLButtonElement;
const downloadBtn = document.getElementById("download") as HTMLAnchorElement;
const BRUSH_TIME: number = 1500;
const { body } = document;

// =========//
interface SavedDrawnArrayObject {
  [key: string]: number;
}
// Global Variables
const canvas = document.createElement("canvas");
canvas.id = "canvas";
const context = canvas.getContext("2d");
let currentSize: number | string = 10;
let bucketColor: string = "#FFFFFF";
let currentColor: string = "#A51DAB";
let isEraser: boolean = false;
let isMouseDown: boolean = false;
let drawnArray: SavedDrawnArrayObject[] = [];

// ? ========================= //
function brushSetTimeOut(ms: number) {
  setTimeout(switchToBrush, ms);
}

// Formatting Brush Size
function displayBrushSize() {
  if (Number(brushSlider.value) < 10) {
    brushSize.textContent = `0${brushSlider.value}`;
  } else {
    brushSize.textContent = brushSlider.value;
  }
}
// Setting Brush Size
brushSlider.addEventListener("change", () => {
  currentSize = brushSlider.value;
  displayBrushSize();
});

// Setting Brush Color
brushColorBtn.addEventListener("change", () => {
  isEraser = false;
  currentColor = `#${brushColorBtn.value}`;
});

// Setting Background Color and restoring current/active canvas
bucketColorBtn.addEventListener("change", () => {
  // No '#' in the mark up
  bucketColor = `#${bucketColorBtn.value}`;
  createCanvas();
  restoreCanvas();
});

// Eraser
// ? switch to eraser when the icon is clicked
eraser.addEventListener("click", () => {
  isEraser = true;
  brushIcon.style.color = "white";
  eraser.style.color = "black";
  activeToolEl.textContent = "Eraser";
  currentColor = bucketColor;
  currentSize = 50;
});

// Switch back to Brush
function switchToBrush() {
  isEraser = false;
  activeToolEl.textContent = "Brush";
  brushIcon.style.color = "black";
  eraser.style.color = "white";
  currentColor = `#${brushColorBtn.value}`;
  currentSize = 10;
  brushSlider.value = `10`;
  displayBrushSize();
}

// Create Canvas
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  context!.fillStyle = bucketColor;
  context!.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
  switchToBrush();
}

// Clear Canvas
clearCanvasBtn.addEventListener("click", () => {
  createCanvas();
  drawnArray = [];
  // Active Tool
  activeToolEl.textContent = "Canvas Cleared";
  brushSetTimeOut(BRUSH_TIME);
});

// Draw what is stored in DrawnArray
function restoreCanvas() {
  for (let i = 1; i < drawnArray.length; i++) {
    if (context !== null) {
      context.beginPath();
      context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
      context.lineWidth = drawnArray[i].size;
      context.lineCap = "round";
      if (drawnArray[i].eraser) {
        context.strokeStyle = bucketColor;
      } else {
        context.strokeStyle = `drawnArray[i].color`;
      }
      context.lineTo(drawnArray[i].x, drawnArray[i].y);
      context.stroke();
    }
  }
}

// Store Drawn Lines in DrawnArray
function storeDrawn(x: any, y: any, size: any, color: any, erase: any) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };

  drawnArray.push(line);
}

// Get Mouse Position
function getMousePosition(event: any) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}

// Mouse Down
canvas.addEventListener("mousedown", (event: any) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  if (context !== null) {
    context.moveTo(currentPosition.x, currentPosition.y);
    context.beginPath();
    context.lineWidth = Number(currentSize);
    context.lineCap = "round";
    context.strokeStyle = currentColor;
  }
});

// Mouse Move
canvas.addEventListener("mousemove", (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    if (context !== null) {
      context.lineTo(currentPosition.x, currentPosition.y);
      context.stroke();
      storeDrawn(
        currentPosition.x,
        currentPosition.y,
        Number(currentSize),
        Number(currentColor),
        isEraser
      );
    } else {
      storeDrawn(undefined, undefined, undefined, undefined, undefined);
    }
  }
});

// Stop drawing when the mouse is released
canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});

// Save to Local Storage
saveStorageBtn.addEventListener("click", () => {
  localStorage.setItem("savedCanvas", JSON.stringify(drawnArray));
  // Active Tool
  activeToolEl.textContent = "Canvas Saved";
  brushSetTimeOut(BRUSH_TIME);
});

// Load from Local Storage
loadStorageBtn.addEventListener("click", () => {
  if (localStorage.getItem("savedCanvas")) {
    drawnArray = JSON.parse(localStorage.getItem("savedCanvas") || "");
    restoreCanvas();
    // Active Tool
    activeToolEl.textContent = "Canvas Loaded";
    brushSetTimeOut(BRUSH_TIME);
  } else {
    activeToolEl.textContent = "No Canvas Found ";
  }
});

// Clear Local Storage
clearStorageBtn.addEventListener("click", () => {
  localStorage.removeItem("savedCanvas");
  // Active Tool
  activeToolEl.textContent = "Local Storage Cleared";
  brushSetTimeOut(BRUSH_TIME);
});

// Download Image
downloadBtn.addEventListener("click", () => {
  let saveAsImage;
  downloadBtn.href = canvas.toDataURL("image/jpeg", 1.0);
  downloadBtn.download = "image.jpeg";
  // Active Tool
  activeToolEl.textContent = "Image File Saved";
  brushSetTimeOut(BRUSH_TIME);
});

// Event Listener
brushIcon.addEventListener("click", switchToBrush);

// On Load
createCanvas();
