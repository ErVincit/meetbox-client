<template>
  <div
    class="alert m-2 mb-4 fixed-bottom"
    :class="'alert-' + type"
    role="alert"
  >
    {{ message }}
    <button type="button" class="close" aria-label="Close" @click.stop="exit">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "Alert",
  props: {
    message: String,
    type: {
      type: String,
      default: "info",
      validator: value =>
        ["success", "danger", "warning", "info"].includes(value)
    }
  },
  methods: {
    exit() {
      this.$emit("close");
    }
  }
};
</script>

<style></style>
