<template>
  <NeuContainer class="daily_events p-4" disableHover>
    <div class="d-flex justify-content-between">
      <h1 class="title_eventsday">
        {{ title }}
      </h1>
      <button
        type="button"
        class="close col-1 d-block d-md-none p-2"
        aria-label="Close"
        @click="handleHideDailyEvents"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <EventDay
      v-for="event in day.events"
      :key="event.id"
      :day="day.day"
      :nameDay="day.nameDay"
      :event="event"
      @showEvent="handleShowEvent"
    />
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import EventDay from "@/components/calendar/EventDay";

import calendarUtils from "@/views/calendar/calendar_utils";

export default {
  name: "DailyEvents",
  components: { NeuContainer, EventDay },
  props: ["day"],
  methods: {
    handleShowEvent(event) {
      this.$emit("showEvent", event);
    },
    handleHideDailyEvents() {
      this.$emit("hideDailyEvents");
    }
  },
  mounted() {
    this.myDay = this.day;
  },
  watch: {
    day: function(value) {
      this.myDay = value;
    }
  },
  data() {
    return {
      myDay: {},
      rows: []
    };
  },
  computed: {
    title() {
      return (
        this.day.nameDay +
        " " +
        this.day.day +
        " " +
        calendarUtils.getMonthName(this.day.timestamp.getMonth())
      );
    }
  }
};
</script>

<style>
.daily_events {
  position: fixed;
  top: 45%;
  left: 50%;
  min-width: 600px;
  max-width: 800px;
  transform: translate(-50%, -50%);
  z-index: 100;
  border: 4px dotted transparent;
}
@media (max-width: 768px) {
  .daily_events {
    min-width: unset;
    width: 100vw;
    height: 100vh;
    top: 50%;
    overflow: auto;
  }
}
.title_eventsday {
  color: var(--primary);
}
</style>
