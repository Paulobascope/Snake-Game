const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 14;
const columns = canvas.width / fontSize;

const drops = Array.from({ length: columns }).fill(1);

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff00";
  ctx.font = fontSize + "px monospace";

  drops.forEach((y, index) => {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    const x = index * fontSize;
    ctx.fillText(text, x, y * fontSize);

    drops[index] = y * fontSize > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
  });
}

setInterval(drawMatrix, 33);
