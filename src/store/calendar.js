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
  async fetchEvents({ commit }, { workgroupId }) {
    var tmpDate = new Date();
    const range = 10;
    const actualYear = tmpDate.getFullYear();
    const response = await fetch(
      `${
        process.env.VUE_APP_SERVER_ADDRESS
      }/api/workgroup/${workgroupId}/calendar/events?from=${actualYear -
        range}-01-01 00:00:00`,
      {
        method: "GET",
        credentials: "include"
      }
    );
    const json = await response.json();
    if (!json.error) {
      commit("setEvents", json.data);
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
    }
  },
  async editEvent({ commit }, { workgroupId, event, oldEvent }) {
    //Faccio richiesta
    oldEvent.timestampBegin = new Date(oldEvent.timestampBegin);
    oldEvent.timestampEnd = new Date(oldEvent.timestampEnd);

    if (event.hasNext || event.hasPrevious) {
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
      }
    }
  },
  async editEventShortcut({ commit }, { workgroupId, event, oldEvent }) {
    oldEvent.timestampBegin = new Date(oldEvent.timestampBegin);
    oldEvent.timestampEnd = new Date(oldEvent.timestampEnd);

    if (event.hasNext || event.hasPrevious) {
      event.timestampBegin = new Date(event.originalBegin);
      event.timestampEnd = new Date(event.originalEnd);
    }
    const newCompleteEvent = Object.assign({}, event);
    newCompleteEvent.description = oldEvent.description;
    newCompleteEvent.title = oldEvent.title;
    newCompleteEvent.owner = oldEvent.owner;
    newCompleteEvent.members = oldEvent.members;
    newCompleteEvent.workgroup = oldEvent.workgroup;

    commit("changeEvent", {
      event: newCompleteEvent,
      oldEvent
    });
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
    if (response.status == 200 && json.error) {
      commit("changeEvent", {
        event: oldEvent,
        oldEvent: newCompleteEvent
      });
    }
  },

  async removeEvent({ commit }, { workgroupId, event }) {
    const response = await fetch(
      `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/calendar/event/${event.id}`,
      {
        method: "DELETE",
        body: JSON.stringify(event),
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      }
    );
    const json = await response.json();
    if (response.ok) {
      if (!json.error) {
        commit("removeEvent", {
          event
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
    let calendar = calendarUtils.deleteEvent(state.calendar, oldEvent);
    //Aggiunge l'evento salvato nel server nello stato
    calendar = calendarUtils.interpolateCalendarEvents(calendar, [event]);
    state.calendar = Object.assign({}, calendar);
  },
  removeEvent: (state, { event }) => {
    //Rimuovere evento precedente nel calendario
    state.calendar = calendarUtils.deleteEvent(state.calendar, event);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
