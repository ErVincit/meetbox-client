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
  changeEvent: (state, { event, oldDate }) => {
    const newDate = new Date(event.timestampBegin);
    const id = event.id;
    // let added = false;
    //Rimuovere evento precedente nel calendario
    const events =
      state.calendar[oldDate.getFullYear()][oldDate.getMonth()][
        oldDate.getDate()
      ].events;
    for (let i = 0; i < events.length; i++)
      if (events[i].id == id) {
        // let eventListDate = events[i].timestampBegin;
        // if (
        //   eventListDate.getFullYear() !== oldDate.getFullYear() ||
        //   eventListDate.getMonth() !== oldDate.getMonth() ||
        //   eventListDate.getDate() !== oldDate.getDate()
        // ) {
        state.calendar[oldDate.getFullYear()][oldDate.getMonth()][
          oldDate.getDate()
        ].events.splice(i, 1);
        // } else {
        //   state.calendar[oldDate.getFullYear()][oldDate.getMonth()][
        //     oldDate.getDate()
        //   ].events.splice(i, 0, event);
        //   added = true;
        // }
      }
    //Aggiungere nuovo evento nel calendario
    // if (!added)
    state.calendar[newDate.getFullYear()][newDate.getMonth()][
      newDate.getDate()
    ].events.push(event);
    state.calendar[newDate.getFullYear()][newDate.getMonth()][
      newDate.getDate()
    ].events.sort((a, b) => (a.id > b.id ? 1 : -1));
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
