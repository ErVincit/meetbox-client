<template>
  <NeuContainer
    class="rounded-pill"
    :shadowRadius="3"
    :shadowBlur="5"
    alwaysHover
  >
    <input
      :type="type"
      class="form-control rounded-pill px-4"
      :placeholder="placeholder"
      :value="value"
      v-on:input="$emit('input', $event.target.value)"
    />
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";

export default {
  name: "NeuInput",
  props: { type: String, placeholder: String, value: String },
  components: { NeuContainer }
};
</script>

<style scoped>
input,
input:focus {
  background-color: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  height: 50px;
  font-size: 18px;
  font-weight: 600;
}
</style>
