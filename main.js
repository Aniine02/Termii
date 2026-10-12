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