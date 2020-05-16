<template>
  <div class="day_container d-flex flex-column m-0 p-2 h-100 col-1">
    <div
      class="name_day d-flex align-items-center justify-content-center col-auto p-0"
    >
      {{ this.nameDay.substring(0, 3) }}
    </div>
    <div class="date d-flex justify-content-center align-items-center col p-0">
      {{ this.day }}
    </div>
  </div>
</template>

<script>
export default {
  name: "WeeksDay",
  props: ["nameDay", "day"]
};
</script>

<style>
.day_container {
  /* border-right: 1px solid rgb(194, 194, 194); */
  color: var(--text-color-bg);
  font-weight: 600;
}

.name_day {
  /* width: 120px; */
  font-size: 1rem;
}

.date {
  font-size: 1.7rem;
}
</style>
