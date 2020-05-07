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
  async editEvent({ commit }, { workgroupId, event, oldDate }) {
    //Faccio richiesta
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
      json.data.timestampBegin = new Date(json.data.timestampBegin);
      json.data.timestampEnd = new Date(json.data.timestampEnd);

      commit("changeEvent", {
        event: json.data,
        oldDate
      });
    }
  }
};
const mutations = {
  setEvents: (state, events) => {
    for (var i = 0; i < events.length; i++) {
      let event = events[i];
      let tempDate = new Date(event.timestampBegin);
      state.calendar[tempDate.getFullYear()][tempDate.getMonth()][
        tempDate.getDate()
      ].events.push(event);
      if (event.timestampBegin)
        event.timestampBegin = new Date(event.timestampBegin);
      if (event.timestampEnd) event.timestampEnd = new Date(event.timestampEnd);
    }
    console.log("Eventi caricati");
  },
  setCalendar: (state, calendar) => (state.calendar = calendar),
  newEvent: (state, event) => {
    // Aggiungi evento a calendario
    console.log(state, event);
  },
  changeEvent: (state, { event, oldDate }) => {
    const newDate = new Date(event.timestampBegin);
    const id = event.id;
    //Rimuovere evento precedente nel calendario
    const events =
      state.calendar[oldDate.getFullYear()][oldDate.getMonth()][
        oldDate.getDate()
      ].events;
    for (let i = 0; i < events.length; i++)
      if (events[i].id == id)
        state.calendar[oldDate.getFullYear()][oldDate.getMonth()][
          oldDate.getDate()
        ].events.splice(i, 1);
    //Aggiungere nuovo evento nel calendario
    state.calendar[newDate.getFullYear()][newDate.getMonth()][
      newDate.getDate()
    ].events.push(event);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
