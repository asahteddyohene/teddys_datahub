// ==========================================
// BUNDLE SELECTION
// ==========================================
function selectBundle(bundle, amount) {
  localStorage.setItem("bundle", bundle);
  localStorage.setItem("amount", amount);
  window.location.href = "checkout.html";
}

// ==========================================
// CHECKOUT FORM POPULATION & DARK MODE AUTO-DETECT
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const bundleInput = document.getElementById("bundle");
  const amountInput = document.getElementById("amountDisplay");
  if (bundleInput && amountInput) {
    const bundle = localStorage.getItem("bundle");
    const amount = localStorage.getItem("amount");

    bundleInput.value = bundle;
    amountInput.value = "GHS " + amount;
  }

  // Auto-detect system dark mode
  const darkToggle = document.getElementById("darkModeToggle");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (
    localStorage.getItem("darkMode") === "enabled" ||
    (!localStorage.getItem("darkMode") && systemPrefersDark)
  ) {
    document.body.classList.add("dark-mode");
    if (darkToggle) darkToggle.textContent = "☀️";
  } else {
    if (darkToggle) darkToggle.textContent = "🌙";
  }
});

// ==========================================
// PAYSTACK PAYMENT + SILENT FORM SUBMIT
// ==========================================
function payWithPaystack() {
  const form = document.getElementById("orderForm");
  if (!form) return;

  const email = form.querySelector('[name="Customer Email"]').value;
  const amount = localStorage.getItem("amount");
  const receivingNumber = form.querySelector('[name="Receiving Number"]').value;

  localStorage.setItem("receivingNumber", receivingNumber);

  let handler = PaystackPop.setup({
    key: "pk_test_4f20066c2edec6c7f6c84e0b31df9e3c7763c7cf", // Replace with your public key
    email: email,
    amount: amount * 100, // in Kobo
    currency: "GHS",
    channels: ["mobile_money"],

    callback: function () {
      // Submit form silently to FormSubmit.co
      const formData = new FormData(form);

      fetch("https://formsubmit.co/YOUR_EMAIL_HERE", {
        method: "POST",
        body: formData
      })
      .then(response => response.text()) // Use text() to avoid JSON parse errors
      .then(() => {
        // Redirect to success page
        window.location.href = "success.html";
      })
      .catch(err => {
        console.error("Silent form submission failed:", err);
        // Still redirect even if submission has minor issues
        window.location.href = "success.html";
      });
    },

    onClose: function () {
      alert("Payment window closed. Your order was not completed.");
    }
  });

  handler.openIframe();
}

// ==========================================
// DARK MODE TOGGLE
// ==========================================
const darkToggle = document.getElementById("darkModeToggle");
darkToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
    darkToggle.textContent = "☀️";
  } else {
    localStorage.setItem("darkMode", "disabled");
    darkToggle.textContent = "🌙";
  }
});
