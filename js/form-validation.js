(function () {
  const forms = document.querySelectorAll("[data-lead-form]");
  if (!forms.length) return;

  const phonePattern = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  const zipPattern = /^\d{5}(?:-\d{4})?$/;

  const showError = (field, message) => {
    field.classList.add("invalid");
    const errorTarget = field
      .closest(".form-row")
      ?.querySelector("[data-error]");
    if (errorTarget) errorTarget.textContent = message;
  };

  const clearError = (field) => {
    field.classList.remove("invalid");
    const errorTarget = field
      .closest(".form-row")
      ?.querySelector("[data-error]");
    if (errorTarget) errorTarget.textContent = "";
  };

  const validateField = (field) => {
    const value = field.value.trim();
    const name = field.name;

    if (field.hasAttribute("required") && !value) {
      showError(field, "This field is required.");
      return false;
    }

    if (!value) {
      clearError(field);
      return true;
    }

    if (name === "fullName" && value.length < 2) {
      showError(field, "Please enter your full name.");
      return false;
    }

    if (name === "phoneNumber" && !phonePattern.test(value)) {
      showError(field, "Enter a valid U.S. phone number.");
      return false;
    }

    if (name === "zipCode" && !zipPattern.test(value)) {
      showError(field, "Enter a valid ZIP Code.");
      return false;
    }

    clearError(field);
    return true;
  };

  forms.forEach((form) => {
    const fields = form.querySelectorAll("input, select, textarea");
    const successMessage = form.querySelector("[data-form-success]");

    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.classList.contains("invalid")) validateField(field);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let isValid = true;

      fields.forEach((field) => {
        if (!validateField(field)) isValid = false;
      });

      if (!isValid) return;

      if (successMessage) {
        successMessage.classList.add("is-visible");
        successMessage.textContent =
          "Thanks. Your request was received. A local matching specialist will follow up shortly.";
      }

      form.reset();
    });
  });
})();
