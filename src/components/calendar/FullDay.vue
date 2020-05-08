<template>
  <div class="fullday_event position-relative">
    <FullDayEvent
      v-for="event in events"
      :key="event.id"
      :event="event"
      @showEvent="handleShowEvent"
    />
  </div>
</template>

<script>
import FullDayEvent from "@/components/calendar/FullDayEvent";

export default {
  name: "FullDay",
  props: ["events"],
  components: { FullDayEvent },
  mounted() {
    const rowElement = document.querySelector(".fullday_event");

    this.rowSizeY = rowElement.scrollHeight;
  },
  methods: {
    handleShowEvent(event) {
      this.$emit("showEvent", event);
    }
  }
};
</script>

<style>
.fullday_event {
  width: 15%;
  border-left: 1px solid rgb(194, 194, 194);
}
</style>
