<template>
  <div
    class="row__events container-fluid row position-relative"
    @mousedown="handleMousedown"
  >
    <EventCalendar
      v-for="element in events"
      :key="element.id"
      :eventProps="element"
      :rowWidth="rowSizeX"
    />
  </div>
</template>

<script>
import EventCalendar from "@/components/calendar/EventCalendar";

export default {
  name: "RowEvents",
  props: ["events"],
  components: { EventCalendar },
  mounted() {
    const rowElement = document.querySelector(".row__events");
    this.rowSizeX = rowElement.scrollWidth - 30; // TODO: Prendere quello senza margin
    this.rowSizeY = rowElement.scrollHeight;
    // console.log("Mounted RowEvents:", this.rowSizeX, this.rowSizeY);
  },
  data() {
    return {
      rowSizeX: 0,
      rowSizeY: 0,
      offSet: 0,
      target: null
    };
  },
  methods: {
    handleMousedown(e) {
      console.log("MouseDown!", e);
      // Elimina la possibilità all'utente di selezionare testo
      document.body.style.userSelect = "none";
      if (e.path[0].className.split(" ").includes("event")) {
        this.offSet = e.offsetX;
        this.target = e.target;
        document.onmouseup = () => {
          console.log("MouseUp!");
          // Fare cose se selezionato un evento : OK
          // Fare cose viene selezionata la row : TODO
          document.onmouseup = null;
          document.onmousemove = null;
          this.target = null;
          document.body.style.userSelect = "initial";
        };
        document.onmousemove = this.handleMousemove;
      }
    },
    handleMousemove(e) {
      const toLeft =
        document.getElementsByClassName("row__events")[0].offsetLeft +
        document.getElementsByClassName("main_column_calendar")[0].offsetLeft;
      // console.log(this.offSet, this.target, toLeft);s
      const newPos = e.clientX - toLeft - this.offSet - 15;
      if (0 <= newPos) {
        this.target.style.left = newPos + "px";
        this.positionToHours(newPos);
      } else if (newPos <= 0) {
        this.target.style.left = 0 + "px";
      }
    },
    positionToHours(x) {
      const solution = (24 * 60 * x) / this.rowSizeX;
      const hours = solution / 60;
      const minutes = solution % 60;
      console.log("Hours:", hours, "Minutes:", minutes);
    }
  }
};
</script>

<style>
.row__events {
  height: 100px;
  padding: 0;
  margin: 0;
}
</style>
