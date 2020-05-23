<template>
  <div class="row__events_container position-relative col">
    <RowEvents
      v-for="(row, index) in rows"
      :key="row[0].id"
      :row="row"
      :rowLine="index"
      @showEvent="handleShowEvent"
      @alert="handleAlert"
    >
    </RowEvents>
  </div>
</template>

<script>
import RowEvents from "@/components/calendar/RowEvents";

import calendarUtils from "@/views/calendar/calendar_utils";

export default {
  name: "RowEventsContainer",
  props: ["events"],
  components: { RowEvents },
  mounted() {
    this.rows = calendarUtils.handleEventCollision(this.events);
  },
  data() {
    return {
      rowSizeX: 0,
      rowSizeY: 0,
      offSet: 0,
      target: null,
      rows: [],
      beginEvent: 0,
      endEvent: 0
    };
  },
  watch: {
    events: function(newEvents) {
      this.rows = calendarUtils.handleEventCollision(newEvents);
    }
  },
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

<style>
.row__events_container {
  height: auto;
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>
