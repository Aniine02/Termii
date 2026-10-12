const themeToggleBtn = document.getElementById("theme-toggle");

// 1. Kiểm tra xem lần trước người dùng đã chọn theme gì trong bộ nhớ máy
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggleBtn.textContent = "Light";
}

// 2. Lắng nghe sự kiện bấm nút
themeToggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark = document.body.classList.contains("dark-mode");
  themeToggleBtn.textContent = isDark ? "Light" : "Dark";

  // Lưu trạng thái hiện tại vào localStorage
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Tính năng sao chép vào Clipboard
const copyBtn = document.getElementById("copy-btn");
const copyHint = copyBtn?.querySelector(".copy-hint");

if (copyBtn && copyHint) {
  copyBtn.addEventListener("click", async () => {
    const textToCopy = copyBtn.getAttribute("data-copy");

    try {
      // Gọi API clipboard hiện đại của trình duyệt
      await navigator.clipboard.writeText(textToCopy);

      // Đổi trạng thái hiển thị thông báo
      const originalText = copyHint.textContent;
      copyHint.textContent = "Copied!";
      copyBtn.style.borderColor = "#10b981";

      // Sau 1.5 giây trả về trạng thái ban đầu
      setTimeout(() => {
        copyHint.textContent = originalText;
        copyBtn.style.borderColor = "";
      }, 1500);
    } catch (err) {
      console.error("Không thể copy:", err);
    }
  });
}