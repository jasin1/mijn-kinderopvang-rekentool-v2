document.addEventListener("DOMContentLoaded", () => {
  updateButtonStates();
});

const days = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag"];

const data = {
  voorschoolse: {
    subtitle: "Ma, t/m Vr - 06:30 t/m 08:30",
    options: [
      {
        tarief: 9.5,
        title: "VSO zonder vakantie opvang",
        uren: [6.67, 6.67, 6.67, 6.67, 6.67],
      },

      {
        tarief: 9.25,
        title: "VSO geheel opvang met vakantieopvang",
        uren: [18.67, 18.67, 18.67, 18.67, 18.67],
      },
    ],
  },
  naschoolse: {
    subtitle: "Ma, Di, Do, Vr - 13:30 t/m 18:30 Woe - 11:30 t/m 18:30",
    options: [
      {
        tarief: 9.5,
        title: "NSO zonder vakantie opvang",
        uren: [16.67, 16.67, 23.33, 16.67, 16.67],
      },

      {
        tarief: 9.25,
        title: "NSO geheel opvang met vakantieopvang",
        uren: [28.67, 28.67, 35.33, 28.67, 28.67],
      },
    ],
  },
  buitenschoolse: {
    subtitle:
      "Ma, Di, Do, Vr - 06:30 t/m 08:30 Ma, Di, Do, Vr - 13:30 t/m 18:30 Woe - 11:30 t/m 18:30",
    options: [
      {
        tarief: 9.25,
        title: "BSO met vakantieopvang",
        uren: [35.33, 35.33, 42, 35.33, 35.33],
      },

      {
        tarief: 9.5,
        title: "BSO zonder vakantieopvang",
        uren: [23.33, 23.33, 30, 23.33, 23.33],
      },

      {
        tarief: 13.0,
        title: "Alleen vakantieopvang",
        uren: [12, 12, 12, 12, 12],
      },
    ],
  },
  dag: {
    subtitle: "Ma, t/m  Vr - 06:30 t/m 18:30",
    options: [
      {
        tarief: 10.7,
        title: "KDV halve dagopvang (6 uur p/d)",
        uren: [26, 26, 26, 26, 26],
      },

      {
        tarief: 10.45,
        title: "KDV hele dagopvang (12 uur p/d)",
        uren: [52, 52, 52, 52, 52],
      },
    ],
  },
};

const state = {
  currentStep: 1,
  selectedService: null,
  selectedTariff: null,
  selectedTitle: null,
  selectedHours: [],
  selectedDays: [],
  totalCalculation: null,
};

// ----- Global Query selectors ------ //

// -- Steps and buttons
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
// const steps = document.querySelectorAll(".step");
const steps = [
  document.querySelector("#step-1"),
  document.querySelector("#step-2"),
  document.querySelector("#step-3"),
  document.querySelector("#step-4"),
];

// -- Progress bar
const progressBar = document.querySelector(".progress-bar");
const stepText = document.querySelectorAll(".step-show-txt");

// -- Summary
const chosenService = document.getElementById("chosen-service");
const chosenTariff = document.getElementById("chosen-tariff");
const chosenDays = document.getElementById("chosen-days");
const totalHours = document.getElementById("total-hours");
const totalCost = document.getElementById("total-cost");
const notification = document.getElementById("notification");
const backBtn = document.getElementById("back-btn");

// ---- form hidden inputs
const formService = document.getElementById("form-service");
const formTariff = document.getElementById("form-tariff");
const formDays = document.getElementById("form-days");
const formHours = document.getElementById("form-hours");
const formTotal = document.getElementById("form-total");

//----- helper functions ------------- //

function updateState(key, value) {
  if (state[key] !== value) {
    state[key] = value;
  }
}

function populateStep(step) {
  switch (step) {
    case 1:
      populateServiceStep();
      break;
    case 2:
      populateTariffStep();
      break;
    case 3:
      populateDaysStep();
      break;
    case 4: // Show summary
      toggleContainers(false); // Switch to summary container
      break;
    default:
      console.error("Unknown step!");
  }
  updateButtonStates();
  updateProgressBar();
  updateStepDisplay(); // Ensure correct visibility for steps in first container
}

function validateStep(step) {
  const validations = {
    1: () => {
      // console.log("Validating step 1: selectedService = ", state.selectedService);
      return (
        state.selectedService !== null && state.selectedService !== undefined
      );
    },
    2: () => {
      // console.log("Validating step 2: selectedService = ", state.selectedService, " selectedTariff = ", state.selectedTariff, "selected title", state.selectedTitle);
      return (
        state.selectedService !== null &&
        state.selectedTariff !== null &&
        state.selectedTariff !== undefined
      );
    },
    3: () => {
      // console.log("Validating step 3: selectedDays = ", state.selectedDays);
      return state.selectedDays.length > 0;
    },
  };

  return validations[step] ? validations[step]() : false;
}

function formatStep2Txt(title, tariff) {
  const firstThreeLetters = title.slice(0, 3);
  return `${firstThreeLetters} - tarief €${tariff}`;
}

function formatSubtitle(subtitle) {
  const timePattern = /(\d{2}:\d{2} t\/m \d{2}:\d{2})/g;
  return subtitle.replace(timePattern, "$1<br>");
}

function updateProgressBar() {
  const stepIndicators = document.querySelectorAll(".step-indicator");

  stepIndicators.forEach((indicator, index) => {
    const stepNumber = index + 1; // Steps are 1-based

    // Reset content and classes
    indicator.setAttribute("data-step", stepNumber); // For debugging or :before usage
    indicator.textContent = stepNumber; // Default to step number

    // Determine the state of the step
    if (stepNumber < state.currentStep) {
      // Validate the step to decide its state
      if (validateStep(stepNumber)) {
        indicator.classList.add("completed"); // Mark as completed
        indicator.textContent = ""; // Clear number to show SVG
      } else {
        // If revisited, reset to active state
        indicator.classList.remove("completed");
        indicator.classList.add("active");
      }
    } else if (stepNumber === state.currentStep) {
      // Current step is active
      indicator.classList.add("active");
      indicator.classList.remove("completed");
    } else {
      // Future steps remain neutral
      indicator.classList.remove("active", "completed");
    }
  });
}

function updateButtonStates() {
  console.log("Validating step: ", state.currentStep);
  prev.disabled = state.currentStep === 1;
  const isValid = validateStep(state.currentStep);
  console.log(`step ${state.currentStep} valid`, isValid);
  next.disabled = !isValid;
}

function formateServiceName(key, isLast) {
  return isLast ? `${key}opvang` : `${key} opvang`;
}

function updateStepDisplay() {
  steps.forEach((step, index) => {
    // Remove active class from all steps
    step.classList.remove("active");

    // Add active class to the current step
    if (index + 1 === state.currentStep) {
      step.classList.add("active");
    }
  });

  // Handle visibility of the summary container
  if (state.currentStep === steps.length) {
    toggleContainers(false); // Show summary
  } else {
    toggleContainers(true); // Show first container
  }
}


function calculation(a, b) {
  notification.textContent = "";
  const korting = a * 230;
  if (b > 230) {
    notification.textContent = `
    * U krijgt een halve dag gratis van ons bij dit gekozen opvang pakket. Normaliter 260 uur maar u ontvangt 30 uur korting dat betekend wat u moet doorgeven aan de belastingdienst is; 230 X €${state.selectedTariff} = €${korting} per maand voor 5 hele dagen!
    `;
    return `€ ${(a * 230).toFixed(2)}`;
  } else {
    return `€ ${(a * b).toFixed(2)}`;
  }
}

function formatTariff(tariff) {
  if (tariff % 1 !== 0) {
    const parts = tariff.toString().split(".");
    if (parts[1].length === 1) {
      return `${tariff}0`;
    }
  }
  return tariff.toString();
}

const isLastStep = state.currentStep === steps.length;

function toggleContainers(showFirst) {
  console.log(`toggleContainers called with showFirst: ${showFirst}`);
  const firstContainer = document.querySelector(".container:not(#step-4)");
  const summaryContainer = document.querySelector("#step-4");

  if (showFirst) {
    firstContainer.classList.remove("hidden");
    summaryContainer.classList.add("hidden");
  } else {
    firstContainer.classList.add("hidden");
    summaryContainer.classList.remove("hidden");
  }
}

updateProgressBar();

// ------ populating step one ----- //
function populateServiceStep() {
  const serviceOptionsContainer = document.querySelector("#service-options ul");
  serviceOptionsContainer.innerHTML = "";

  const serviceKeys = Object.keys(data);
  serviceKeys.forEach((key, index) => {
    const isLast = index === serviceKeys.length - 1;
    const formattedName = formateServiceName(key, isLast);
    const subtitle = data[key].subtitle;

    // Create the elements dynamically
    const li = document.createElement("li");
    li.classList.add("service-item");

    const circle = document.createElement("div");
    circle.classList.add("circle");

    const serviceDiv = document.createElement("div");
    serviceDiv.classList.add("service");

    const h3 = document.createElement("h3");
    h3.textContent = formattedName;

    const span = document.createElement("span");
    span.innerHTML = formatSubtitle(subtitle);

    // Append children
    serviceDiv.appendChild(h3);
    serviceDiv.appendChild(span);
    li.appendChild(circle);
    li.appendChild(serviceDiv);

    // Append the <li> to the container
    serviceOptionsContainer.appendChild(li);

    // Check if this service matches the selected one in state
    if (state.selectedService === key) {
      li.classList.add("selected"); // Reapply the "selected" class
    }

    li.addEventListener("click", () => {
      document.querySelectorAll(".service-item").forEach((el) => {
        el.classList.remove("selected");
      });
      li.classList.add("selected");

      if (state.selectedService !== key) {
        state.selectedDays = [];
      }

      updateState("selectedService", key);
      updateState("selectedTariff", data[key].tarief);
      updateState("selectedTitle", data[key].title);
      updateButtonStates();
      stepText[0].innerHTML = formattedName;
      // console.log("selected service: ", state.selectedService);
      // console.log("Selected days:", state.selectedDays);
    });
  });
}
populateServiceStep();

// ------ populating step two ----- //
function populateTariffStep() {
  // console.log("Entering Step 2: Selected Tariff", state.selectedTariff);
  const service = state.selectedService;
  const tariffs = data[service].options;

  const tariffOptionsContainer = document.querySelector("#tariff-options ul");
  tariffOptionsContainer.innerHTML = "";

  tariffs.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("selection-item");

    const circle = document.createElement("div");
    circle.classList.add("circle");

    const tariffDiv = document.createElement("div");
    tariffDiv.classList.add("tariff");

    const title = document.createElement("h3");
    title.textContent = option.title;

    const tariffValue = document.createElement("span");
    tariffValue.textContent = `Tarief: €${formatTariff(option.tarief)} per uur`;

    // Append children to build the structure
    tariffDiv.appendChild(title);
    tariffDiv.appendChild(tariffValue);
    li.appendChild(circle);
    li.appendChild(tariffDiv);

    // Append the list item to the container
    tariffOptionsContainer.appendChild(li);

    // Mark the currently selected tariff as selected (if it exists)
    if (state.selectedTariff === option.tarief) {
      li.classList.add("selected");
    }

    // Add click event to select this tariff
    li.addEventListener("click", () => {
      document.querySelectorAll(".selection-item").forEach((el) => {
        el.classList.remove("selected");
      });
      li.classList.add("selected");

      // Update state with the selected tariff and associated data
      if (state.selectedTariff !== option.tarief) {
        updateState("selectedTariff", option.tarief);
        updateState("selectedTitle", option.title);
        updateState("selectedHours", option.uren);
        updateButtonStates();
        state.selectedDays = [];
        chosenService.textContent = state.selectedTitle;
        chosenTariff.textContent = `€ ${formatTariff(state.selectedTariff)}`;
      }

      const formattedText = formatStep2Txt(
        option.title,
        formatTariff(option.tarief),
      );
      stepText[1].innerHTML = formattedText;
    });
  });
  updateButtonStates();
}

// ------ populating step three ----- //
function populateDaysStep() {
  // console.log("step 3");
  // const service = state.selectedService;
  const hours = state.selectedHours;
  const dayOptionContainer = document.querySelector("#day-options ul");
  dayOptionContainer.innerHTML = "";

  hours.forEach((hour, index) => {
    const li = document.createElement("li");
    li.classList.add("day-item");

    const circle = document.createElement("div");
    circle.classList.add("circle");

    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");

    const dayValue = document.createElement("span");
    const dayName = days[index];
    dayValue.textContent = dayName;
    dayValue.setAttribute("data-value", hour);

    dayDiv.appendChild(dayValue);
    li.appendChild(circle);
    li.appendChild(dayDiv);

    const isSelected = state.selectedDays.some((day) => day.name === dayName);
    if (isSelected) {
      li.classList.add("selected");
    }

    dayOptionContainer.appendChild(li);

    li.addEventListener("click", () => {
      const dayIndex = state.selectedDays.findIndex(
        (day) => day.name === dayName,
      );

      if (li.classList.contains("selected")) {
        li.classList.remove("selected");
        if (dayIndex !== -1) {
          state.selectedDays.splice(dayIndex, 1);
        }
      } else {
        li.classList.add("selected");
        state.selectedDays.push({ name: dayName, value: hour });
      }
      chosenDays.textContent = state.selectedDays
        .map((day) => day.name)
        .join(", ");
      const meHours = state.selectedDays
        .map((day) => day.value)
        .reduce((a, b) => a + b, 0)
        .toFixed(2);
      totalHours.textContent = meHours;
      totalCost.textContent = calculation(state.selectedTariff, meHours);
      //---update form hidden inputs
      formService.value = state.selectedTitle;
      formTariff.value = formatTariff(state.selectedTariff);
      formDays.value = state.selectedDays.map((day) => day.name).join(", ");
      formHours.value = meHours;
      formTotal.value = calculation(state.selectedTariff, meHours);

      // totalCost.textContent = (state.selectedTariff * meHours).toFixed(2);
      updateButtonStates();

      console.log("selected hours: ", meHours);
    });
  });
}

// ------ Event Listeners -------- //

prev.addEventListener("click", () => {
  console.log("previous");
  if (state.currentStep > 1) {
    state.currentStep -= 1;
    updateStepDisplay();
    updateButtonStates();
    populateStep(state.currentStep);
  }
});

next.addEventListener("click", () => {
  console.log("next btn clicked, current step: ", state.currentStep);

  if (!validateStep(state.currentStep)) {
    console.log(
      `Step ${state.currentStep} is not valid. Please make a selection.`,
    );
    return; // Prevent navigation
  }

  if (state.currentStep < steps.length) {
    state.currentStep += 1;
    updateStepDisplay();
    updateButtonStates();

    populateStep(state.currentStep);
  } else if (state.currentStep === steps.length) {
    console.log("last step");
    toggleContainers(false);
  }
  updateProgressBar();
});

backBtn.addEventListener("click", () => {
  state.currentStep = 3; // Go back to step 3
  toggleContainers(true); // Show the first container
  updateProgressBar(); // Update progress bar
  updateStepDisplay(); // Ensure step 3 is visible
});
