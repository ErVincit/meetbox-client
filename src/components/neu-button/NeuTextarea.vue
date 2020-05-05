<template>
  <NeuContainer
    class="neu-textarea"
    :shadowRadius="3"
    :shadowBlur="5"
    alwaysHover
  >
    <textarea
      class="form-control px-4"
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
  name: "NeuTextarea",
  props: { placeholder: String, value: String },
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
textarea,
textarea:focus {
  background-color: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  height: 50px;
  font-size: 14px;
  font-weight: 600;
}
</style>
