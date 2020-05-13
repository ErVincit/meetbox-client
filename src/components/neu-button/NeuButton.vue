<template>
  <NeuContainer
    :backgroundColor="backgroundColor"
    :color="color"
    :shadowRadius="shadowRadius"
    :shadowBlur="shadowBlur"
    :borderRadius="10"
    class="neu-button"
  >
    <button class="btn p-0 m-0 w-100" v-on="$listeners" v-bind="$attrs">
      <slot />
    </button>
  </NeuContainer>
</template>

<script>
import NeuContainer from "./NeuContainer";

export default {
  name: "NeuButton",
  props: {
    backgroundColor: { type: String, default: "#efeeee" },
    color: { type: String, default: "#787878" },
    shadowRadius: { type: Number, default: 5 },
    shadowBlur: { type: Number, default: 10 }
  },
  components: { NeuContainer }
};
</script>

<style scoped>
.neu-container {
  height: 50px;
  cursor: pointer;
  transition: transform 200ms;
}

.neu-button {
  text-align: center;
}

button,
button:hover {
  border: none;
  border-radius: var(--border-radius);
  color: var(--color);
  height: 100%;
  font-size: 24px;
  font-weight: 600;
}

button:focus {
  outline: none;
  box-shadow: inset var(--radius) var(--radius) var(--blur) var(--dark-color),
    inset calc(0px - var(--radius)) calc(0px - var(--radius)) var(--blur)
      var(--light-color);
}

.neu-container:active {
  transform: scale(0.9);
}
</style>
