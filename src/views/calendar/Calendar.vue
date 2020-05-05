<template>
  <div class="activity container-fluid h-100 d-flex flex-column">
    <PageHeader />
    <div id="page-content" class="row flex-grow-1">
      <Recents currentPage="calendar" />
      <main class="main_column_calendar col col-lg-9">
        <p class="m-0">Attività</p>
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
        <CalendarRow
          class="ciotto"
          v-for="day in days"
          :key="day.day"
          :dataprops="day.events"
          :rowSizeX="rowSizeX"
          :nameDay="day.nameDay"
          :day="day.day"
        >
        </CalendarRow>
      </main>
      <div
        class="col col-lg-1 d-none d-lg-block"
        style="background-color: red"
      ></div>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/page-header/PageHeader";
import Recents from "@/components/recents/Recents";
import CalendarRow from "./CalendarRow";
import NeuButton from "@/components/neu-button/NeuButton";

import calendarUtils from "./calendar_utils";

export default {
  name: "Calendar",
  created() {
    if (!this.calendar) {
      var tmpDate = new Date();
      const range = 10;
      const actualYear = tmpDate.getFullYear();
      const tempCalendar = calendarUtils.createCalendar();
      fetch(
        `${
          process.env.VUE_APP_SERVER_ADDRESS
        }/api/workgroup/17/calendar/events?from=${actualYear -
          range}-01-01 00:00:00`,
        {
          method: "GET",
          credentials: "include"
        }
      ).then(async value => {
        const message = await value.json();
        for (var i = 0; i < message.data.length; i++) {
          let event = message.data[i];
          let tempDate = new Date(event.timestampBegin);
          tempCalendar[tempDate.getFullYear()][tempDate.getMonth()][
            tempDate.getDate()
          ].events.push(event);
          if (event.timestampBegin)
            event.timestampBegin = new Date(event.timestampBegin);
          if (event.timestampEnd)
            event.timestampEnd = new Date(event.timestampEnd);
        }
        this.calendar = tempCalendar;
        this.calendarIdentifier = calendarUtils.calendarWeeklyPosition(
          this.currentDate
        );
        console.log("Eventi caricati");
      });
    }
  },
  components: { PageHeader, Recents, CalendarRow, NeuButton },
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
    }
  },
  computed: {
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
      calendar: null,
      weeklyView: true,
      currentDate: new Date("2020-6-25"),
      calendarIdentifier: null
    };
  }
};
</script>

<style scoped>
.ciotto {
  display: flex;
  width: 100%;
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

.calendar_button {
  width: 50px;
}
</style>
