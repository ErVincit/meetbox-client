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
          fullDayEvents: [],
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

  const minDate = new Date(date.getFullYear(), date.getMonth(), min);
  const maxDate = new Date(date.getFullYear(), date.getMonth(), max);

  return (
    minDate.getDate() +
    " " +
    this.getMonthName(minDate.getMonth()) +
    " - " +
    maxDate.getDate() +
    " " +
    this.getMonthName(maxDate.getMonth())
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
    (date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth()) +
    "-" +
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate())
  );
};

exports.dateToTimeType = date => {
  let h = date.getHours();
  let m = date.getMinutes();
  return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
};

exports.checkSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

exports.checkFullDayEvent = (d1, d2) => {
  return (
    d1.getHours() == 0 &&
    d1.getMinutes() == 0 &&
    d2.getHours() == 23 &&
    d2.getMinutes() == 59
  );
};

exports.interpolateCalendarEvents = (calendar, events) => {
  for (var i = 0; i < events.length; i++) {
    let event = events[i];
    let tempDate = new Date(event.timestampBegin);
    if (event.timestampEnd) {
      let tempEndDate = new Date(event.timestampEnd);
      event.timestampBegin = tempDate;
      event.timestampEnd = tempEndDate;
      event.hasNext = false;
      event.hasPrevious = false;
      // Verify what kind of event is this
      if (this.checkSameDay(tempDate, tempEndDate)) {
        // fullDayEvents
        if (this.checkFullDayEvent(tempDate, tempEndDate)) {
          calendar[tempDate.getFullYear()][tempDate.getMonth()][
            tempDate.getDate()
          ].fullDayEvents.push(event);
        }
        // Others events who start&finish on same day
        else {
          calendar[tempDate.getFullYear()][tempDate.getMonth()][
            tempDate.getDate()
          ].events.push(event);
        }
      }
      // Events to separate
      else {
        const dateBegin = new Date(tempDate);
        const dateEnd = new Date(tempEndDate);
        const dateChecker = new Date(dateEnd);
        dateChecker.setDate(dateChecker.getDate() + 1);
        while (!this.checkSameDay(dateBegin, dateChecker)) {
          // Se primo evento
          const eventChunk = {
            id: event.id,
            workgroup: event.workgroup,
            members: event.members,
            timestampBegin: new Date(dateBegin),
            timestampEnd: new Date(dateEnd),
            title: event.title,
            description: event.description,
            hasNext: false,
            hasPrevious: false,
            originalBegin: event.timestampBegin,
            originalEnd: event.timestampEnd
          };
          if (this.checkSameDay(dateBegin, tempDate)) {
            eventChunk.timestampEnd = new Date(dateBegin);
            eventChunk.timestampEnd.setHours(23, 59);
            eventChunk.hasNext = true;
            calendar[dateBegin.getFullYear()][dateBegin.getMonth()][
              dateBegin.getDate()
            ].events.push(eventChunk);
            dateBegin.setDate(dateBegin.getDate() + 1);
          }
          //Se ultima parte dell'evento
          else if (this.checkSameDay(dateBegin, dateEnd)) {
            eventChunk.timestampBegin = new Date(dateEnd);
            eventChunk.timestampBegin.setHours(0, 0);
            eventChunk.timestampEnd = dateEnd;
            eventChunk.hasPrevious = true;
            calendar[dateBegin.getFullYear()][dateBegin.getMonth()][
              dateBegin.getDate()
            ].events.push(eventChunk);
            dateBegin.setDate(dateBegin.getDate() + 1);
          }
          //Se parte centrale
          else {
            eventChunk.timestampEnd = new Date(dateBegin);
            eventChunk.timestampEnd.setHours(23, 59);
            eventChunk.timestampBegin = new Date(dateBegin);
            eventChunk.timestampBegin.setHours(0, 0);
            eventChunk.hasNext = true;
            eventChunk.hasPrevious = true;
            calendar[dateBegin.getFullYear()][dateBegin.getMonth()][
              dateBegin.getDate()
            ].events.push(eventChunk);
            dateBegin.setDate(dateBegin.getDate() + 1);
          }
        }
      }
      // Order list for fixing the moovement
      calendar[tempDate.getFullYear()][tempDate.getMonth()][
        tempDate.getDate()
      ].events.sort((a, b) => (a.id > b.id ? 1 : -1));
    }
  }
  return calendar;
};

exports.verifyAloneEvent = event => {
  return !(event.hasNext || event.hasPrevious);
};

exports.searchEvent = (events, event) => {
  for (let i = 0; i < events.length; i++) {
    let localEvent = events[i];
    if (localEvent.id == event.id) return i;
  }
  return -1;
};

exports.handleDeletePrevious = (calendar, event) => {
  var tempEvent = event;
  var tempDate = new Date(event.timestampBegin);
  while (tempEvent.hasPrevious) {
    tempDate.setDate(tempDate.getDate() - 1);
    const events =
      calendar[tempDate.getFullYear()][tempDate.getMonth()][tempDate.getDate()]
        .events;
    const index = this.searchEvent(events, tempEvent);
    if (index != -1) {
      tempEvent =
        calendar[tempDate.getFullYear()][tempDate.getMonth()][
          tempDate.getDate()
        ].events[index];
      // Eliminare evento dalla lista di eventi
      calendar[tempDate.getFullYear()][tempDate.getMonth()][
        tempDate.getDate()
      ].events.splice(index, 1);
      // Il ciclo dovrebbe poi finire se hasPrevious è false
    } else {
      console.log(
        "ERRORE: L'elemento che si vuole cancellare non è presente nella lista di eventi di appartenenza. Settaggio errato di qualche booleano hasPrevious"
      );
      break;
    }
  }
  return calendar;
};

exports.handleDeleteNext = (calendar, event) => {
  var tempEvent = event;
  var tempDate = new Date(event.timestampBegin);
  while (tempEvent.hasNext) {
    tempDate.setDate(tempDate.getDate() + 1);
    const events =
      calendar[tempDate.getFullYear()][tempDate.getMonth()][tempDate.getDate()]
        .events;
    const index = this.searchEvent(events, tempEvent);
    if (index != -1) {
      tempEvent =
        calendar[tempDate.getFullYear()][tempDate.getMonth()][
          tempDate.getDate()
        ].events[index];
      // Eliminare evento dalla lista di eventi
      calendar[tempDate.getFullYear()][tempDate.getMonth()][
        tempDate.getDate()
      ].events.splice(index, 1);
      // Il ciclo dovrebbe poi finire se hasPrevious è false
    } else {
      console.log(
        "ERRORE: L'elemento che si vuole cancellare non è presente nella lista di eventi di appartenenza. Settaggio errato di qualche booleano hasNext"
      );
      break;
    }
  }
  return calendar;
};

exports.deleteEvent = (calendar, event) => {
  if (event.hasPrevious) calendar = this.handleDeletePrevious(calendar, event);
  if (event.hasNext) calendar = this.handleDeleteNext(calendar, event);

  var date = new Date(event.timestampBegin);
  const events =
    calendar[date.getFullYear()][date.getMonth()][date.getDate()].events;
  const index = this.searchEvent(events, event);
  if (index != -1) {
    calendar[date.getFullYear()][date.getMonth()][date.getDate()].events.splice(
      index,
      1
    );
  } else {
    console.log(
      "ERRORE: L'elemento che si vuole cancellare non è presente nella lista di eventi di appartenenza"
    );
  }
  return calendar;
};
