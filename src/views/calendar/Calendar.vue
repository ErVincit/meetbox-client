<template>
  <div class="activity container-fluid h-100 d-flex flex-column">
    <PageHeader />
    <div id="page-content" class="row flex-grow-1">
      <Recents currentPage="calendar" />
      <main class="main_column_calendar d-flex flex-column col-lg-9">
        <p class="m-0 title_page">Calendario</p>
        <hr class="mt-0 mb-2" />
        <div class="days_controller d-flex">
          <NeuButton @click="handlePrevious" class="calendar_button cb_left">
            <img src="../../assets/calendar-left.svg" />
          </NeuButton>
          <div class="calendar_identifier mr-4 ml-4">
            {{ calendarIdentifier }}
          </div>
          <NeuButton @click="handleNext" class="calendar_button cb_rigth">
            <img src="../../assets/calendar-right.svg" />
          </NeuButton>
        </div>
        <hr class="mt-0 mb-2" />
        <div class="time-header d-flex m-0 p-0">
          <div class="dayContainer h-100 m-0 p-2"></div>
          <div class="event-container d-flex h-100 m-0 p-0">
            <div class="pos-time h-100 w-25 d-flex justify-content-center">
              00:00
            </div>
            <div class="pos-time h-100 w-25 d-flex justify-content-center">
              06:00
            </div>
            <div class="pos-time h-100 w-25 d-flex justify-content-center">
              12:00
            </div>
            <div class="pos-time h-100 w-25 d-flex justify-content-center">
              18:00
            </div>
          </div>
          <div
            class="pos-time fullDayEvent h-100 m-0 p-0 d-flex justify-content-center"
          >
            23:59
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
          <div class="fullDayEvent h-100 m-0 p-0 ml"></div>
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
              <div class="fullDayEvent h-100 m-0 p-0"></div>
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
      <div
        class="col col-lg-1 d-none d-lg-block"
        style="background-color: grey"
      ></div>
    </div>

    <EventInspector
      v-if="showEventInspector"
      ref="event_inspector"
      :event="eventToShow"
      @hide="showEventInspector = false"
    />
  </div>
</template>

<script>
import PageHeader from "@/components/page-header/PageHeader";
import Recents from "@/components/recents/Recents";
import CalendarRow from "@/components/calendar/CalendarRow";
import NeuButton from "@/components/neu-button/NeuButton";
import EventInspector from "@/components/calendar/EventInspector";

import { mapGetters, mapActions } from "vuex";

import calendarUtils from "./calendar_utils";

const handleOutsideClick = function(event) {
  if (!this.showEventInspector) return;
  const eventInspector = this.$refs["event_inspector"].$vnode.elm;
  if (!eventInspector.contains(event.target)) this.showEventInspector = false;
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
  components: { PageHeader, Recents, CalendarRow, NeuButton, EventInspector },
  methods: {
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
      // console.log(event);
      this.showEventInspector = true;
      this.eventToShow = event;
    },
    ...mapActions(["initCalendar", "fetchEvents"])
  },
  computed: {
    ...mapGetters(["calendar"]),
    days: function() {
      const settimana = [];
      let today = this.currentDate;
      let todayDay = today.getDay();

      if (this.calendar) {
        const min = today.getDate() - todayDay + 1;
        const max = today.getDate() + 7 - todayDay;
        const maxMonthDays = new Date(
          today.getFullYear(),
          today.getMonth() + 1, // TODO: Il +1 sarà da levare quando ci sarà la data impostata come new Date(2020,5,4) -> 5 = Giugno, partono da zero
          0
        ).getDate();

        if (min > 0 && max <= maxMonthDays) {
          // console.log("LA SETTIMANA FA PARTE DELLO STESSO MESE");
          for (let i = min; i <= max; i++) {
            settimana.push(
              this.calendar[today.getFullYear()][today.getMonth()][i]
            );
          }
        } else if (min >= 0 && max > maxMonthDays) {
          // console.log("SFORA IN GRANDEZZA (29-30-31)");
          for (let i = min; i <= maxMonthDays; i++) {
            settimana.push(
              this.calendar[today.getFullYear()][today.getMonth()][i]
            );
          }
          let maxNextMonthDays = max - maxMonthDays;
          for (let i = 1; i <= maxNextMonthDays; i++) {
            settimana.push(
              this.calendar[today.getFullYear()][today.getMonth() + 1][i]
            );
          }
        } else {
          // console.log("SFORA IN PICCOLEZZA (Minore di 1)", min, max);
          const dd = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            min /*== 0 ? 1 : min*/
          ); //Poichè sottrazione equivale a 0
          for (let i = dd.getDate(); i <= maxMonthDays; i++) {
            settimana.push(
              this.calendar[today.getFullYear()][today.getMonth()][i]
            );
          }
          for (let i = 1; i <= max; i++) {
            settimana.push(
              this.calendar[today.getFullYear()][today.getMonth() + 1][i]
            );
          }
        }
      }
      // console.log("SETTIMANA:", settimana);
      //TODO: Scorrere calendario. A volte da errore
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
      currentDate: new Date("2020-6-25"),
      calendarIdentifier: null,
      showEventInspector: false,
      eventToShow: null
    };
  },
  mounted() {
    document.addEventListener("click", handleOutsideClick.bind(this));
  },
  destroyed() {
    document.removeEventListener("click", handleOutsideClick.bind(this));
  }
};
</script>

<style scoped>
/* .ciotto {
  display: flex;
  width: 100%;
  height: 12vh;
} */

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
