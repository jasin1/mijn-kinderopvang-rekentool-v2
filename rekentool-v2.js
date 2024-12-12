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

function updateState(key, value) {
  if (state[key] !== value) {
    state[key] = value;
  }
}

function formateServiceName(key, isLast) {
  return isLast ? `${key}opvang` : `${key} opvang`;
}

// ------ Step population logic ----- //

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
    default:
      console.error("Unknown step!");
  }
  updateButtonStates();
}

function validateStep(step) {
  const validations = {
    1: () => state.selectedService !== null,
    2: () => state.selectedTariff !== null,
    3: () => state.selectedDays.length > 0,
  };

  return validations[step] ? validations[step]() : true;
}

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
    span.textContent = subtitle;

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
      // updateState("selectedHours", data[key].uren);
      updateButtonStates();

      console.log("selected service: ", state.selectedService);
      console.log("Selected days:", state.selectedDays);
    });
  });
}

populateServiceStep();

function populateTariffStep() {
  console.log("Entering Step 2: Selected Tariff", state.selectedTariff);
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
    tariffValue.textContent = `Tarief: €${option.tarief} per uur`;

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
      }

      console.log("Selected tariff:", state.selectedTariff);
      // console.log("Selected title:", state.selectedTitle);
      // console.log("selected days", state.selectedDays);
      // console.log("selected hours", state.selectedHours);
    });
  });
  updateButtonStates();
}

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
      updateButtonStates();

      console.log("selected days: ", state.selectedDays);
    });
  });
}

// ------ navigating steps ----- //

const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const steps = document.querySelectorAll(".step");

function updateStepDisplay() {
  steps.forEach((step, index) => {
    step.classList.remove("active");

    if (index + 1 === state.currentStep) {
      step.classList.add("active");
    }
  });
}

function updateButtonStates() {
  // Handle "Previous" button
  prev.disabled = state.currentStep === 1;

  // Handle "Next" button
  const isValid = validateStep(state.currentStep);
  next.disabled = !isValid; // Disable if the current step is invalid
}

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
  console.log("current step", state.currentStep);

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
  }
});
