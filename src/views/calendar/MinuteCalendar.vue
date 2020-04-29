<template>
  <div class="bella"></div>
</template>

<script>
export default {
  name: "MinuteCalendar",
  props: ["value"],
  state: {
    timing: 15,
    hours: 24,
    minute: 60
  }
};
</script>

<style>
.bella {
  height: 100%;
  /* width: calc((100 * ((24 * 60) / 5)) / (24 * 60)); */
  width: 2%;
  background-color: grey;
}
</style>
