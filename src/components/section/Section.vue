<template>
  <NeuContainer class="activity__section">
    <p>{{ title }}</p>
    <Task
      class="my-3 p-2"
      v-for="task in tasks"
      :key="task.id"
      :title="task.title"
    />
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import Task from "@/components/task/Task";

export default {
  name: "Section",
  props: ["title", "tasks"],
  components: { NeuContainer, Task }
};
</script>

<style scoped>
.activity__section {
  width: 300px;
}
</style>
