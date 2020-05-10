<template>
  <NeuContainer
    class="rounded-pill neu-input"
    :shadowRadius="3"
    :shadowBlur="5"
    alwaysHover
    :disabled="backgroundHidden"
  >
    <input
      :type="type"
      class="form-control rounded-pill"
      :placeholder="placeholder"
      :value="value"
      v-on="listeners"
      v-bind="$attrs"
    />
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";

export default {
  name: "NeuInput",
  props: {
    type: String,
    placeholder: String,
    value: String,
    backgroundHidden: { type: Boolean, default: false }
  },
  components: { NeuContainer },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: e => this.$emit("input", e.target.value)
      };
    }
  }
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
