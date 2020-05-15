<template>
  <div class="row__events_container position-relative col">
    <RowEvents
      v-for="row in rows"
      :key="row[0].id"
      :row="row"
      @showEvent="handleShowEvent"
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
    const rowElement = document.querySelector(".row__events_container");
    this.rowSizeX = rowElement.scrollWidth - 30; // TODO: Prendere quello senza margin
    this.rowSizeY = rowElement.scrollHeight;
    // console.log("Mounted RowEventsContainer:", this.rowSizeX, this.rowSizeY);
    // console.log("Events RowEventsContainer", this.events);
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
    handleShowEvent(event) {
      this.$emit("showEvent", event);
    }
    // handleMousedown(e) {
    //   console.log("MouseDown!", e);
    //   // Elimina la possibilità all'utente di selezionare testo
    //   document.body.style.userSelect = "none";
    //   if (e.path[0].className.split(" ").includes("event")) {
    //     this.offSet = e.offsetX;
    //     this.target = e.target;
    //     document.onmouseup = () => {
    //       console.log("MouseUp!");
    //       // Fare cose se selezionato un evento : OK
    //       // Fare cose viene selezionata la row : TODO
    //       document.onmouseup = null;
    //       document.onmousemove = null;
    //       this.target = null;
    //       document.body.style.userSelect = "initial";
    //       this.$emit("changedEvent", "someValue");
    //     };
    //     document.onmousemove = this.handleMousemove;
    //   }
    // },
    // handleMousemove(e) {
    //   const toLeft =
    //     document.getElementsByClassName("row__events")[0].offsetLeft +
    //     document.getElementsByClassName("main_column_calendar")[0].offsetLeft;
    //   // console.log(this.offSet, this.target, toLeft);s
    //   const newPos = e.clientX - toLeft - this.offSet - 15;
    //   if (0 <= newPos) {
    //     this.target.style.left = newPos + "px";
    //     calendarUtils.positionToHours(newPos, this.rowSizeX);
    //   } else if (newPos <= 0) {
    //     this.target.style.left = 0 + "px";
    //   }
    // }
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
