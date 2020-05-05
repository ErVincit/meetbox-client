<template>
  <div ref="event" class="position-absolute event"></div>
</template>

<script>
export default {
  name: "EventCalendar",
  props: ["eventProps", "rowWidth"],
  data() {
    return {
      totalTime: 24 * 60,
      rowSizeX: this.rowWidth,
      event: this.eventProps
    };
  },
  watch: {
    rowWidth: function(val) {
      // console.log("Watchout:", val);
      this.rowSizeX = val;
      const max =
        ((this.event.timestampBegin.getHours() * 60 +
          this.event.timestampBegin.getMinutes()) *
          val) /
        (24 * 60);
      // console.log("MAX", max);

      this.$refs.event.style.left = `${max}px`;
      if (this.event.timestampEnd) {
        const length =
          ((this.event.timestampEnd.getHours() * 60 +
            this.event.timestampEnd.getMinutes()) *
            val) /
          (24 * 60);
        this.$refs.event.style.width = `${length - max}px`;
      }
    }
  },
  methods: {
    handleMousedownEvent(e) {
      console.log("MousedownEvent event:", e);
    },
    handleClickEvent(e) {
      console.log("ClickEvent event:", e);
    },
    handleMouseupEvent(e) {
      console.log("MouseupEvent event:", e);
    }
  }
};
</script>

<style scoped>
.event {
  width: 100px;
  height: 25px;
  background-color: green;
  border: 1px solid black;

  padding: 0;
  margin: 0;
}
</style>