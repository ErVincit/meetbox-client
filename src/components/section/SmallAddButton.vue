<template>
  <button
    class="small-add-btn d-flex justify-content-center align-items-center m-1 my-2 px-1 rounded-pill"
    @click="$emit('click', $event)"
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 11H13V5H11V11H5V13H11V19H13V13H19V11Z" />
    </svg>
    <p class="m-0 p-1"><slot /></p>
  </button>
</template>

<script>
export default {};
</script>

<style scoped>
button.small-add-btn {
  color: var(--color);
  text-align: center;
  cursor: pointer;
  font-size: 11px;
  border: 1px dashed var(--color);
  fill: var(--color);
  outline: none;
  transition: transform 200ms;
  white-space: nowrap;
}
button.small-add-btn:active {
  transform: scale(0.9);
}
button.small-add-btn:hover {
  fill: var(--primary);
  color: var(--primary);
  border-color: var(--primary);
}
</style>
