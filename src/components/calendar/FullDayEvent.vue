<template>
  <div
    ref="full_day_event"
    class="position-absolute event"
    @click.stop="handleShowEvent"
    v-on="$listeners"
  >
    <!-- <div class="event_resizer" @mousedown="handleResizingLeft"></div> -->
    {{ event.title }}
    <!-- <div class="event_resizer"></div> -->
  </div>
</template>

<script>
export default {
  name: "FullDayEvent",
  props: ["event"],
  methods: {
    handleShowEvent() {
      this.$emit("showEvent", this.event);
    }
  }
};
</script>

<style>
.event {
  width: 100%;
  height: 25%;
  background-color: #2f80ed;
  border: 1px solid white;
  overflow: hidden;
  padding: 0;
  margin: 0;
  border-radius: 8px;
  text-align: center;

  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}
</style>
