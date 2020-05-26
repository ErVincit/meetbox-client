<template>
  <div
    class="avatar d-flex justify-content-center align-items-center rounded-circle"
    :style="{ backgroundColor: color }"
    v-tooltip="fullname"
  >
    <p class="m-0">{{ firstLetters }}</p>
  </div>
</template>

<script>
const colors = [
  "#379794",
  "#6ffe9c",
  "#5dbee5",
  "#eebe7d",
  "#2e3ec5",
  "#74c712",
  "#fa3483",
  "#5b3108",
  "#7a0147",
  "#b22126",
  "#3918cf"
];

export default {
  name: "Avatar",
  props: { firstname: String, lastname: String },
  data() {
    return {
      color: colors[this.firstname.charCodeAt(0) % colors.length]
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
  color: var(--text-color-primary);
}
.avatar:hover {
  z-index: 100;
}
</style>
