<template>
  <div class="day_container d-flex flex-row">
    <div class="name_day">{{ this.nameDay }}</div>
    <div class="date">{{ this.day }}</div>
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
  width: 200px;
  /* border: 1px solid black; */
  height: 100%;
  padding: 0;
  margin: 0;

  color: #787878;
  line-height: 80px;
  font-weight: 600;
  margin: auto;
}

.name_day {
  width: 120px;
  text-align: center;
  font-size: 20px;
}

.date {
  font-size: 36px;
}
</style>
