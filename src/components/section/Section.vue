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
        :members="task.members"
        :disableHover="dragging"
      />
    </draggable>
    <div class="add-task__container" ref="add-task__container">
      <NeuContainer v-if="addingTask" class="add-task mt-3 p-2" disableHover>
        <div class="d-flex mb-2">
          <SmallAddButton>Etichetta</SmallAddButton>
          <SmallAddButton
            @click="
              newTaskMembers.push({
                id: 12345,
                firstname: 'Mario',
                lastname: 'Gialli'
              })
            "
            >Membro</SmallAddButton
          >
        </div>
        <form @submit.prevent="handleAddingTask">
          <NeuTextarea
            v-model="newTaskTitle"
            placeholder="Inserisci il titolo per questa attività..."
            class="add-task__title mb-2"
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
          <div class="flex-grow-1 d-flex justify-content-end">
            <Avatar
              v-for="member in newTaskMembers"
              :key="member.id"
              :firstname="member.firstname"
              :lastname="member.lastname"
            />
          </div>
        </div>
      </NeuContainer>
      <BigAddButton v-else @click.stop="addingTask = true"
        >Aggiungi una nuova attività</BigAddButton
      >
    </div>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuTextarea from "@/components/neu-button/NeuTextarea";
import Task from "@/components/task/Task";
import BigAddButton from "./BigAddButton";
import SmallAddButton from "./SmallAddButton";
import draggable from "vuedraggable";
import Avatar from "@/components/avatar/Avatar";

const handleOutsideClick = function(event) {
  if (!this.addingTask) return;
  const addTaskContainer = this.$refs["add-task__container"];
  if (!addTaskContainer.contains(event.target)) this.addingTask = false;
};

export default {
  name: "Section",
  props: { title: String, tasks: Array },
  components: {
    NeuContainer,
    Task,
    BigAddButton,
    SmallAddButton,
    NeuTextarea,
    Avatar,
    draggable
  },
  data() {
    return {
      list: this.tasks,
      newTaskTitle: "",
      newTaskMembers: [],
      addingTask: false,
      dragging: false
    };
  },
  mounted() {
    document.addEventListener("click", handleOutsideClick.bind(this));
  },
  destroyed() {
    document.removeEventListener("click", handleOutsideClick.bind(this));
  },
  methods: {
    handleAddingTask() {
      this.addingTask = false;
      this.newTaskTitle = this.newTaskTitle.trim();
      if (this.newTaskTitle.length !== 0) {
        this.tasks.push({
          id: 123 + Math.random() * 100,
          title: this.newTaskTitle,
          label: null,
          members: this.newTaskMembers
        });
        this.newTaskTitle = "";
        this.newTaskMembers = [];
      }
    },
    exitAddingTask() {
      this.addingTask = false;
      this.newTaskTitle = "";
      this.newTaskMembers = [];
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

.add-task {
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
