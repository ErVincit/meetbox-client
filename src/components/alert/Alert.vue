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
    },
    timeout: {
      type: Number,
      default: null
    }
  },
  data() {
    return { timer: null };
  },
  methods: {
    exit() {
      this.$emit("close");
    }
  },
  mounted() {
    if (this.timeout) this.timer = setTimeout(this.exit, this.timeout);
  },
  destroyed() {
    if (this.timeout) clearTimeout(this.timer);
  }
};
</script>

<style></style>
