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

exports.dateToString = date => {
  return (
    date.getDate() +
    " " +
    this.getMonthName(date.getMonth()) +
    " " +
    date.getFullYear()
  );
};

exports.handleEventCollision = events => {
  const list = [];
  for (var i = 0; i < events.length; i++) {
    if (list.length === 0) list.push([]);
    if (events[i].timestampEnd) {
      var superCollision = true;
      for (var j = 0; j < list.length; j++) {
        var collision = this.inCollision(list[j], events[i]);
        if (!collision) {
          list[j].push(events[i]);
          superCollision = false;
          break;
        }
      }
      //Se non si può mettere in nessuna delle row esistenti
      if (superCollision) {
        const newRow = [];
        newRow.push(events[i]);
        list.push(newRow);
      }
    }

    //TODO: Riordinare righe in base a larghezza
  }
  // var z = 0;
  // list.forEach(j => {
  //   z++;
  //   j.forEach(element => {
  //     console.log(
  //       z,
  //       element.id,
  //       "\n",
  //       element.timestampBegin,
  //       "\n",
  //       element.timestampEnd
  //     );
  //   });
  // });
  // console.log("Events rowEventsContainer:", events, superCollision);
  // console.log("List:", list);
  return list;
};

exports.inCollision = (list, event) => {
  var collision = false;
  for (let listElement = 0; listElement < list.length; listElement++) {
    // se contiene timestampEnd
    if (
      list[listElement].timestampEnd > event.timestampBegin &&
      list[listElement].timestampEnd < event.timestampEnd
    ) {
      collision = true;
      // console.log("CONDIZIONE 1", event.id);
      break;
    } else if (
      list[listElement].timestampEnd > event.timestampEnd &&
      list[listElement].timestampBegin < event.timestampEnd
    ) {
      collision = true;
      // console.log("CONDIZIONE 2", event.id);
      break;
    } else if (
      list[listElement].timestampBegin <= event.timestampBegin &&
      list[listElement].timestampEnd >= event.timestampEnd
    ) {
      collision = true;
      // console.log("CONDIZIONE 3", event.id);
      break;
    }
  }
  return collision;
};

exports.positionToHours = (x, rowSizeX) => {
  const solution = (24 * 60 * x) / rowSizeX;
  const hours = solution / 60;
  const minutes = solution % 60;
  // console.log(
  //   "Hours:",
  //   Number.parseInt(hours),
  //   "Minutes:",
  //   Number.parseInt(minutes)
  // );
  return { hours, minutes };
};

exports.endTimestampCalculator = (begin, newBegin, end) => {
  const diff = end.getTime() - begin.getTime();
  return new Date(newBegin.getTime() + diff);
};

exports.dateToDateType = date => {
  return (
    date.getFullYear() +
    "-" +
    (date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()) +
    "-" +
    date.getDate()
  );
};

exports.dateToTimeType = date => {
  let h = date.getHours();
  let m = date.getMinutes();
  return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
};
