<template>
  <NeuContainer class="activity__section" disableHover>
    <p class="m-0">{{ title }}</p>
    <Task
      class="my-3 p-2"
      v-for="task in tasks"
      :key="task.id"
      :title="task.title"
      :label="task.label"
    />
    <div class="activity__add-section mt-2">
      <p class="m-0 p-2">Aggiungi una nuova attività</p>
    </div>
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
  height: auto;
}
.activity__section > p:first-child {
  color: #2f80ed;
}
div.activity__add-section {
  text-align: center;
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid lightgrey;
}
div.activity__add-section:hover {
  color: #2f80ed;
  border-color: #2f80ed;
}
</style>
