<template>
  <NeuContainer class="task">
    <Label :name="label" />
    <p class="m-0 my-1">{{ title }}</p>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import Label from "./Label";

export default {
  name: "Task",
  props: ["title", "label"],
  components: { NeuContainer, Label }
};
</script>

<style>
.task {
  cursor: pointer;
}
</style>
