<template>
  <div class="row_events position-relative">
    <EventCalendar
      v-for="element in row"
      :key="element.id"
      :eventProps="element"
      :rowWidth="rowSizeX"
      :rowLine="rowLine"
      @showDailyEvents="handleShowDailyEvents"
      @showEvent="handleShowEvent"
      @alert="handleAlert"
    />
  </div>
</template>

<script>
import EventCalendar from "@/components/calendar/EventCalendar";

export default {
  name: "RowEvents",
  props: ["row", "rowLine"],
  components: { EventCalendar },
  data: function() {
    return {
      rowSizeX: 0,
      rowSizeY: 0
    };
  },
  mounted() {
    this.setActualRowSize();
    window.addEventListener("resize", this.setActualRowSize);
  },
  watch: {
    row: function(newVal) {
      this.row = newVal;
    }
  },
  methods: {
    handleShowDailyEvents(weekDay) {
      this.$emit("showDailyEvents", weekDay);
    },
    handleAlert(message) {
      this.$emit("alert", message);
    },
    handleShowEvent(event) {
      this.$emit("showEvent", event);
    },
    setActualRowSize() {
      const rowElement = document.querySelector(".row__events_container");
      this.rowSizeX = rowElement.scrollWidth; // !!! Non prende margin o padding
      this.rowSizeY = rowElement.scrollHeight;
    }
  },
  destroyed() {
    window.removeEventListener("resize", this.setActualRowSize);
  }
};
</script>

<style>
.row_events {
  height: 25%;
  width: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
}
</style>
