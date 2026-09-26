document.addEventListener("DOMContentLoaded", function () {
  // Toggle tampilkan/sembunyikan password
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.getElementById("toggleIcon");

  togglePassword.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    toggleIcon.textContent =
      type === "password" ? "visibility" : "visibility_off";
  });

  // Proses login
  const loginForm = document.getElementById("login-form");
  const pesanError = document.getElementById("pesan-error");

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    pesanError.textContent = "";
    pesanError.classList.add("hidden");

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      pesanError.textContent = "Login gagal: " + error.message;
      pesanError.classList.remove("hidden");
      return;
    }

    window.location.href = "app.html";
  });
});
