<template>
  <div
    class="calendar__row container-fluid row position-relative w-100 flex-grow-1"
  >
    <WeeksDay :nameDay="nameDay" :day="day" />
    <RowEventsContainer
      :events="dataprops"
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
  props: ["dataprops", "nameDay", "day", "fullDayEvents"],
  components: { WeeksDay, RowEventsContainer },
  methods: {
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
