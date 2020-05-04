<template>
  <NeuContainer class="activity__section" disableHover>
    <p class="m-0">{{ title }}</p>
    <draggable
      v-model="list"
      :animation="200"
      group="tasks"
      @start="dragging = true"
      @end="dragging = false"
      draggable=".task"
    >
      <Task
        class="mt-3 p-2"
        v-for="task in list"
        :key="task.id"
        :title="task.title"
        :disableHover="dragging"
      />
    </draggable>
    <NeuContainer v-if="addingTask" class="mt-3 p-2" disableHover>
      <NeuInput
        type="text"
        v-model="newTaskTitle"
        placeholder="Titolo"
        class="add-task__title mb-2"
        @blur="handleAddingTaskBlur"
      />
      <NeuTextarea
        v-model="newTaskDescription"
        placeholder="Descrizione"
        class="add-task__description"
      />
    </NeuContainer>
    <AddTask v-if="!addingTask" @click="addTask" />
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuInput from "@/components/neu-button/NeuInput";
import NeuTextarea from "@/components/neu-button/NeuTextarea";
import Task from "@/components/task/Task";
import AddTask from "./AddTask";
import draggable from "vuedraggable";

export default {
  name: "Section",
  props: { title: String, tasks: Array },
  components: { NeuContainer, Task, AddTask, NeuInput, NeuTextarea, draggable },
  data() {
    return {
      list: this.tasks,
      newTaskTitle: "",
      newTaskDescription: "",
      addingTask: false,
      dragging: false
    };
  },
  methods: {
    addTask() {
      this.addingTask = true;
    },
    handleAddingTaskBlur() {
      this.addingTask = false;
      this.newTaskTitle = this.newTaskTitle.trim();
      if (this.newTaskTitle.length !== 0) {
        this.tasks.push({ id: 123, title: this.newTaskTitle, label: null });
        this.newTaskTitle = "";
      }
    }
  }
};
</script>

<style>
.activity__section {
  width: 300px;
  height: auto;
}
.activity__section > p:first-child {
  color: #2f80ed;
}
.neu-input {
  border-radius: 10px !important;
}
.neu-input input,
.neu-input input:focus {
  height: 30px;
  line-height: 30px;
  padding-left: 10px !important;
}
.neu-textarea {
  border-radius: 10px !important;
}
.neu-textarea textarea {
  padding-left: 10px !important;
}
</style>
