<template>
  <div
    class="calendar__row container-fluid row position-relative w-100 flex-grow-1"
  >
    <WeeksDay :nameDay="nameDay" :day="day" />
    <RowEventsContainer
      :events="dataprops"
      @showDailyEvents="handleShowDailyEvents"
      @showEvent="handleShowEvent"
      @alert="handleAlert"
    />
  </div>
</template>

<script>
import RowEventsContainer from "@/components/calendar/RowEventsContainer";
import WeeksDay from "@/components/calendar/WeeksDay";

export default {
  name: "CalendarRow",
  props: ["dataprops", "nameDay", "day", "fullDayEvents", "timestamp"],
  components: { WeeksDay, RowEventsContainer },
  methods: {
    handleShowDailyEvents() {
      var temp = 0;
      if (this.timestamp.getDay() - 1 >= 0)
        temp = (this.timestamp.getDay() - 1) % 7;
      else temp = 7 - 1;
      this.$emit("showDailyEvents", temp);
    },
    handleAlert(message) {
      this.$emit("alert", message);
    },
    handleShowEvent(event) {
      this.$emit("showEvent", event);
    }
  }
};
</script>

<style scoped>
.calendar__row {
  border-bottom: 1px solid var(--grid-border);
  overflow: hidden;
  min-height: 80px;
  padding: 0;
  margin: 0;
}
</style>
