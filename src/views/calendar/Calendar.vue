<template>
  <div class="activity container-fluid h-100 d-flex flex-column">
    <PageHeader @open-navbar="openNavBar = !openNavBar">
      <p class="m-0 title_page mx-2">Calendario</p>
    </PageHeader>
    <div
      id="page-content"
      class="row flex-grow-1"
      style="height: calc(100% - 100px)"
    >
      <LeftNavBar
        class="h-100"
        :open="openNavBar"
        @expand-change="compressed = !compressed"
      />
      <main class="main_column_calendar h-100 col d-flex flex-column">
        <p class="m-0 title_page d-none d-lg-block">
          Calendario {{ currentYear }}
        </p>
        <hr class="m-0" />
        <div
          class="calendar_container d-flex flex-column justify-content-center px-1 flex-grow-1 overflow-hidden"
        >
          <div
            class="days_controller d-flex px-2 justify-content-between align-items-center w-lg-50 mx-lg-auto my-2"
            style="height: 60px"
          >
            <NeuButton
              @click.stop="createEvent"
              class="mob"
              style="width: 50px; height: 50px; left: 0"
            >
              <img src="@/assets/addIcon.svg" v-tooltip:left="'Crea evento'" />
            </NeuButton>

            <NeuButton @click="handlePrevious" class="calendar_button">
              <img src="../../assets/calendar-left.svg" />
            </NeuButton>
            <div class="calendar_identifier m-0 mx-4 text-nowrap norm">
              {{ calendarIdentifier }}
            </div>
            <div class="calendar_identifier mob">
              <div>
                {{ compactName.split(" - ")[0] }}
              </div>
              <div>
                {{ compactName.split(" - ")[1] }}
              </div>
            </div>
            <NeuButton @click="handleNext" class="calendar_button">
              <img src="../../assets/calendar-right.svg" />
            </NeuButton>

            <NeuButton
              class="mob"
              style="width: 50px; height: 50px; right: 0"
              @click.stop="handleShowEventFilter"
            >
              <img src="@/assets/filterIcon.svg" v-tooltip:left="'Filtra'" />
            </NeuButton>
            <div
              v-if="showFilteredUser || showMaxEventSize"
              class="norm filter flex-column justify-content-center position-absolute ml-2"
            >
              <div class="d-flex justify-content-center">
                <p class="filterName m-0">Filtri:</p>
              </div>
              <div
                v-if="showMaxEventSize"
                class="d-flex justify-content-center"
              >
                <p class="m-0">{{ textMaxEvents }}</p>
              </div>
              <div
                v-if="showFilteredUser"
                class="d-flex justify-content-center"
              >
                <p class="m-0">{{ textFilteredMembers }}</p>
              </div>
            </div>
          </div>
          <hr class="mt-0 mb-2" />
          <div class="time-header d-flex m-0 p-0">
            <div class="dayContainer h-100 col-1 m-0 p-2"></div>
            <div
              class="event-container d-flex h-100 m-0 p-0 justify-content-between flex-grow-1"
            >
              <div
                class="pos-time first h-100 d-flex justify-content-center time_container"
              >
                <span class="mob">0h</span>
                <span class="norm">00:00</span>
              </div>
              <div
                class="pos-time h-100 d-flex justify-content-center time_container"
              >
                <span class="mob">3h</span>
                <span class="norm">03:00</span>
              </div>
              <div
                class="pos-time h-100 d-flex justify-content-center time_container"
              >
                <span class="mob">6h</span>
                <span class="norm">06:00</span>
              </div>
              <div
                class="pos-time h-100 d-flex justify-content-center time_container"
              >
                <span class="mob">9h</span>
                <span class="norm">09:00</span>
              </div>
              <div
                class="pos-time h-100 d-flex justify-content-center time_container"
              >
                <span class="mob">12h</span>
                <span class="norm">12:00</span>
              </div>
              <div
                class="pos-time h-100 d-flex justify-content-center time_container"
              >
                <span class="mob">15h</span>
                <span class="norm">15:00</span>
              </div>
              <div
                class="pos-time h-100 d-flex justify-content-center time_container"
              >
                <span class="mob">18h</span>
                <span class="norm">18:00</span>
              </div>
              <div
                class="pos-time h-100 d-flex justify-content-center time_container"
              >
                <span class="mob">21h</span>
                <span class="norm">21:00</span>
              </div>
              <div
                class="pos-time last d-flex justify-content-center time_container"
              >
                <span class="mob">24h</span>
                <span class="norm">23:59</span>
              </div>
            </div>
          </div>
          <div class="space-header d-flex m-0 p-0">
            <div
              class="day_container d-flex flex-column m-0 p-2 h-100 col-1"
            ></div>
            <div
              class="event-container d-flex h-100 m-0 p-0 justify-content-between flex-grow-1"
            >
              <div class="h-100"></div>
              <div class="h-100"></div>
              <div class="h-100"></div>
              <div class="h-100"></div>
              <div class="h-100"></div>
              <div class="h-100"></div>
              <div class="h-100"></div>
              <div class="h-100"></div>
              <div class="h-100"></div>
            </div>
          </div>
          <div
            class="position-relative overflow-auto w-100 m-0 p-0 flex-grow-1 mb-2"
          >
            <Loading
              :show="loading"
              style="position: absolute; left: 50%; top: 50%; z-index: 1000; transform: translate(-50%, -50%)"
            />
            <div
              class="position-absolute h-100 w-100 p-0 m-0 d-flex flex-column"
            >
              <div
                class="background d-flex m-0 p-0 flex-grow-1"
                v-for="day in days"
                :key="day.day + 'back'"
              >
                <div
                  class="day_container d-flex flex-column m-0 p-2 h-100 col-1"
                ></div>
                <div
                  class="event-container d-flex h-100 m-0 p-0 justify-content-between flex-grow-1"
                >
                  <div class="mr h-100 "></div>
                  <div class="mr h-100 "></div>
                  <div class="mr h-100 "></div>
                  <div class="mr h-100 "></div>
                  <div class="mr h-100 "></div>
                  <div class="mr h-100 "></div>
                  <div class="mr h-100 "></div>
                  <div class="mr h-100 "></div>
                  <div class="mr h-100 "></div>
                </div>
              </div>
            </div>
            <div class="w-100 h-100 d-flex flex-column">
              <CalendarRow
                v-for="day in days"
                :key="day.day"
                :dataprops="day.events"
                :fullDayEvents="day.fullDayEvents"
                :nameDay="day.nameDay"
                :day="day.day"
                :timestamp="day.timestamp"
                :changed="compressed"
                @showDailyEvents="handleShowDailyEvents"
                @showEvent="handleShowEventInspector(...arguments)"
                @alert="handleAlert"
              >
              </CalendarRow>
            </div>
          </div>
        </div>

        <DailyEvents
          ref="daily_events"
          v-if="showDailyEvents"
          :day="day"
          @showEvent="handleShowEventInspector(...arguments)"
          @hideDailyEvents="hideDailyEvents"
          @deletedEvent="handleDeletedEvent"
        />
      </main>
      <Actions class="h-100">
        <NeuButton
          @click.stop="createEvent"
          class="d-flex justify-content-center align-items-center mt-3"
          style="width: 50px; height: 50px"
          v-tooltip:left="'Crea evento'"
        >
          <img src="@/assets/addIcon.svg" />
        </NeuButton>

        <NeuButton
          class="d-flex justify-content-center align-items-center mt-3"
          style="width: 50px; height: 50px"
          @click.stop="handleShowEventFilter"
          v-tooltip:left="'Filtra'"
        >
          <img src="@/assets/filterIcon.svg" />
        </NeuButton>
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
      @hideEventFilter="showEventFilter = false"
      @newFilteredUsers="handleFilteredMember"
      @maxEventSize="handleMaxEventSize"
    />

    <Alert
      :type="alertType"
      :message="alertMessage"
      v-if="alertShowed"
      @close="alertShowed = false"
    />
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
import Loading from "@/components/loading/Loading";
import Alert from "@/components/alert/Alert";
import DailyEvents from "@/components/calendar/DailyEvents";

import { mapGetters, mapActions } from "vuex";

import calendarUtils from "./calendar_utils";

const handleOutsideClick = function(event) {
  if (
    !this.showEventInspector &&
    !this.showEventCreator &&
    !this.showEventFilter &&
    !this.showDailyEvents
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
  } else if (this.showDailyEvents) {
    const dailyEvent = this.$refs["daily_events"].$vnode.elm;
    if (!dailyEvent.contains(event.target)) this.showDailyEvents = false;
  }
};

export default {
  name: "Calendar",
  created() {
    const { workgroupId } = this.$route.params;
    this.initCalendar();
    this.loading = true;
    this.fetchEvents({ workgroupId }).then(() => (this.loading = false));
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
    LeftNavBar,
    Loading,
    Alert,
    DailyEvents
  },
  methods: {
    hideDailyEvents() {
      this.showDailyEvents = false;
      this.fromDailyEvents = false;
    },
    handleShowDailyEvents(weekDay) {
      this.weekDay = weekDay;
      if (this.showEventInspector) this.showEventInspector = false;
      if (this.showEventCreator) this.showEventCreator = false;
      if (this.showEventFilter) this.showEventFilter = false;
      this.showDailyEvents = true;
    },
    handleAlert(message) {
      this.showAlert("warning", message);
    },
    showAlert(type, message) {
      this.alertType = type;
      this.alertMessage = message;
      this.alertShowed = true;
    },
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
      if (this.showDailyEvents) this.showDailyEvents = false;
      this.showEventFilter = true;
    },
    createEvent() {
      if (this.showEventInspector) this.showEventInspector = false;
      if (this.showEventFilter) this.showEventFilter = false;
      if (this.showDailyEvents) this.showDailyEvents = false;
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
    handleShowEventInspector(event) {
      this.showEventCreator = false;
      this.showEventFilter = false;
      this.showDailyEvents = false;
      this.showEventInspector = true;
      this.eventToShow = event;
    },
    handleDeletedEvent() {
      this.showEventInspector = false;
      this.showEventFilter = false;
      this.showEventCreator = false;
      this.showAlert("success", "Evento cancellato con successo");
      setTimeout(() => (this.alertShowed = false), 5000);
    },
    anormal() {
      if (this.maxEventsSize === "nessuno") this.showMaxEventSize = false;
      else this.showMaxEventSize = true;
    },
    analisys(e) {
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
    currentYear() {
      return this.currentDate.getFullYear();
    },
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
          text += " +" + pos;
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
      if (this.calendar) {
        const { minDate, maxDate } = calendarUtils.getMinMaxDate(
          this.currentDate
        );
        const tempDate = minDate;
        if (this.maxEventsSize && this.maxEventsSize !== null) {
          while (tempDate <= maxDate) {
            const events = this.calendar[tempDate.getFullYear()][
              tempDate.getMonth()
            ][tempDate.getDate()].events.filter(this.analisys);
            const day = this.calendar[tempDate.getFullYear()][
              tempDate.getMonth()
            ][tempDate.getDate()];
            const obj = Object.assign({}, day);
            obj.events = events;
            settimana.push(obj);
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
    },
    compactName() {
      return calendarUtils.compactWeeklyPosition(this.currentDate);
    },
    day() {
      const obj = Object.assign({}, this.days[this.weekDay]);
      obj.events = Array.from(obj.events);
      obj.events.sort((a, b) => (a.timestampBegin > b.timestampBegin ? 1 : -1));
      return obj;
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
      showEventFilter: false,
      openNavBar: false,
      loading: false,
      alertType: "",
      alertShowed: false,
      alertMessage: "",
      weekDay: 0,
      showDailyEvents: false,
      compressed: localStorage.getItem("navbar-compressed")
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
  color: var(--text-color-bg);
}

.filterName {
  color: var(--primary);
}

.calendar_identifier {
  min-width: 500px;
  text-align: center;
  color: var(--primary);
  font-size: 2rem;
  font-weight: 600;
}

.norm {
  display: block;
}
.mob {
  display: none;
}
@media screen and (max-width: 991px) {
  .calendar_identifier {
    text-align: center;
    color: var(--primary);
    font-size: 1.2rem;
    font-weight: 600;
    width: auto;
    min-width: auto;
    margin: 0;
  }
  .calendar_button {
    position: relative;
  }
  .calendar_container {
    padding: 0;
  }
  .calendar_container,
  .main_column_calendar {
    padding: 0;
  }
  .norm {
    display: none;
  }
  .mob {
    display: block;
  }
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
  color: var(--primary);
  font-size: 2rem;
}

.background {
  width: 100%;
  border-bottom: 1px solid var(--grid-border);
  overflow: hidden;
  min-height: 80px;
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
  border-right: 1px solid var(--grid-border);
}

.bl {
  border-left: 1px solid var(--grid-border);
}

.time-header {
  height: 25px;
}
.space-header {
  height: 5px;
}

.pos-time {
  font-size: 16px;
  color: var(--text-color-bg);
}
</style>
