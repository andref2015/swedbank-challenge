(function () {
  "use strict";

  // ─── State ───────────────────────────────────────────
  const state = {
    currentStep: 0, // 0 = intro, 1-4 = wizard steps, 5 = summary, 6 = confirmation
  };

  const screens = [
    "intro",
    "step-1",
    "step-2",
    "step-3",
    "step-4",
    "summary",
    "confirmation",
  ];

  // ─── DOM refs ────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const progressEl = $("#progress");
  const progressFill = $(".progress__fill");
  const progressSteps = $$(".progress__step");

  const loanAmountInput = $("#loan-amount");
  const loanAmountDisplay = $("#loan-amount-display");
  const loanPeriodSelect = $("#loan-period");
  const interestRateSelect = $("#interest-rate");
  const monthlyPaymentDisplay = $("#monthly-payment");
  const charCount = $("#char-count");
  const additionalInfo = $("#additional-info");

  // ─── Navigation ──────────────────────────────────────
  function showScreen(index) {
    screens.forEach((id, i) => {
      const el = document.getElementById(id);
      el.classList.toggle("active", i === index);
    });

    const inWizard = index >= 1 && index <= 4;
    progressEl.hidden = !inWizard;

    if (inWizard) {
      progressSteps.forEach((step, i) => {
        step.classList.toggle("active", i + 1 === index);
        step.classList.toggle("done", i + 1 < index);
      });
      progressFill.style.width = ((index - 1) / 3) * 100 + "%";
    }

    state.currentStep = index;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ─── Validation ──────────────────────────────────────
  function hideError(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  }

  function showError(id) {
    const el = document.getElementById(id);
    if (el) el.hidden = false;
  }

  function validateStep(step) {
    switch (step) {
      case 1: {
        const selected = document.querySelector(
          'input[name="employment"]:checked'
        );
        if (!selected) {
          showError("error-employment");
          return false;
        }
        hideError("error-employment");
        return true;
      }
      case 2: {
        const income = $("#income").value;
        if (!income) {
          showError("error-income");
          return false;
        }
        hideError("error-income");
        return true;
      }
      case 3: {
        const terms = $("#consent-terms").checked;
        if (!terms) {
          showError("error-consents");
          return false;
        }
        hideError("error-consents");
        return true;
      }
      case 4: {
        const text = additionalInfo.value.trim();
        if (text.length < 10) {
          showError("error-additional");
          return false;
        }
        hideError("error-additional");
        return true;
      }
      default:
        return true;
    }
  }

  // ─── Loan calculation ────────────────────────────────
  function updatePayment() {
    const principal = parseFloat(loanAmountInput.value);
    const rate = parseFloat(interestRateSelect.value);
    const months = parseInt(loanPeriodSelect.value, 10);

    loanAmountDisplay.textContent = formatEuro(principal);

    const payment = calculateMonthlyPayment(principal, rate, months);
    monthlyPaymentDisplay.textContent = payment > 0 ? formatEuro(payment) : "—";
  }

  function formatEuro(value) {
    return (
      value.toLocaleString("en", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + " €"
    );
  }

  // ─── Summary builder ────────────────────────────────
  function buildSummary() {
    const list = $("#summary-list");
    list.innerHTML = "";

    const employment =
      document.querySelector('input[name="employment"]:checked')?.value ?? "—";
    const income = $("#income").value || "—";
    const loanAmount = parseFloat(loanAmountInput.value);
    const period = loanPeriodSelect.value;
    const rate = interestRateSelect.value;
    const payment = calculateMonthlyPayment(
      loanAmount,
      parseFloat(rate),
      parseInt(period, 10)
    );

    const consents = [];
    if ($("#consent-terms").checked) consents.push("Terms and Conditions");
    if ($("#consent-data").checked) consents.push("Data Processing");
    if ($("#consent-marketing").checked) consents.push("Marketing Communications");

    const incomeLabels = {
      "<1000": "Less than 1 000 €",
      "1000-2000": "1 000 – 2 000 €",
      ">2000": "More than 2 000 €",
    };

    const employmentLabels = {
      employed: "Employed",
      "self-employed": "Self-employed",
      unemployed: "Unemployed",
    };

    const items = [
      ["Employment Status", employmentLabels[employment] || employment],
      ["Monthly Income", incomeLabels[income] || income],
      ["Loan Amount", formatEuro(loanAmount)],
      ["Loan Period", period + " months"],
      ["Interest Rate", rate + " %"],
      ["Monthly Payment", formatEuro(payment), true],
      ["Consents", consents.join(", ") || "None"],
      ["Additional Information", additionalInfo.value.trim()],
    ];

    items.forEach(([label, value, highlight]) => {
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = value;
      if (highlight) dd.classList.add("highlight");
      list.appendChild(dt);
      list.appendChild(dd);
    });
  }

  // ─── Event listeners ────────────────────────────────
  $("#btn-start").addEventListener("click", () => showScreen(1));
  $("#btn-restart").addEventListener("click", () => {
    document.querySelector("form")?.reset();
    $$("input[type=radio], input[type=checkbox]").forEach(
      (el) => (el.checked = false)
    );
    $("#income").value = "";
    loanAmountInput.value = 5000;
    loanPeriodSelect.value = "24";
    interestRateSelect.value = "5.5";
    additionalInfo.value = "";
    charCount.textContent = "0";
    updatePayment();
    showScreen(0);
  });

  $("#btn-submit").addEventListener("click", () => showScreen(6));

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-nav]");
    if (!btn) return;

    const dir = btn.dataset.nav;
    if (dir === "next") {
      if (validateStep(state.currentStep)) {
        if (state.currentStep === 4) {
          buildSummary();
        }
        showScreen(state.currentStep + 1);
      }
    } else if (dir === "back") {
      if (state.currentStep === 5) {
        showScreen(4);
      } else {
        showScreen(Math.max(0, state.currentStep - 1));
      }
    }
  });

  loanAmountInput.addEventListener("input", updatePayment);
  loanPeriodSelect.addEventListener("change", updatePayment);
  interestRateSelect.addEventListener("change", updatePayment);

  additionalInfo.addEventListener("input", () => {
    charCount.textContent = additionalInfo.value.trim().length;
  });

  // Clear errors on interaction
  $$('input[name="employment"]').forEach((el) =>
    el.addEventListener("change", () => hideError("error-employment"))
  );
  $("#income").addEventListener("change", () => hideError("error-income"));
  $("#consent-terms").addEventListener("change", () =>
    hideError("error-consents")
  );
  additionalInfo.addEventListener("input", () =>
    hideError("error-additional")
  );

  // ─── Init ────────────────────────────────────────────
  updatePayment();
})();
