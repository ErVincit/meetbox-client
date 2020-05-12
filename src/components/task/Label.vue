<template>
  <div
    class="label rounded-pill d-flex justify-content-center align-items-center"
    :style="style"
    v-bind="$attrs"
    v-on="$listeners"
    v-if="label"
  >
    <span v-if="showName">{{ label.name }}</span>
  </div>
</template>

<script>
export default {
  name: "Label",
  props: {
    label: { name: String, color: String },
    showName: { type: Boolean, default: false }
  },
  computed: {
    style() {
      return {
        "--label-bg-color": "#" + this.label.color
      };
    }
  }
};
</script>

<style scoped>
.label {
  min-width: 7px;
  width: 7px;
  background-color: var(--label-bg-color);
}
span {
  color: white;
  font-size: 12px;
}
</style>
