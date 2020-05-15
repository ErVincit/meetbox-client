<template>
  <div
    class="calendar__row container-fluid row position-relative w-100 flex-grow-1"
  >
    <WeeksDay :nameDay="nameDay" :day="day" />
    <RowEventsContainer
      :events="dataprops"
      :rowSizeX="rowSizeX"
      @showEvent="handleShowEvent"
    />
  </div>
</template>

<script>
import RowEventsContainer from "@/components/calendar/RowEventsContainer";
import WeeksDay from "@/components/calendar/WeeksDay";

export default {
  name: "CalendarRow",
  props: ["dataprops", "rowSizeX", "nameDay", "day", "fullDayEvents"],
  components: { WeeksDay, RowEventsContainer },
  methods: {
    handleShowEvent(event) {
      this.$emit("showEvent", event);
    },
    handleMousedown(e) {
      console.log("Mousedown event:", e);
      if (this.hitted(e.x, e.y)) {
        console.log("Esiste un evento");
      }
    },
    handleClick(e) {
      console.log("Click event:", e);
    },
    handleMouseup(e) {
      console.log("Mouseup event:", e);
    }
  },
  updated() {},
  watch: {
    // dataprops: function(val) {
    //   console.log("updated dataprops in calendarRow", val);
    // }
  }
};
</script>

<style scoped>
.calendar__row {
  border-bottom: 1px solid grey;
  overflow: hidden;

  padding: 0;
  margin: 0;
}
</style>
