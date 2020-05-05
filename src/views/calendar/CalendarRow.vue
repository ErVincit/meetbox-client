<template>
  <div class="calendar__row container-fluid d-flex flex-row position-relative">
    <WeeksDay :nameDay="nameDay" :day="day" />
    <RowEvents :events="dataprops" :rowSizeX="rowSizeX" />
  </div>
</template>

<script>
import RowEvents from "@/components/calendar/RowEvents";
import WeeksDay from "@/components/calendar/WeeksDay";

export default {
  name: "CalendarRow",
  props: ["dataprops", "rowSizeX", "nameDay", "day"],
  components: { WeeksDay, RowEvents },
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
  updated() {}
};
</script>

<style scoped>
.calendar__row {
  height: 100px;
  /* border: 1px solid grey; */

  padding: 0;
  margin: 0;
}
</style>
