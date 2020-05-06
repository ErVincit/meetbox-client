<template>
  <div
    class="avatar d-flex justify-content-center align-items-center rounded-circle"
    :style="{ backgroundColor: color }"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
    v-tooltip="fullname"
  >
    <p class="m-0">{{ firstLetters }}</p>
  </div>
</template>

<script>
const colors = [
  "#7c7c7c",
  "#0c7489",
  "#c5dca0",
  "#0f7173",
  "#272932",
  "#f05d5e",
  "#d8a47f"
];

export default {
  name: "Avatar",
  props: { firstname: String, lastname: String },
  data() {
    return {
      color: colors[Math.floor(Math.random() * colors.length)],
      showTooltip: false
    };
  },
  computed: {
    firstLetters() {
      return (this.firstname.charAt(0) + this.lastname.charAt(0)).toUpperCase();
    },
    fullname() {
      return this.firstname + " " + this.lastname;
    }
  }
};
</script>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  border: 3px solid var(--background-color);
  font-size: 15px;
  color: white;
}
.avatar:hover {
  z-index: 100;
}
</style>
