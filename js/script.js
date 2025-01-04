const canvas = document.getElementById("chessboardCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const squareSize = 50;
let isDigitalizing = false;

function drawChessboard() {
  for (let y = 0; y < canvas.height; y += squareSize) {
    for (let x = 0; x < canvas.width; x += squareSize) {
      ctx.fillStyle = (x / squareSize + y / squareSize) % 2 === 0 ? "#000" : "#fff";
      ctx.fillRect(x, y, squareSize, squareSize);
    }
  }
}

function digitalizeEffect() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = data[i] * Math.random(); // Red
    data[i + 1] = data[i + 1] * Math.random(); // Green
    data[i + 2] = data[i + 2] * Math.random(); // Blue
  }

  ctx.putImageData(imageData, 0, 0);
}

function animate() {
  drawChessboard();

  if (isDigitalizing) {
    digitalizeEffect();
  }

  requestAnimationFrame(animate);
}

canvas.addEventListener("click", () => {
  isDigitalizing = true;

  setTimeout(() => {
    isDigitalizing = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 2000);
});

animate();
