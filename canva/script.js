const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let circles = [];
let selectedCircle = null;
let isDragging = false;

// DRAW ALL CIRCLES
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle === selectedCircle ? "red" : "blue";
    ctx.fill();
    ctx.closePath();
  });
}

// GET MOUSE POSITION
function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

// CHECK IF POINT IS INSIDE CIRCLE
function isInside(circle, x, y) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  return Math.sqrt(dx * dx + dy * dy) < circle.radius;
}

// CLICK EVENT (SELECT OR CREATE)
canvas.addEventListener("mousedown", function (event) {
  const pos = getMousePos(event);
  let found = false;

  // Check if clicking a circle
  circles.forEach(circle => {
    if (isInside(circle, pos.x, pos.y)) {
      selectedCircle = circle;
      isDragging = true;
      found = true;
    }
  });

  // If not clicking any circle → create new
  if (!found) {
    const newCircle = {
      x: pos.x,
      y: pos.y,
      radius: 20
    };
    circles.push(newCircle);
    selectedCircle = newCircle;
  }

  draw();
});

// DRAG MOVE
canvas.addEventListener("mousemove", function (event) {
  if (isDragging && selectedCircle) {
    const pos = getMousePos(event);
    selectedCircle.x = pos.x;
    selectedCircle.y = pos.y;
    draw();
  }
});

// STOP DRAG
canvas.addEventListener("mouseup", function () {
  isDragging = false;
});

// DELETE KEY
document.addEventListener("keydown", function (event) {
  if (event.key === "Delete" && selectedCircle) {
    circles = circles.filter(c => c !== selectedCircle);
    selectedCircle = null;
    draw();
  }
});

// RESIZE WITH SCROLL
canvas.addEventListener("wheel", function (event) {
  if (selectedCircle) {
    event.preventDefault();

    if (event.deltaY < 0) {
      selectedCircle.radius += 2;
    } else {
      selectedCircle.radius -= 2;
      if (selectedCircle.radius < 5) {
        selectedCircle.radius = 5;
      }
    }

    draw();
  }
});
