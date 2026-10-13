// 1. Dark/Light Mode với LocalStorage
const themeToggleBtn = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  if (themeToggleBtn) themeToggleBtn.textContent = "Light";
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    themeToggleBtn.textContent = isDark ? "Light" : "Dark";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// 2. Đồng hồ UTC thời gian thực
function updateClock() {
  const clockElement = document.getElementById("utc-clock");
  if (!clockElement) return;

  const now = new Date();
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");

  clockElement.textContent = `UTC ${hours}:${minutes}:${seconds}`;
}

updateClock();
setInterval(updateClock, 1000);

// 3. Sao chép Fingerprint vào Clipboard
const copyBtn = document.getElementById("copy-btn");
const copyHint = copyBtn?.querySelector(".copy-hint");

if (copyBtn && copyHint) {
  copyBtn.addEventListener("click", async () => {
    const textToCopy = copyBtn.getAttribute("data-copy");

    try {
      await navigator.clipboard.writeText(textToCopy);
      const originalText = copyHint.textContent;
      copyHint.textContent = "Copied!";
      copyBtn.style.borderColor = "#10b981";

      setTimeout(() => {
        copyHint.textContent = originalText;
        copyBtn.style.borderColor = "";
      }, 1500);
    } catch (err) {
      console.error("Không thể copy:", err);
    }
  });
}
// ================= 3D FALLING ROSE PETALS =================
const canvas = document.getElementById("rose-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Khởi tạo các cánh hoa với độ sâu 3D (z-axis)
  const petalCount = 35;
  const petals = [];

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 0.8 + 0.2, // Tỷ lệ xa gần
      size: Math.random() * 8 + 6,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      oscillationSpeed: Math.random() * 0.02 + 0.01,
      oscillationAmp: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.3
    });
  }

  let scrollSpeedOffset = 0;
  window.addEventListener("scroll", () => {
    scrollSpeedOffset = window.scrollY * 0.002;
  });

  function drawPetal(x, y, size, angle, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.globalAlpha = opacity;

    // Gradient đỏ nhung cho cánh hoa
    const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, size);
    grad.addColorStop(0, "#be123c");
    grad.addColorStop(0.7, "#881337");
    grad.addColorStop(1, "#4c0519");

    ctx.fillStyle = grad;
    ctx.beginPath();
    // Vẽ hình dáng cánh hoa lượn cong
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(size / 2, -size / 2, size, -size / 4, size, size / 2);
    ctx.bezierCurveTo(size, size, 0, size * 1.3, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    petals.forEach((p) => {
      // Cánh hoa chao đảo và rơi xuống
      p.y += (p.z * 1.2) + scrollSpeedOffset;
      p.x += Math.sin(p.angle) * p.oscillationAmp;
      p.angle += p.rotationSpeed;

      // Khi rơi hết màn hình thì quay lại từ trên đỉnh
      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }

      drawPetal(p.x, p.y, p.size * p.z, p.angle, p.opacity * p.z);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

// ================= 3D TILT & SPOTLIGHT COMBINED =================
const interactiveCards = document.querySelectorAll(".bento-card");

interactiveCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Cập nhật vị trí spotlight
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);

    // Tính toán góc nghiêng (Tilt) dựa trên khoảng cách tới tâm thẻ
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7; // Góc nghiêng trục X tối đa 7 độ
    const rotateY = ((x - centerX) / centerX) * 7;  // Góc nghiêng trục Y tối đa 7 độ

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  });

  card.addEventListener("mouseleave", () => {
    // Trả thẻ về trạng thái cân bằng khi rời chuột
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  });
});

// ================= SCROLL REVEAL OBSERVER =================
const revealElements = document.querySelectorAll(".reveal-on-scroll");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // Chỉ chạy 1 lần khi cuộn tới
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  // Dự phòng cho trình duyệt cũ
  revealElements.forEach((el) => el.classList.add("is-visible"));
}

// ================= SMOOTH CYBER CURSOR ENGINE =================
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

if (cursorDot && cursorOutline && window.innerWidth > 768) {
  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Chấm nhỏ đi theo tức thì
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Vòng ngoài đuổi theo với độ trễ chuyển động (Lerp)
  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Bắt sự kiện hover để phóng to vòng trỏ
  const interactiveTargets = document.querySelectorAll("a, button, summary, .bento-card");
  interactiveTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => cursorOutline.classList.add("hovered"));
    target.addEventListener("mouseleave", () => cursorOutline.classList.remove("hovered"));
  });
}