<template>
  <NeuContainer class="task">
    <div class="task__label"></div>
    {{ title }}
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";

export default {
  name: "Task",
  props: ["title", "label"],
  components: { NeuContainer }
};
</script>

<style></style>
