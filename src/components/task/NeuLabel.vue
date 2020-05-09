<template>
  <NeuContainer
    class="label d-flex align-items-center justify-content-center"
    :backgroundColor="'#' + this.label.color"
    :shadowRadius="1"
    :shadowBlur="4"
    v-bind="$attrs"
    v-on="$listeners"
    disableHover
  >
    <div class="badge badge-pill " :style="style">
      <span v-if="label.name">{{ label.name }}</span>
    </div>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";

export default {
  name: "NeuLabel",
  props: {
    label: { name: String, color: String },
    expanded: { type: Boolean, default: false }
  },
  components: { NeuContainer },
  computed: {
    style() {
      return {
        "--label-bg-color": "#" + this.label.color
      };
    }
  }
};
</script>

<style scoped>
.label {
  min-width: 50px;
  width: 50px;
  min-height: 10px;
}
span {
  color: white;
}
</style>
