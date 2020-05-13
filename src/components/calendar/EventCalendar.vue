<template>
  <div
    ref="event"
    class="position-absolute event"
    @mousedown="handleMousedown($event, event)"
    @click.stop="handleShowEvent"
    v-on="$listeners"
  >
    <div
      v-if="isleftResizable"
      class="event_resizer event_resizer_left"
      @mousedown="handleMousedown($event, event)"
    ></div>
    {{ event.title }}
    <div
      v-if="isRightResizable"
      class="event_resizer event_resizer_right right"
      @mousedown="handleRightResizing($event, event)"
    ></div>
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
      disableClick: false,
      target: null
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
      const target = e.target.parentNode;
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
      } else if (e.target.className.split(" ").includes("event_resizer_left")) {
        // document.onmousemove = this.resizeMoovig;
        document.onmousemove = e => {
          this.handleResizingLeft(e, target);
        };
        document.onmouseup = async () => {
          document.onmouseup = null;
          document.onmousemove = null;
          document.body.style.userSelect = "initial";
          const timestampBegin = new Date(this.event.timestampBegin);
          timestampBegin.setHours(this.newHour, this.newMinutes);
          console.log("New begin time:", timestampBegin);
          var timestampEnd = new Date(this.event.timestampEnd);
          const { workgroupId } = this.$route.params;

          //Se è un evento spezzettato
          if (this.event.originalBegin && this.event.originalEnd) {
            timestampEnd = new Date(this.event.originalEnd);
          }
          //Se è evento giornaliero

          const newEvent = {
            id: event.id,
            timestampBegin,
            timestampEnd
          };
          await this.editEvent({
            workgroupId,
            event: newEvent,
            oldEvent: event
          });

          this.disableClick = false;
        };
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
    handleResizingLeft(e, target) {
      this.disableClick = true;
      // let width = Number.parseInt(this.target.style.width.replace("px", ""));
      // let left = Number.parseInt(this.target.style.left.replace("px", ""));
      const toLeft =
        document.getElementsByClassName("row__events_container")[0].offsetLeft +
        document.getElementsByClassName("main_column_calendar")[0].offsetLeft;
      const newPos = e.clientX - toLeft - 17;
      // const superMax = left + width - (15 * this.rowSizeX) / (24 * 60);
      const superMax = this.rowSizeX - (15 * this.rowSizeX) / (24 * 60);
      if (0 <= newPos && newPos <= superMax) {
        target.style.left = newPos + "px";
        const { hours, minutes } = calendarUtils.positionToHours(
          newPos,
          this.rowSizeX
        );
        this.newHour = hours;
        this.newMinutes = minutes;
        target.style.width = this.widthBeginCalculator() + "px";
      } else if (newPos <= 0) {
        target.style.left = 0 + "px";
        this.newHour = 0;
        this.newMinutes = 0;
        // e.target.parentNode.style.width = this.widthCalculator() + "px";
      }
      // else if (newPos >= superMax) {
      //   // console.log("minoreee", superMax, newPos);

      //   this.target.style.left = superMax + "px";
      //   this.target.style.width = this.widthCalculator() + "px";
      // }
    },
    async handleRightResizing(e, event) {
      const target = e.target.parentNode;
      document.onmousemove = e => {
        this.disableClick = true;
        const toLeft =
          document.getElementsByClassName("row__events_container")[0]
            .offsetLeft +
          document.getElementsByClassName("main_column_calendar")[0].offsetLeft;
        const newPos = e.clientX - toLeft - 17;
        const startEvent = Number.parseInt(target.style.left.replace("px", ""));
        const min = startEvent + (15 * this.rowSizeX) / (24 * 60);
        if (min <= newPos && newPos <= this.rowSizeX) {
          const { hours, minutes } = calendarUtils.positionToHours(
            newPos,
            this.rowSizeX
          );
          this.newEndHour = hours;
          this.newEndMinutes = minutes;
          target.style.width = newPos - startEvent + "px";
        }
        // else if (newPos <= 0) {
        //   target.style.left = 0 + "px";
        //   this.newHour = 0;
        //   this.newMinutes = 0;
        //   // e.target.parentNode.style.width = this.widthCalculator() + "px";
        // }
        else if (newPos >= this.rowSizeX) {
          this.newEndHour = 23;
          this.newEndMinutes = 59;
          target.style.width = this.widthCalculator(23, 59) + "px";
        }
      };
      document.onmouseup = async () => {
        document.onmouseup = null;
        document.onmousemove = null;
        document.body.style.userSelect = "initial";
        var timestampBegin = new Date(this.event.timestampBegin);
        const timestampEnd = new Date(this.event.timestampEnd);
        timestampEnd.setHours(this.newEndHour, this.newEndMinutes);
        console.log("New end time:", timestampBegin, timestampEnd);
        const { workgroupId } = this.$route.params;

        //Se è un evento spezzettato
        if (this.event.originalBegin && this.event.originalEnd) {
          timestampBegin = new Date(this.event.originalBegin);
        }
        //Se è evento giornaliero

        const newEvent = {
          id: event.id,
          timestampBegin,
          timestampEnd
        };
        await this.editEvent({
          workgroupId,
          event: newEvent,
          oldEvent: event
        });

        this.disableClick = false;
      };
    },
    handleShowEvent() {
      if (!this.disableClick) this.$emit("showEvent", this.event);
    },
    widthBeginCalculator() {
      const max =
        ((Number.parseInt(this.newHour) * 60 +
          Number.parseInt(this.newMinutes)) *
          this.rowSizeX) /
        (24 * 60);
      const length =
        ((this.event.timestampEnd.getHours() * 60 +
          this.event.timestampEnd.getMinutes()) *
          this.rowSizeX) /
        (24 * 60);
      return length - max;
    },
    widthCalculator(hours, minutes) {
      const max =
        ((Number.parseInt(this.newHour) * 60 +
          Number.parseInt(this.newMinutes)) *
          this.rowSizeX) /
        (24 * 60);
      const length = ((hours * 60 + minutes) * this.rowSizeX) / (24 * 60);
      return length - max;
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
    },
    isleftResizable() {
      return this.isEditable && !this.eventProps.hasPrevious;
    },
    isRightResizable() {
      return this.isEditable && !this.eventProps.hasNext;
    }
  }
};
</script>

<style scoped>
.event {
  width: 100px;
  height: 100%;
  background-color: #2f80ed;
  color: white;
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
  width: 4px;
  cursor: col-resize;
  z-index: 25;
}

.right {
  right: 0;
}
</style>
