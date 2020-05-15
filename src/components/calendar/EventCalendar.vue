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

const MINIMUM_MINUTE_WIDTH_SLIDER = 15;

export default {
  name: "EventCalendar",
  props: ["eventProps", "rowWidth"],
  mounted() {
    this.$refs.event.style["background-color"] = this.event.color;
    const max =
      ((this.event.timestampBegin.getHours() * 60 +
        this.event.timestampBegin.getMinutes()) *
        this.rowWidth) /
      (24 * 60);
    this.newHour = this.event.timestampBegin.getHours();
    this.newMinutes = this.event.timestampBegin.getMinutes();

    this.$refs.event.style.left = `${max}px`;
    const hours = this.event.timestampEnd.getHours();
    const minutes = this.event.timestampEnd.getMinutes();
    const length = this.widthCalculator(hours, minutes);
    this.$refs.event.style.width = `${length}px`;
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
  updated() {
    // console.log("Updato", this.event.title, this.event);
  },
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
        this.isMoovable
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
      const newPos = e.clientX - toLeft - this.offSet - 16; //Margin
      const superMax =
        this.rowSizeX -
        Number.parseInt(this.target.style.width.replace("px", ""));
      const now = new Date();
      var min = 0;
      if (calendarUtils.checkSameDay(this.event.timestampBegin, now))
        min = calendarUtils.minutesToPosition(now, this.rowSizeX);
      if (min <= newPos && newPos <= superMax) {
        this.target.style.left = newPos + "px";
        const { hours, minutes } = calendarUtils.positionToHours(
          newPos,
          this.rowSizeX
        );
        this.newHour = hours;
        this.newMinutes = minutes;
      } else if (newPos <= min) {
        this.target.style.left = min + "px";
        if (min === 0) {
          this.newHour = 0;
          this.newMinutes = 0;
        } else {
          this.newHour = now.getHours();
          this.newMinutes = now.getMinutes();
        }
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
      var superMax =
        this.rowSizeX -
        (MINIMUM_MINUTE_WIDTH_SLIDER * this.rowSizeX) / (24 * 60);

      const now = new Date();
      var min = 0;
      if (calendarUtils.checkSameDay(this.event.timestampBegin, now))
        min = calendarUtils.minutesToPosition(now, this.rowSizeX);
      if (calendarUtils.checkSameDay(this.event.timestampEnd, now))
        superMax =
          calendarUtils.minutesToPosition(
            this.event.timestampEnd,
            this.rowSizeX
          ) -
          (MINIMUM_MINUTE_WIDTH_SLIDER * this.rowSizeX) / (24 * 60);
      if (min <= newPos && newPos <= superMax) {
        target.style.left = newPos + "px";
        const { hours, minutes } = calendarUtils.positionToHours(
          newPos,
          this.rowSizeX
        );
        this.newHour = hours;
        this.newMinutes = minutes;
        target.style.width =
          this.widthCalculator(
            this.event.timestampEnd.getHours(),
            this.event.timestampEnd.getMinutes()
          ) + "px";
      } else if (newPos <= min) {
        target.style.left = min + "px";
        if (min === 0) {
          this.newHour = 0;
          this.newMinutes = 0;
        } else {
          this.newHour = now.getHours();
          this.newMinutes = now.getMinutes();
        }
        target.style.width =
          this.widthCalculator(
            this.event.timestampEnd.getHours(),
            this.event.timestampEnd.getMinutes()
          ) + "px";
      } else if (newPos >= superMax) {
        target.style.left = superMax + "px";
        if (
          superMax ===
          this.rowSizeX -
            (MINIMUM_MINUTE_WIDTH_SLIDER * this.rowSizeX) / (24 * 60)
        ) {
          this.newHour = 23;
          let minimum = 60 - MINIMUM_MINUTE_WIDTH_SLIDER;
          const min = minimum == 60 ? 59 : minimum;
          this.newMinutes = min;
          target.style.width = this.widthCalculator(23, 59) + "px";
        } else {
          const tempDate = new Date(this.event.timestampEnd);
          tempDate.setMinutes(
            tempDate.getMinutes() - MINIMUM_MINUTE_WIDTH_SLIDER
          );
          this.newHour = tempDate.getHours();
          let minimum = tempDate.getMinutes();
          if (tempDate.getHours() === 23)
            this.newMinutes = minimum == 60 ? 59 : minimum;
          else this.newMinutes = tempDate.getMinutes();
          target.style.width =
            this.widthCalculator(
              this.event.timestampEnd.getHours(),
              this.event.timestampEnd.getMinutes()
            ) + "px";
        }
      }
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
        var min =
          startEvent +
          (MINIMUM_MINUTE_WIDTH_SLIDER * this.rowSizeX) / (24 * 60);
        const now = new Date();
        if (this.event.timestampBegin < now)
          min =
            calendarUtils.minutesToPosition(now, this.rowSizeX) +
            (MINIMUM_MINUTE_WIDTH_SLIDER * this.rowSizeX) / (24 * 60);
        if (min <= newPos && newPos <= this.rowSizeX) {
          const { hours, minutes } = calendarUtils.positionToHours(
            newPos,
            this.rowSizeX
          );
          this.newEndHour = hours;
          this.newEndMinutes = minutes;
          target.style.width = newPos - startEvent + "px";
        } else if (newPos <= min) {
          if (
            min ===
            startEvent +
              (MINIMUM_MINUTE_WIDTH_SLIDER * this.rowSizeX) / (24 * 60)
          ) {
            this.newEndHour = 0;
            this.newEndMinutes = MINIMUM_MINUTE_WIDTH_SLIDER;
            target.style.width =
              this.widthCalculator(0, MINIMUM_MINUTE_WIDTH_SLIDER) + "px";
          } else {
            now.setMinutes(now.getMinutes() + MINIMUM_MINUTE_WIDTH_SLIDER);
            this.newEndHour = now.getHours();
            this.newEndMinutes = now.getMinutes();
            target.style.width =
              this.widthCalculator(this.newEndHour, this.newEndMinutes) + "px";
          }
        } else if (newPos >= this.rowSizeX) {
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
      if (this.event.owner === this.currentUser.id) return true;
      for (let i = 0; i < this.event.members.length; i++)
        if (this.event.members[i].id === this.currentUser.id) return true;
      return false;
    },
    isMoovable() {
      return (
        this.isEditable &&
        !this.eventProps.hasPrevious &&
        this.event.timestampBegin > new Date() &&
        this.event.timestampEnd > new Date()
      );
    },
    isleftResizable() {
      return (
        this.isEditable &&
        !this.eventProps.hasPrevious &&
        this.event.timestampBegin > new Date()
      );
    },
    isRightResizable() {
      return (
        this.isEditable &&
        !this.eventProps.hasNext &&
        this.event.timestampEnd > new Date()
      );
    }
  }
};
</script>

<style scoped>
.event {
  width: 100px;
  height: 100%;
  background-color: #2f80ed;
  border: 1px solid white;
  color: white;
  overflow: hidden;
  padding: 0;
  margin: 0;
  border-radius: 8px;
  white-space: nowrap;
  text-align: center;

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
