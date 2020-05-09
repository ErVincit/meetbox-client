<template>
  <div
    class="label rounded-pill"
    :style="style"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
export default {
  name: "Label",
  props: {
    label: { name: String, color: String },
    expanded: { type: Boolean, default: false }
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
}
</style>
