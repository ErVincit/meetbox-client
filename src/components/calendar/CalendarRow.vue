<template>
  <div
    class="calendar__row container-fluid row position-relative w-100 flex-grow-1"
  >
    <WeeksDay :nameDay="nameDay" :day="day" />
    <RowEventsContainer
      :events="dataprops"
      :changed="changed"
      @showDailyEvents="handleShowDailyEvents"
      @showEvent="handleShowEvent"
      @alert="handleAlert"
    />
  </div>
</template>

<script>
import RowEventsContainer from "@/components/calendar/RowEventsContainer";
import WeeksDay from "@/components/calendar/WeeksDay";

import calendarUtils from "@/views/calendar/calendar_utils";

export default {
  name: "CalendarRow",
  props: [
    "dataprops",
    "nameDay",
    "day",
    "fullDayEvents",
    "timestamp",
    "changed"
  ],
  components: { WeeksDay, RowEventsContainer },
  methods: {
    handleShowDailyEvents() {
      this.$emit(
        "showDailyEvents",
        calendarUtils.getEuropeanPosition(this.timestamp)
      );
    },
    handleAlert(message) {
      this.$emit("alert", message);
    },
    handleShowEvent(event) {
      this.$emit("showEvent", event);
    }
  },
  watch: {
    changed(value) {
      this.changed = value;
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
