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
    <NeuContainer
      v-if="addingTask"
      class="add-task__container mt-3 p-2"
      disableHover
    >
      <div class="d-flex mb-2">
        <SmallAddButton>Etichetta</SmallAddButton>
        <SmallAddButton>Membro</SmallAddButton>
      </div>
      <form @submit.prevent="handleAddingTask">
        <NeuTextarea
          v-model="newTaskTitle"
          placeholder="Inserisci il titolo per questa attività..."
          class="add-task__title mb-2"
          @blur="handleAddingTask"
          @keyup="handleTextareaKeyup"
          autofocus
        />
      </form>
      <div class="d-flex align-items-center">
        <button class="add-task__save px-4 py-1" @click="handleAddingTask">
          Salva
        </button>
        <p class="add-task__close m-0 mx-2" @click="exitAddingTask">
          &times;
        </p>
      </div>
    </NeuContainer>
    <BigAddButton v-if="!addingTask" @click="addTask"
      >Aggiungi una nuova attività</BigAddButton
    >
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuTextarea from "@/components/neu-button/NeuTextarea";
import Task from "@/components/task/Task";
import BigAddButton from "./BigAddButton";
import SmallAddButton from "./SmallAddButton";
import draggable from "vuedraggable";

export default {
  name: "Section",
  props: { title: String, tasks: Array },
  components: {
    NeuContainer,
    Task,
    BigAddButton,
    SmallAddButton,
    NeuTextarea,
    draggable
  },
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
    handleAddingTask() {
      this.addingTask = false;
      this.newTaskTitle = this.newTaskTitle.trim();
      if (this.newTaskTitle.length !== 0) {
        this.tasks.push({ id: 123, title: this.newTaskTitle, label: null });
        this.newTaskTitle = "";
      }
    },
    exitAddingTask() {
      this.addingTask = false;
      this.newTaskTitle = "";
    },
    handleTextareaKeyup(event) {
      if (event.keyCode === 13) this.handleAddingTask();
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
  color: #1c4885;
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
  min-height: 80px !important;
}

.add-task__container {
  border: 1px solid #1c4885;
}

.add-task__save,
.add-task__save:focus {
  background-color: #1c4885;
  border: none;
  color: white;
  border-radius: 10px;
  font-size: 18px;
  outline: none;
}
.add-task__save:hover {
  box-shadow: 2px 2px 6px #133f7c, -2px -2px 6px #2d5fa5;
}
.add-task__close {
  cursor: pointer;
  font-size: 30px;
  line-height: 20px;
}
.add-task__close:hover {
  color: rgb(211, 76, 76) !important;
}
</style>
