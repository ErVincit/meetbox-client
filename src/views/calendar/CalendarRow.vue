<template>
  <div class="calendar__row container-fluid d-flex flex-row position-relative">
    <WeeksDay :nameDay="nameDay" :day="day" />
    <RowEventsContainer :events="dataprops" :rowSizeX="rowSizeX" />
  </div>
</template>

<script>
import RowEventsContainer from "@/components/calendar/RowEventsContainer";
import WeeksDay from "@/components/calendar/WeeksDay";

export default {
  name: "CalendarRow",
  props: ["dataprops", "rowSizeX", "nameDay", "day"],
  components: { WeeksDay, RowEventsContainer },
  methods: {
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
    dataprops: function(val) {
      console.log("updated dataprops in calendarRow", val);
    }
  }
};
</script>

<style scoped>
.calendar__row {
  /* height: 100px; */
  height: calc(100% / 7);
  /* border: 1px solid grey; */

  padding: 0;
  margin: 0;
}
</style>
