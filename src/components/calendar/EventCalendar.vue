<template>
  <div
    ref="event"
    class="position-absolute event"
    @mousedown="handleMousedown($event, event)"
    @click.stop="handleShowEvent"
    v-on="$listeners"
  >
    <div
      v-if="isEditable"
      class="event_resizer"
      @mousedown="handleResizingLeft"
    ></div>
    {{ event.title }}
    <div v-if="isEditable" class="event_resizer"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import calendarUtils from "@/views/calendar/calendar_utils";

export default {
  name: "EventCalendar",
  props: ["eventProps", "rowWidth"],
  mounted() {
    const max =
      ((this.event.timestampBegin.getHours() * 60 +
        this.event.timestampBegin.getMinutes()) *
        this.rowWidth) /
      (24 * 60);
    this.newHour = this.event.timestampBegin.getHours();
    this.newMinutes = this.event.timestampBegin.getMinutes();

    this.$refs.event.style.left = `${max}px`;
    if (this.event.timestampEnd) {
      const length =
        ((this.event.timestampEnd.getHours() * 60 +
          this.event.timestampEnd.getMinutes()) *
          this.rowWidth) /
        (24 * 60);
      this.$refs.event.style.width = `${length - max}px`;
    }
  },
  data() {
    return {
      totalTime: 24 * 60,
      rowSizeX: this.rowWidth,
      event: this.eventProps,
      newHour: 0,
      newMinutes: 0,
      newEndHour: 0,
      newEndMinutes: 0,
      disableClick: false
    };
  },
  watch: {
    rowWidth: function(val) {
      this.rowSizeX = val;
      this.setEventLeght(event);
    },
    eventProps: function(event) {
      this.event = event;
      this.setEventLeght(event);
    }
  },
  updated() {},
  methods: {
    setEventLeght() {
      this.event.timestampBegin = new Date(this.event.timestampBegin);
      this.event.timestampEnd = new Date(this.event.timestampEnd);
      const max =
        ((this.event.timestampBegin.getHours() * 60 +
          this.event.timestampBegin.getMinutes()) *
          this.rowSizeX) /
        (24 * 60);

      this.$refs.event.style.left = `${max}px`;
      if (this.event.timestampEnd) {
        const length =
          ((this.event.timestampEnd.getHours() * 60 +
            this.event.timestampEnd.getMinutes()) *
            this.rowSizeX) /
          (24 * 60);
        this.$refs.event.style.width = `${length - max}px`;
      }
    },
    handleMousedown(e, event) {
      // console.log("MouseDown!");
      // Elimina la possibilità all'utente di selezionare testo
      document.body.style.userSelect = "none";
      if (
        e.target.className.split(" ").includes("event") &&
        calendarUtils.verifyAloneEvent(event) &&
        this.isEditable
      ) {
        this.offSet = e.offsetX;
        this.target = e.target;
        document.onmouseup = async () => {
          // console.log("MouseUp!");
          // Fare cose se selezionato un evento : OK
          // Fare cose viene selezionata la row : TODO
          document.onmouseup = null;
          document.onmousemove = null;
          this.target = null;
          document.body.style.userSelect = "initial";

          // Gestisco store per eventuali modifiche
          const { workgroupId } = this.$route.params;
          const timestampBegin = new Date(event.timestampBegin);
          console.log(
            "Selected: hour:",
            this.newHour,
            "minute",
            this.newMinutes
          );
          // Controllo se è cambiato qualcosa
          if (
            timestampBegin.getHours() == this.newHour &&
            timestampBegin.getMinutes() == this.newMinutes
          )
            return;

          timestampBegin.setHours(this.newHour, this.newMinutes);
          const timestampEnd = calendarUtils.endTimestampCalculator(
            event.timestampBegin,
            timestampBegin,
            event.timestampEnd
          );
          //Gestisco se esce fuori
          if (timestampEnd.getHours() == 0 && timestampEnd.getMinutes() >= 0) {
            timestampEnd.setDate(timestampEnd.getDate() - 1);
            timestampEnd.setHours(23, 59);
          }

          this.event.timestampBegin = timestampBegin;
          this.event.timestampEnd = timestampEnd;

          const newEvent = {
            id: event.id,
            timestampBegin,
            timestampEnd
          };
          if (this.event.originalBegin && this.event.originalEnd) {
            event.timestampBegin = event.originalBegin;
            event.timestampEnd = event.originalEnd;
          }
          await this.$store.dispatch("editEvent", {
            workgroupId,
            event: newEvent,
            oldEvent: event
          });
          this.disableClick = false;
        };
        document.onmousemove = this.handleMousemove;
        // } else if (e.target.className.split(" ").includes("event_resizer")) {
        //   document.onmousemove = this.resizeMoovig;
        //   document.onmouseup = () => {
        //     console.log("MouseUp!");
        //     // Fare cose se selezionato un evento : OK
        //     // Fare cose viene selezionata la row : TODO
        //     document.onmouseup = null;
        //     document.onmousemove = null;
        //     this.target = null;
        //     document.body.style.userSelect = "initial";
        //     // console.log("TIMESTAMP:", this.event.timestampBegin);
        //     // this.$emit("changedEvent", "someValue");
        //   };
        //   this.handleResizingLeft(e);
      }
    },
    handleMousemove(e) {
      this.disableClick = true;
      const toLeft =
        document.getElementsByClassName("row__events_container")[0].offsetLeft +
        document.getElementsByClassName("main_column_calendar")[0].offsetLeft;
      const newPos = e.clientX - toLeft - this.offSet - 15;
      const superMax =
        this.rowSizeX -
        Number.parseInt(this.target.style.width.replace("px", ""));
      if (0 <= newPos && newPos <= superMax) {
        this.target.style.left = newPos + "px";
        const { hours, minutes } = calendarUtils.positionToHours(
          newPos,
          this.rowSizeX
        );
        this.newHour = hours;
        this.newMinutes = minutes;
      } else if (newPos <= 0) {
        this.target.style.left = 0 + "px";
        this.newHour = 0;
        this.newMinutes = 0;
      } else if (newPos >= superMax) {
        this.target.style.left = superMax + "px";
        // TODO: Assegnare valore massimi
      }
    },
    handleResizingLeft(e) {
      // e.preventDeafult();
      console.log(e.path[1]);
      e.preventDefault();
    },
    // resizeMoovig(e) {
    //   const toLeft =
    //     document.getElementsByClassName("row__events")[0].offsetLeft +
    //     document.getElementsByClassName("main_column_calendar")[0].offsetLeft;
    //   const newPos = e.clientX - toLeft - this.offSet - 15;
    //   if (0 <= newPos) {
    //     e.path[1].style.left = newPos + "px";
    //     /*const { hours, minutes } = */ calendarUtils.positionToHours(
    //       newPos,
    //       this.rowSizeX
    //     );
    //     // console.log(hours, minutes, this.event);
    //   } else if (newPos <= 0) {
    //     this.target.style.left = 0 + "px";
    //   }
    // }
    handleShowEvent() {
      if (!this.disableClick) this.$emit("showEvent", this.event);
    },
    ...mapActions(["editEvent"])
  },
  computed: {
    ...mapGetters(["currentUser"]),
    isEditable() {
      for (let i = 0; i < this.event.members.length; i++)
        if (this.event.members[i].id == this.currentUser.id) return true;
      if (this.event.owner == this.currentUser.id) return true;
      return false;
    }
  }
};
</script>

<style scoped>
.event {
  width: 100px;
  height: 100%;
  background-color: #2f80ed;
  color: black;
  border: 1px solid white;
  overflow: hidden;
  padding: 0;
  margin: 0;
  border-radius: 8px;
  white-space: nowrap;

  text-overflow: ellipsis;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}

.event_resizer {
  position: absolute;
  height: 100%;
  width: 2px;
  cursor: col-resize;
  z-index: 25;
}
</style>
