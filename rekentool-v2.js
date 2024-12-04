const days = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag"];

const data = {
  voorschoolse: {
    subtitle: "Ma, t/m Vr - 06:30 t/m 08:30",
    options: [
      {
        tarief: 9.50,
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
        tarief: 9.50,
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
        tarief: 9.50,
        title: "BSO zonder vakantieopvang",
        uren: [23.33, 23.33, 30, 23.33, 23.33],
      },

      {
        tarief: 13.00,
        title: "Alleen vakantieopvang",
        uren: [12, 12, 12, 12, 12],
      },
    ],
  },
  dag: {
    subtitle: "Ma, t/m  Vr - 06:30 t/m 18:30",
    options: [
      {
        tarief: 10.70,
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
  activeStep:1,
  selectedService: null,
  selectedTariff: null,
  selectedDays:[],
  totalCalculation:null, 
};

const serviceKeys = Object.keys(data);

// const serviceNamesModified = serviceNames.map((item, index) => {
//   if (index === serviceNames.length - 1) {
//     return item + "opvang";
//   }
//   return item + " opvang";
// });



const serviceOptionsContainer = document.querySelector("#service-options ul");

function formateServiceName(key, isLast){
  return isLast? `${key}opvang`: `${key} opvang`;
}

// ------ populating step one ----- //

serviceKeys.forEach((key, index)=>{

  const isLast = index === serviceKeys.length -1;
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

  li.addEventListener("click",()=>{
    document.querySelectorAll(".service-item").forEach((el)=>{
      el.classList.remove("selected");
    });
    li.classList.add("selected");
    state.selectedService= key;
    console.log("selected service: ", state.selectedService);
  });
});


