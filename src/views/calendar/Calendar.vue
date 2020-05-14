<template>
  <div class="activity container-fluid h-100 d-flex flex-column">
    <PageHeader />
    <div id="page-content" class="row flex-grow-1">
      <LeftNavBar />
      <main class="main_column_calendar d-flex flex-column col-lg-9">
        <p class="m-0 title_page">Calendario</p>
        <hr class="mt-0 mb-2" />
        <div
          class="days_controller d-flex position-relative text-align-center h-100"
        >
          <NeuButton @click="handlePrevious" class="calendar_button cb_left">
            <img src="../../assets/calendar-left.svg" />
          </NeuButton>
          <div class="calendar_identifier mr-4 ml-4">
            {{ calendarIdentifier }}
          </div>
          <NeuButton @click="handleNext" class="calendar_button cb_rigth">
            <img src="../../assets/calendar-right.svg" />
          </NeuButton>
          <div
            v-if="showFilteredUser || showMaxEventSize"
            class="filter h-100 flex-column justify-content-center position-absolute ml-2"
          >
            <div class="d-flex justify-content-center">
              <p class="filterName m-0">Filtri:</p>
            </div>
            <div v-if="showMaxEventSize" class="d-flex justify-content-center">
              <p class="m-0">{{ textMaxEvents }}</p>
            </div>
            <div v-if="showFilteredUser" class="d-flex justify-content-center">
              <p class="m-0">{{ textFilteredMembers }}</p>
            </div>
          </div>
        </div>
        <hr class="mt-0 mb-2" />
        <div class="time-header d-flex m-0 p-0">
          <div class="dayContainer h-100 m-0 p-2"></div>
          <div class="event-container d-flex h-100 m-0 p-0">
            <div class="pos-time h-100 w-25 d-flex justify-content-center pl-2">
              00:00
            </div>
            <div class="pos-time h-100 w-25 d-flex justify-content-center">
              06:00
            </div>
            <div class="pos-time h-100 w-25 d-flex justify-content-center">
              12:00
            </div>
            <div class="pos-time h-100 w-25 d-flex justify-content-center pr-2">
              18:00
            </div>
          </div>
        </div>
        <div class="space-header d-flex m-0 p-0">
          <div class="dayContainer h-100 m-0 p-2 ml"></div>
          <div class="event-container d-flex h-100 m-0 p-0">
            <div class="mr h-100 w-25"></div>
            <div class="mr h-100 w-25"></div>
            <div class="mr h-100 w-25"></div>
            <div class="h-100 w-25"></div>
          </div>
        </div>
        <div class="position-relative h-100 w-100 m-0 p-0">
          <div class="position-absolute h-100 w-100 p-0 m-0">
            <div
              class="background d-flex m-0 p-0"
              v-for="day in days"
              :key="day.day + 'back'"
            >
              <div class="dayContainer h-100 m-0 p-2"></div>
              <div class="event-container d-flex h-100 m-0 p-0">
                <div class="mr h-100 w-25"></div>
                <div class="mr h-100 w-25"></div>
                <div class="mr h-100 w-25"></div>
                <div class="h-100 w-25"></div>
              </div>
            </div>
          </div>
          <div class="h-100 w-100">
            <CalendarRow
              v-for="day in days"
              :key="day.day"
              :dataprops="day.events"
              :fullDayEvents="day.fullDayEvents"
              :nameDay="day.nameDay"
              :day="day.day"
              @showEvent="showEvent(...arguments)"
            >
            </CalendarRow>
          </div>
        </div>
      </main>
      <Actions>
        <NeuButton
          @click.stop="createEvent"
          class="d-flex justify-content-center align-items-center mt-3"
          style="width: 50px; height: 50px"
        >
          <img src="@/assets/addIcon.svg" v-tooltip:left="'Crea evento'" />
        </NeuButton>
        <div class="dropleft">
          <NeuButton
            class="d-flex justify-content-center align-items-center mt-3"
            style="width: 50px; height: 50px"
            @click.stop="handleShowEventFilter"
          >
            <img src="@/assets/filterIcon.svg" v-tooltip:left="'Filtra'" />
          </NeuButton>
        </div>
      </Actions>
    </div>

    <EventInspector
      v-if="showEventInspector"
      ref="event_inspector"
      :event="eventToShow"
      @hideEventInspector="showEventInspector = false"
      @deletedEvent="handleDeletedEvent"
    />

    <EventCreator
      v-if="showEventCreator"
      ref="event_creator"
      @hideEventCreator="showEventCreator = false"
    />

    <EventFilter
      ref="event_filter"
      :showEventFilter="showEventFilter"
      @newFilteredUsers="handleFilteredMember"
      @maxEventSize="handleMaxEventSize"
    />

    <div
      v-if="deletedEventMessage"
      class="fixed-bottom alert mt-3 alert-warning alert-dismissible fade show"
      role="alert"
    >
      L'evento "{{ eventToShow.title }}" &egrave; stato cancellato
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
        @click.stop="deletedEventMessage = false"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/page-header/PageHeader";
import CalendarRow from "@/components/calendar/CalendarRow";
import NeuButton from "@/components/neu-button/NeuButton";
import EventInspector from "@/components/calendar/EventInspector";
import EventCreator from "@/components/calendar/EventCreator";
import Actions from "@/components/actions/Actions";
import EventFilter from "@/components/calendar/EventFilter";
import LeftNavBar from "@/components/page-header/LeftNavBar";

import { mapGetters, mapActions } from "vuex";

import calendarUtils from "./calendar_utils";

const handleOutsideClick = function(event) {
  if (
    !this.showEventInspector &&
    !this.showEventCreator &&
    !this.showEventFilter
  )
    return;
  else if (this.showEventInspector) {
    const eventInspector = this.$refs["event_inspector"].$vnode.elm;
    if (!eventInspector.contains(event.target)) this.showEventInspector = false;
  } else if (this.showEventCreator) {
    const eventCreator = this.$refs["event_creator"].$vnode.elm;
    if (!eventCreator.contains(event.target)) this.showEventCreator = false;
  } else if (this.showEventFilter) {
    const eventFilter = this.$refs["event_filter"].$vnode.elm;
    if (!eventFilter.contains(event.target)) this.showEventFilter = false;
  }
};

export default {
  name: "Calendar",
  created() {
    this.initCalendar();
    this.fetchEvents();
    this.calendarIdentifier = calendarUtils.calendarWeeklyPosition(
      this.currentDate
    );
  },
  components: {
    PageHeader,
    CalendarRow,
    NeuButton,
    EventInspector,
    Actions,
    EventCreator,
    EventFilter,
    LeftNavBar
  },
  methods: {
    handleMaxEventSize(newSize) {
      switch (newSize) {
        case "24ore":
          this.showMaxEventSize = true;
          this.maxEventsSize = 86400000;
          break;
        case "48ore":
          this.showMaxEventSize = true;
          this.maxEventsSize = 172800000;
          break;
        case "72ore":
          this.showMaxEventSize = true;
          this.maxEventsSize = 259200000;
          break;
        case "1set":
          this.showMaxEventSize = true;
          this.maxEventsSize = 604800000;
          break;
        case "nessuno":
          this.showMaxEventSize = false;
          this.maxEventsSize = null;
          break;
      }
    },
    handleFilteredMember(membersFiltered) {
      this.filteredMembers = membersFiltered;
    },
    handleShowEventFilter() {
      if (this.showEventInspector) this.showEventInspector = false;
      if (this.showEventCreator) this.showEventCreator = false;
      this.showEventFilter = true;
    },
    createEvent() {
      if (this.showEventInspector) this.showEventInspector = false;
      if (this.showEventFilter) this.showEventFilter = false;
      this.showEventCreator = true;
    },
    handlePrevious() {
      if (this.weeklyView) {
        this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          this.currentDate.getDate() - 7
        );
        this.calendarIdentifier = calendarUtils.calendarWeeklyPosition(
          this.currentDate
        );
      }
    },
    handleNext() {
      if (this.weeklyView) {
        this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          this.currentDate.getDate() + 7
        );

        this.calendarIdentifier = calendarUtils.calendarWeeklyPosition(
          this.currentDate
        );
      }
    },
    showEvent(event) {
      this.showEventCreator = false;
      this.showEventInspector = true;
      this.eventToShow = event;
    },
    handleDeletedEvent() {
      this.showEventInspector = false;
      this.deletedEventMessage = true;
      setTimeout(() => {
        this.deletedEventMessage = false;
      }, 5000);
    },
    anormal() {
      if (this.maxEventsSize === "nessuno") this.showMaxEventSize = false;
      else this.showMaxEventSize = true;
    },
    analisys(e) {
      // console.log(e);
      if (e.originalBegin && e.originalEnd) {
        if (
          e.originalEnd.getTime() - e.originalBegin.getTime() <=
          this.maxEventsSize
        )
          return true;
        else return false;
      }
      if (
        e.timestampEnd.getTime() - e.timestampBegin.getTime() <=
        this.maxEventsSize
      )
        return true;
      else return false;
    },
    filterEventWithMembers(event) {
      if (this.filteredMembers.filter(m => m.id === event.owner).length > 0)
        return true;
      for (let i = 0; i < event.members.length; i++) {
        if (
          this.filteredMembers.filter(m => m.id === event.members[i].id)
            .length > 0
        )
          return true;
      }
      return false;
    },
    ...mapActions(["initCalendar", "fetchEvents"])
  },
  computed: {
    ...mapGetters(["calendar"]),
    textFilteredMembers: function() {
      if (this.filteredMembers.length === 0) return "";
      var text = "Mostro ";
      if (this.filteredMembers.length > 2) {
        for (let i = 0; i < 2; i++) {
          text += this.filteredMembers[i].firstname;
          if (i < 1) text += ", ";
        }
        if (this.filteredMembers.length >= 2) {
          const pos = this.filteredMembers.length - 2;
          text += " e altr" + (pos === 1 ? "o " : "i ") + pos;
        }
      } else {
        for (let i = 0; i < this.filteredMembers.length; i++) {
          text += this.filteredMembers[i].firstname;
          if (i < this.filteredMembers.length - 1) text += ", ";
        }
      }
      return text;
    },
    textMaxEvents: function() {
      switch (this.maxEventsSize) {
        case 86400000:
          return "Durata eventi: < 24 ore";
        case 172800000:
          return "Durata eventi: < 48 ore";
        case 259200000:
          return "Durata eventi: < 72 ore";
        case 604800000:
          return "Durata eventi: < 1 settimana";
      }
      return "Durata eventi: non selezionata";
    },
    days: function() {
      const settimana = [];
      let today = this.currentDate;
      let todayDay = today.getDay();

      if (this.calendar) {
        const min = today.getDate() - todayDay + 1;
        const max = today.getDate() + 7 - todayDay;
        const tempDate = new Date(today.getFullYear(), today.getMonth(), min);
        const maxDate = new Date(today.getFullYear(), today.getMonth(), max);
        // console.log(this.maxEventsSize);
        if (this.maxEventsSize && this.maxEventsSize !== null) {
          while (tempDate <= maxDate) {
            const events = this.calendar[tempDate.getFullYear()][
              tempDate.getMonth()
            ][tempDate.getDate()].events.filter(this.analisys);
            // console.log("Events:", events);
            const day = this.calendar[tempDate.getFullYear()][
              tempDate.getMonth()
            ][tempDate.getDate()];
            const obj = Object.assign({}, day);
            obj.events = events;
            settimana.push(obj);
            //Cambiare solo event con una filtered
            tempDate.setDate(tempDate.getDate() + 1);
          }
        } else {
          while (tempDate <= maxDate) {
            settimana.push(
              this.calendar[tempDate.getFullYear()][tempDate.getMonth()][
                tempDate.getDate()
              ]
            );
            //Cambiare solo event con una filtered
            tempDate.setDate(tempDate.getDate() + 1);
          }
        }
        if (this.filteredMembers.length > 0) {
          for (let i = 0; i < settimana.length; i++) {
            const myEvents = settimana[i].events;
            const filteredEvents = myEvents.filter(this.filterEventWithMembers);
            const obj = Object.assign({}, settimana[i]);
            obj.events = filteredEvents;
            settimana[i] = obj;
          }
        }
      }
      return settimana;
    },
    currentMonth: function() {
      return calendarUtils.getMonthName(new Date().getMonth());
    }
  },
  data() {
    return {
      rowSizeX: { type: Number, default: 0 },
      rowSizeY: { type: Number, default: 0 },
      defaultNoEnd: 60,
      isMonthView: false,
      weeklyView: true,
      currentDate: new Date(),
      calendarIdentifier: null,
      showEventInspector: false,
      eventToShow: null,
      showEventCreator: false,
      deletedEventMessage: false,
      showFilteredUser: false,
      filteredMembers: [],
      showMaxEventSize: false,
      maxEventsSize: null,
      showEventFilter: false
    };
  },
  mounted() {
    document.addEventListener("click", handleOutsideClick.bind(this));
  },
  destroyed() {
    document.removeEventListener("click", handleOutsideClick.bind(this));
  },
  watch: {
    filteredMembers: function() {
      if (this.filteredMembers.length === 0) this.showFilteredUser = false;
      else this.showFilteredUser = true;
    }
  }
};
</script>

<style scoped>
.filter {
  right: 0;
  width: 15%;
  font-size: 0.8rem;
}

.filterName {
  color: grey;
}
.days_controller {
  justify-content: center;
}

.calendar_identifier {
  min-width: 400px;
  width: 50%;
  text-align: center;
  color: #1c4885;
  font-size: 36px;
  font-weight: 600;
  margin: auto;
}

.dayContainer {
  width: 25%;
}

.calendar_button {
  width: 50px;
}

.add_event {
  width: 50px;
  right: 0;
  margin-right: 10px;
}

.title_page {
  color: #1c4885;
  font-size: 24px;
}

.background {
  height: calc(100% / 7);
  width: 100%;
  border-bottom: 1px solid rgb(194, 194, 194);
  overflow: hidden;

  padding: 0;
  margin: 0;
}

.fullDayEvent {
  width: 15%;
}

.event-container {
  width: 100%;
}

.mr {
  border-right: 1px solid rgb(194, 194, 194);
}

.bl {
  border-left: 1px solid rgb(194, 194, 194);
}

.time-header {
  height: 25px;
}
.space-header {
  height: 5px;
}

.pos-time {
  transform: translateX(-50%);
  font-size: 16px;
  color: #787878;
}
</style>
