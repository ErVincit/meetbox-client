<template>
  <button
    class="activity__add d-flex justify-content-center align-items-center mt-3"
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
    <p class="m-0 p-2">Aggiungi una nuova attività</p>
  </button>
</template>

<script>
export default {
  name: "AddTask"
};
</script>

<style scoped>
button.activity__add {
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
button.activity__add:active {
  transform: scale(0.9);
}
button.activity__add:hover {
  fill: #2f80ed;
  color: #2f80ed;
  border-color: #2f80ed;
}
</style>
