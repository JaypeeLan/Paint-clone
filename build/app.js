"use strict";
var activeToolEl = document.getElementById("active-tool");
var brushColorBtn = document.getElementById("brush-color");
var brushIcon = document.getElementById("brush");
var brushSize = document.getElementById("brush-size");
var brushSlider = document.getElementById("brush-slider");
var bucketColorBtn = document.getElementById("bucket-color");
var eraser = document.getElementById("eraser");
var clearCanvasBtn = document.getElementById("clear-canvas");
var saveStorageBtn = document.getElementById("save-storage");
var loadStorageBtn = document.getElementById("load-storage");
var clearStorageBtn = document.getElementById("clear-storage");
var downloadBtn = document.getElementById("download");
var BRUSH_TIME = 1500;
var body = document.body;
// Global Variables
var canvas = document.createElement("canvas");
canvas.id = "canvas";
var context = canvas.getContext("2d");
var currentSize = 10;
var bucketColor = "#FFFFFF";
var currentColor = "#A51DAB";
var isEraser = false;
var isMouseDown = false;
var drawnArray = [];
// ? ========================= //
function brushSetTimeOut(ms) {
    setTimeout(switchToBrush, ms);
}
// Formatting Brush Size
function displayBrushSize() {
    if (Number(brushSlider.value) < 10) {
        brushSize.textContent = "0".concat(brushSlider.value);
    }
    else {
        brushSize.textContent = brushSlider.value;
    }
}
// Setting Brush Size
brushSlider.addEventListener("change", function () {
    currentSize = brushSlider.value;
    displayBrushSize();
});
// Setting Brush Color
brushColorBtn.addEventListener("change", function () {
    isEraser = false;
    currentColor = "#".concat(brushColorBtn.value);
});
// Setting Background Color and restoring current/active canvas
bucketColorBtn.addEventListener("change", function () {
    // No '#' in the mark up
    bucketColor = "#".concat(bucketColorBtn.value);
    createCanvas();
    restoreCanvas();
});
// Eraser
// ? switch to eraser when the icon is clicked
eraser.addEventListener("click", function () {
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
    currentColor = "#".concat(brushColorBtn.value);
    currentSize = 10;
    brushSlider.value = "10";
    displayBrushSize();
}
// Create Canvas
function createCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
    context.fillStyle = bucketColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    body.appendChild(canvas);
    switchToBrush();
}
// Clear Canvas
clearCanvasBtn.addEventListener("click", function () {
    createCanvas();
    drawnArray = [];
    // Active Tool
    activeToolEl.textContent = "Canvas Cleared";
    brushSetTimeOut(BRUSH_TIME);
});
// Draw what is stored in DrawnArray
function restoreCanvas() {
    for (var i = 1; i < drawnArray.length; i++) {
        if (context !== null) {
            context.beginPath();
            context.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
            context.lineWidth = drawnArray[i].size;
            context.lineCap = "round";
            if (drawnArray[i].eraser) {
                context.strokeStyle = bucketColor;
            }
            else {
                context.strokeStyle = "drawnArray[i].color";
            }
            context.lineTo(drawnArray[i].x, drawnArray[i].y);
            context.stroke();
        }
    }
}
// Store Drawn Lines in DrawnArray
function storeDrawn(x, y, size, color, erase) {
    var line = {
        x: x,
        y: y,
        size: size,
        color: color,
        erase: erase,
    };
    drawnArray.push(line);
}
// Get Mouse Position
function getMousePosition(event) {
    var boundaries = canvas.getBoundingClientRect();
    return {
        x: event.clientX - boundaries.left,
        y: event.clientY - boundaries.top,
    };
}
// Mouse Down
canvas.addEventListener("mousedown", function (event) {
    isMouseDown = true;
    var currentPosition = getMousePosition(event);
    if (context !== null) {
        context.moveTo(currentPosition.x, currentPosition.y);
        context.beginPath();
        context.lineWidth = Number(currentSize);
        context.lineCap = "round";
        context.strokeStyle = currentColor;
    }
});
// Mouse Move
canvas.addEventListener("mousemove", function (event) {
    if (isMouseDown) {
        var currentPosition = getMousePosition(event);
        if (context !== null) {
            context.lineTo(currentPosition.x, currentPosition.y);
            context.stroke();
            storeDrawn(currentPosition.x, currentPosition.y, Number(currentSize), Number(currentColor), isEraser);
        }
        else {
            storeDrawn(undefined, undefined, undefined, undefined, undefined);
        }
    }
});
// Stop drawing when the mouse is released
canvas.addEventListener("mouseup", function () {
    isMouseDown = false;
});
// Save to Local Storage
saveStorageBtn.addEventListener("click", function () {
    localStorage.setItem("savedCanvas", JSON.stringify(drawnArray));
    // Active Tool
    activeToolEl.textContent = "Canvas Saved";
    brushSetTimeOut(BRUSH_TIME);
});
// Load from Local Storage
loadStorageBtn.addEventListener("click", function () {
    if (localStorage.getItem("savedCanvas")) {
        drawnArray = JSON.parse(localStorage.getItem("savedCanvas") || "");
        restoreCanvas();
        // Active Tool
        activeToolEl.textContent = "Canvas Loaded";
        brushSetTimeOut(BRUSH_TIME);
    }
    else {
        activeToolEl.textContent = "No Canvas Found ";
    }
});
// Clear Local Storage
clearStorageBtn.addEventListener("click", function () {
    localStorage.removeItem("savedCanvas");
    // Active Tool
    activeToolEl.textContent = "Local Storage Cleared";
    brushSetTimeOut(BRUSH_TIME);
});
// Download Image
downloadBtn.addEventListener("click", function () {
    var saveAsImage;
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
