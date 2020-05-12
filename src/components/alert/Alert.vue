<template>
  <div
    v-if="show"
    class="alert alert-danger m-2 mb-4 fixed-bottom"
    role="alert"
  >
    {{ message }}
    <button
      type="button"
      class="close"
      aria-label="Close"
      @click.stop="$emit('close')"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
export default { name: "Alert", props: { show: Boolean, message: String } };
</script>

<style></style>
