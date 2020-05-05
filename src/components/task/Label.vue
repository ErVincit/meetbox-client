<template>
  <span class="badge badge-pill d-block col-3 label"></span>
</template>

<script>
export default { name: "Label", props: { name: String } };
</script>

<style scoped>
.label {
  min-width: 50px;
  min-height: 10px;
  background-color: #1c4885;
}
</style>
