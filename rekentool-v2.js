const days = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag"];

const data = {
  voorschoolse: [
    {
      tarief: "9.50",
      descrp: "VSO zonder vakantie opvang",
      uren: [6.67, 6.67, 6.67, 6.67, 6.67],
    },

    {
      tarief: "9.25",
      descrp: "VSO geheel opvang met vakantieopvang",
      uren: [18.67, 18.67, 18.67, 18.67, 18.67],
    },
  ],
  naschoolse:[
    {
      tarief: "9.50",
      descrp: "NSO zonder vakantie opvang",
      uren: [16.67, 16.67, 23.33, 16.67, 16.67],
    },

    {
      tarief: "9.25",
      descrp: "NSO geheel opvang met vakantieopvang",
      uren: [28.67, 28.67, 35.33, 28.67, 28.67],
    },
  ],
  buitenschoolse:[
    {
      tarief: "9.25",
      descrp: "BSO met vakantieopvang",
      uren: [35.33, 35.33, 42, 35.33, 35.33],
    },

    {
      tarief: "9.50",
      descrp: "BSO zonder vakantieopvang",
      uren: [23.33, 23.33, 30, 23.33, 23.33],
    },

    {
      tarief: "13.00",
      descrp: "Alleen vakantieopvang",
      uren: [12, 12, 12, 12, 12],
    },
  ],

  dag:[
    {
      tarief: "10.70",
      descrp: "KDV halve dagopvang (6 uur p/d)",
      uren: [26, 26, 26, 26, 26],
    },

    {
      tarief: "10.45",
      descrp: "KDV hele dagopvang (12 uur p/d)",
      uren: [52, 52, 52, 52, 52],
    },
  ],
};
