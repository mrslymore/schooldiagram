
const canvas = document.getElementById("floorCanvas");
const ctx = canvas.getContext("2d");

let rooms = [];
let selectedRoom = null;
let dragging = false;
let offsetX, offsetY;

// Room structure
function createRoom(x, y, width = 120, height = 80, number = "101", teacher = "Ms. Smith") {
  return { x, y, width, height, number, teacher };
}

// Add room
function addRoom() {
  const room = createRoom(50, 50);
  rooms.push(room);
  draw();
}

// Draw all rooms
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  rooms.forEach(room => {
    ctx.fillStyle = "#90caf9";
    ctx.fillRect(room.x, room.y, room.width, room.height);
    ctx.strokeStyle = "#0d47a1";
    ctx.strokeRect(room.x, room.y, room.width, room.height);
    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.fillText(`Room ${room.number}`, room.x + 10, room.y + 20);
    ctx.fillText(`${room.teacher}`, room.x + 10, room.y + 40);
  });
}

// Find room by mouse position
function getRoomAt(x, y) {
  return rooms.find(r =>
    x > r.x && x < r.x + r.width &&
    y > r.y && y < r.y + r.height
  );
}

// Mouse events
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  selectedRoom = getRoomAt(mouseX, mouseY);
  if (selectedRoom) {
    offsetX = mouseX - selectedRoom.x;
    offsetY = mouseY - selectedRoom.y;
    dragging = true;
  }
});

canvas.addEventListener("mouseup", () => {
  dragging = false;
});

canvas.addEventListener("mousemove", (e) => {
  if (dragging && selectedRoom) {
    const rect = canvas.getBoundingClientRect();
    selectedRoom.x = e.clientX - rect.left - offsetX;
    selectedRoom.y = e.clientY - rect.top - offsetY;
    draw();
  }
});

canvas.addEventListener("dblclick", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const room = getRoomAt(mouseX, mouseY);
  if (room) {
    const newNumber = prompt("Edit Room Number:", room.number);
    const newTeacher = prompt("Edit Teacher Name:", room.teacher);
    if (newNumber) room.number = newNumber;
    if (newTeacher) room.teacher = newTeacher;
    draw();
  }
});

// Export JSON
function exportLayout() {
  const dataStr = JSON.stringify(rooms, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "floorplan.json";
  a.click();
}

// Import JSON
function importLayout() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      rooms = JSON.parse(e.target.result);
      draw();
    } catch {
      alert("Invalid JSON format.");
    }
  };
  reader.readAsText(file);
}

// Initial draw
draw();
