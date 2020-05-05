<template>
  <button
    class="big-add-btn d-flex justify-content-center align-items-center mt-3"
    @click="$emit('click', $event)"
  >
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 11H13V5H11V11H5V13H11V19H13V13H19V11Z" />
    </svg>
    <p class="m-0 p-2"><slot /></p>
  </button>
</template>

<script>
export default {
  name: "BigAddButton"
};
</script>

<style scoped>
button.big-add-btn {
  width: 100%;
  color: var(--color);
  text-align: center;
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid lightgrey;
  fill: var(--color);
  outline: none;
  transition: transform 200ms;
  white-space: nowrap;
}
button.big-add-btn:active {
  transform: scale(0.9);
}
button.big-add-btn:hover {
  fill: #1c4885;
  color: #1c4885;
  border-color: #1c4885;
}
</style>
