<template>
  <div class="row_events position-relative">
    <EventCalendar
      v-for="element in row"
      :key="element.id"
      :eventProps="element"
      :rowWidth="rowSizeX"
      @showEvent="handleShowEvent"
    />
  </div>
</template>

<script>
import EventCalendar from "@/components/calendar/EventCalendar";

export default {
  name: "RowEvents",
  props: ["row"],
  components: { EventCalendar },
  data: function() {
    return {
      rowSizeX: 0,
      rowSizeY: 0
    };
  },
  mounted() {
    const rowElement = document.querySelector(".row__events_container");
    this.rowSizeX = rowElement.scrollWidth; //Attention if padding or margin
    this.rowSizeY = rowElement.scrollHeight;
  },
  watch: {
    row: function(newVal) {
      this.row = newVal;
    }
  },
  methods: {
    handleShowEvent(event) {
      this.$emit("showEvent", event);
    }
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
