<template>
  <NeuContainer class="m-3">
    <div class="d-flex">
      <div class="ml-3 px-2">
        <p class="m-0">{{ timeBegin }}</p>
        <p class="m-0">{{ timeEnd }}</p>
      </div>
      <div class="flex-grow-1 title_eventday position-relative">
        <div class="position-absolute ml-4 title_pos_eventday">
          {{ myEvent.title }}
        </div>
      </div>
    </div>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";

import calendarUtils from "@/views/calendar/calendar_utils";

export default {
  name: "EventDay",
  props: ["day", "nameDay", "event"],
  components: { NeuContainer },
  mounted() {
    this.myEvent = Object.assign({}, this.event);
  },
  watch: {
    event(value) {
      this.myEvent = Object.assign({}, value);
    }
  },
  data() {
    return {
      myEvent: {}
    };
  },
  computed: {
    timeBegin() {
      if (this.myEvent.timestampBegin)
        return calendarUtils.dateToTimeType(this.myEvent.timestampBegin);
      return "";
    },
    timeEnd() {
      if (this.myEvent.timestampBegin)
        return calendarUtils.dateToTimeType(this.myEvent.timestampEnd);
      return "";
    }
  }
};
</script>

<style>
.title_eventday {
  color: var("--homepage-text-color");
}
.title_pos_eventday {
  top: 50%;
  transform: translateY(-50%);
}
</style>
