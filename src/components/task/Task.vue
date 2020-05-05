<template>
  <NeuContainer class="task" :disableHover="disableHover">
    <Label name="prova" />
    <p class="m-0 my-1">{{ title }}</p>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import Label from "./Label";

export default {
  name: "Task",
  props: { title: String, disableHover: Boolean },
  components: { NeuContainer, Label }
};
</script>

<style>
.task {
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
