exports.createCalendar = () => {
  var tmpDate = new Date();
  const range = 10;
  const actualYear = tmpDate.getFullYear();
  const tempCalendar = {};
  for (var year = actualYear - range; year <= actualYear + range; year++) {
    tempCalendar[year] = {};
    for (var month = 0; month < 12; month++) {
      tempCalendar[year][month] = {};
      for (var day = 1; day <= this.daysInMonth(month, year); day++) {
        tempCalendar[year][month][day] = {
          events: [],
          nameDay: this.getNameDay(new Date(year, month, day)),
          day
        };
      }
    }
  }
  return tempCalendar;
};

exports.daysInMonth = (month, year) => {
  let d = new Date(year, month + 1, 0);
  return d.getDate();
};

exports.calendarWeeklyPosition = date => {
  let todayDay = date.getDay();

  const min = date.getDate() - todayDay + 1;
  const max = date.getDate() + 7 - todayDay;

  return (
    new Date(date.getFullYear(), date.getMonth(), min).getDate() +
    " " +
    this.getMonthName(date.getMonth()) +
    " - " +
    new Date(date.getFullYear(), date.getMonth(), max).getDate() +
    " " +
    this.getMonthName(date.getMonth())
  );
};

exports.getNameDay = date => {
  switch (date.toString().split(" ")[0]) {
    case "Mon":
      return "Lunedì";
    case "Tue":
      return "Martedì";
    case "Wed":
      return "Mercoledì";
    case "Thu":
      return "Giovedì";
    case "Fri":
      return "Venerdì";
    case "Sat":
      return "Sabato";
    case "Sun":
      return "Domenica";
  }
  return "Error";
};

exports.getMonthName = number => {
  const month = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre"
  ];
  return month[number];
};
