import calendarUtils from "@/views/calendar/calendar_utils";

const state = {
  calendar: null
};

const getters = {
  calendar: state => state.calendar
};

const actions = {
  initCalendar: ({ commit }) =>
    commit("setCalendar", calendarUtils.createCalendar()),
  async fetchEvents({ commit }) {
    var tmpDate = new Date();
    const range = 10;
    const actualYear = tmpDate.getFullYear();
    const response = await fetch(
      `${
        process.env.VUE_APP_SERVER_ADDRESS
      }/api/workgroup/17/calendar/events?from=${actualYear -
        range}-01-01 00:00:00`,
      {
        method: "GET",
        credentials: "include"
      }
    );
    const json = await response.json();
    commit("setEvents", json.data);
  },
  async addEvent({ commit }, { workgroupId, event }) {
    const response = await fetch(
      `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/calendar/events`,
      {
        method: "POST",
        body: JSON.stringify(event),
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      }
    );
    const json = await response.json();
    commit("newEvent", json.data);
  },
  // eslint-disable-next-line no-unused-vars
  async editEvent({ commit }, { workgroupId, event, oldEvent }) {
    //Faccio richiesta

    //TODO: Passare intero giorno dell'evento
    if (event.hasNext || event.hasPrevious) {
      console.log("Sto passando al server un giorno segmentato");
      event.timestampBegin = event.originalBegin;
      event.timestampEnd = event.originalEnd;
    }
    const response = await fetch(
      `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/calendar/event/${event.id}`,
      {
        method: "PUT",
        body: JSON.stringify(event),
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      }
    );
    const json = await response.json();
    if (response.status == 200) {
      if (!json.error) {
        json.data.timestampBegin = new Date(json.data.timestampBegin);
        json.data.timestampEnd = new Date(json.data.timestampEnd);
        console.log("Ricevuto:", json.data);
        commit("changeEvent", {
          event: json.data,
          oldEvent
        });
      } else {
        console.log("ERRORE:", json);
      }
    }
  }
};
const mutations = {
  setEvents: (state, events) => {
    state.calendar = calendarUtils.interpolateCalendarEvents(
      state.calendar,
      events
    );
  },
  setCalendar: (state, calendar) => (state.calendar = calendar),
  newEvent: (state, event) => {
    // Aggiungi evento a calendario
    console.log(state, event);
  },
  changeEvent: (state, { event, oldEvent }) => {
    // const oldDateBegin = oldEvent.timestampBegin;
    // const oldDateEnd = oldEvent.timestampEnd;
    // console.log(oldDateBegin, oldDateEnd);
    // const newDate = new Date(event.timestampBegin);
    // const id = event.id;

    //Rimuovere evento precedente nel calendario
    console.log("OLD", oldEvent);
    state.calendar = calendarUtils.deleteEvent(state.calendar, oldEvent);
    // const events =
    //   state.calendar[oldDateBegin.getFullYear()][oldDateBegin.getMonth()][
    //     oldDateBegin.getDate()
    //   ].events;
    // for (let i = 0; i < events.length; i++)
    //   if (events[i].id == id) {
    //     state.calendar[oldDateBegin.getFullYear()][oldDateBegin.getMonth()][
    //       oldDateBegin.getDate()
    //     ].events.splice(i, 1);
    //   }

    //Aggiungere nuovo evento nel calendario
    // state.calendar[newDate.getFullYear()][newDate.getMonth()][
    //   newDate.getDate()
    // ].events.push(event);
    // state.calendar[newDate.getFullYear()][newDate.getMonth()][
    //   newDate.getDate()
    // ].events.sort((a, b) => (a.id > b.id ? 1 : -1));

    state.calendar = calendarUtils.interpolateCalendarEvents(state.calendar, [
      event
    ]);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
