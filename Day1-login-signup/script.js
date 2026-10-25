
const form = document.getElementById("form");
const heading = document.getElementById("heading");
const nameBox = document.getElementById("nameBox");
const confirmBox = document.getElementById("confirmBox");
const submitBtn = document.getElementById("submitBtn");
const switchBtn = document.getElementById("switchBtn");
const switchText = document.getElementById("switchText");

let isSignup = false;

// Switch between Login and Signup
switchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  isSignup = !isSignup;

  heading.textContent = isSignup ? "Signup" : "Login";
  submitBtn.textContent = isSignup ? "Signup" : "Login";

  nameBox.classList.toggle("hidden", !isSignup);
  confirmBox.classList.toggle("hidden", !isSignup);

  switchText.firstChild.textContent =
    isSignup ? "Already have an account? " : "Don't have an account? ";

  switchBtn.textContent = isSignup ? "Login" : "Sign up";
  form.reset();
  clearErrors();
});

// Show validation errors
function showError(input, message) {
  input.parentElement.querySelector("small").textContent = message;
}

function clearErrors() {
  document.querySelectorAll("small").forEach(el => el.textContent = "");
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  clearErrors();

  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirm = document.getElementById("confirm");
  const name = document.getElementById("name");

  let valid = true;

  // Email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    showError(email, "Enter a valid email address");
    valid = false;
  }

  // Signup validations
  if (isSignup) {
    if (name.value.trim() === "") {
      showError(name, "Name is required");
      valid = false;
    }

    if (
      password.value.length < 8 ||
      !/[0-9]/.test(password.value) ||
      !/[^A-Za-z0-9]/.test(password.value)
    ) {
      showError(password, "Use 8+ characters, a number and a special character");
      valid = false;
    }

    if (confirm.value !== password.value) {
      showError(confirm, "Passwords do not match");
      valid = false;
    }
  } else if (password.value.trim() === "") {
    showError(password, "Password is required");
    valid = false;
  }

  if (valid) {
    alert(isSignup ? "Signup form validated!" : "Login form validated!");
    form.reset();
  }
});
