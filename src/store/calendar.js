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
    if (!json.error) {
      commit("setEvents", json.data);
    } else {
      console.log(json);
    }
  },
  async addEvent({ commit }, { workgroupId, event }) {
    const response = await fetch(
      `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/calendar/event`,
      {
        method: "POST",
        body: JSON.stringify(event),
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      }
    );
    const json = await response.json();
    if (!json.error) {
      json.data.timestampBegin = new Date(json.data.timestampBegin);
      json.data.timestampEnd = new Date(json.data.timestampEnd);
      commit("newEvent", json.data);
    } else {
      console.log(json);
    }
  },
  // eslint-disable-next-line no-unused-vars
  async editEvent({ commit }, { workgroupId, event, oldEvent }) {
    //Faccio richiesta
    oldEvent.timestampBegin = new Date(oldEvent.timestampBegin);
    oldEvent.timestampEnd = new Date(oldEvent.timestampEnd);

    //TODO: Passare intero giorno dell'evento
    if (event.hasNext || event.hasPrevious) {
      // console.log("Sto passando al server un giorno segmentato");
      event.timestampBegin = new Date(event.originalBegin);
      event.timestampEnd = new Date(event.originalEnd);
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
        commit("changeEvent", {
          event: json.data,
          oldEvent
        });
      } else {
        console.log("ERRORE:", json);
        commit("changeEvent", {
          event: oldEvent,
          oldEvent
        });
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
    //Aggiunge l'evento salvato nel server nello stato
    state.calendar = calendarUtils.interpolateCalendarEvents(state.calendar, [
      event
    ]);
  },
  changeEvent: (state, { event, oldEvent }) => {
    //Rimuovere evento precedente nel calendario
    state.calendar = calendarUtils.deleteEvent(state.calendar, oldEvent);
    //Aggiunge l'evento salvato nel server nello stato
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
