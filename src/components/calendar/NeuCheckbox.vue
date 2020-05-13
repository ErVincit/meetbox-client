<template>
  <NeuContainer
    class="checkbox position-relative"
    :class="{ invisible: invisible }"
    :shadowRadius="3"
    :shadowBlur="5"
    alwaysHover
    v-on="listeners"
    v-bind="$attrs"
    @click.stop="handlePressed"
  >
    <img
      v-if="this.pressed"
      class="checkbox_icon"
      src="@/assets/checkboxIcon.svg"
    />
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";

export default {
  name: "NeuCheckbox",
  props: { placeholder: String, value: String, invisible: Boolean },
  components: { NeuContainer },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: e => this.$emit("pressed", e.target.value)
      };
    }
  },
  methods: {
    handlePressed() {
      if (this.pressed) this.pressed = false;
      else this.pressed = true;
      this.$emit("pressed", this.pressed);
    }
  },
  data() {
    return {
      pressed: false
    };
  }
};
</script>

<style scoped>
.checkbox_icon {
  min-width: 15px;
  min-height: 15px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.checkbox {
  border-radius: 5px;
  min-width: 20px;
  min-height: 20px;
  cursor: pointer;
}
</style>
