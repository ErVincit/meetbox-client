<template>
  <NeuContainer class="activity__section" disableHover>
    <div class="d-flex align-items-center">
      <p class="m-0">📑</p>
      <NeuInput
        class="m-0 col rounded-pill p-0"
        v-model="section.title"
        @blur="setTitle"
        backgroundHidden
      />
      <div class="dropdown col-auto px-2">
        <button
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <img src="@/assets/kebab-icon.svg" />
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <p class="dropdown-item m-0 warning">
            Elimina
          </p>
        </div>
      </div>
    </div>
    <draggable
      :list="section.tasks"
      :animation="200"
      group="tasks"
      @start="handleDragStart"
      @change="handleTaskMove"
      @end="handleDragEnd"
      draggable=".task"
    >
      <Task
        class="mt-3 p-2"
        v-for="task in section.tasks"
        :key="task.id"
        :task="task"
        :disableHover="dragging"
        @click.stop="$emit('showTask', task)"
      />
    </draggable>
    <div class="add-task__container" ref="add-task__container">
      <NeuContainer v-if="addingTask" class="add-task mt-3 p-2" disableHover>
        <div class="d-flex mb-2">
          <SmallAddButton>Etichetta</SmallAddButton>
          <SmallAddButton @click="showUserDropdown = true"
            >Membro</SmallAddButton
          >
          <UserDropdown
            v-if="showUserDropdown"
            :users="workgroupMembers"
            @select-user="addNewTaskMember"
            @hide="showUserDropdown = false"
          />
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
      <BigAddButton class="mt-3" v-else @click.stop="addingTask = true"
        >Aggiungi una nuova attività</BigAddButton
      >
      <Alert
        :show="showAlert"
        :message="alertMessage"
        @close="showAlert = false"
      />
    </div>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuTextarea from "@/components/neu-button/NeuTextarea";
import NeuInput from "@/components/neu-button/NeuInput";
import Task from "@/components/task/Task";
import BigAddButton from "./BigAddButton";
import SmallAddButton from "./SmallAddButton";
import Avatar from "@/components/avatar/Avatar";
import Alert from "@/components/alert/Alert";
import UserDropdown from "@/components/task/UserDropdown";

import { mapActions, mapGetters } from "vuex";
import draggable from "vuedraggable";

const handleOutsideClick = function(event) {
  if (!this.addingTask) return;
  const addTaskContainer = this.$refs["add-task__container"];
  if (addTaskContainer && !addTaskContainer.contains(event.target))
    this.addingTask = false;
};

export default {
  name: "Section",
  props: { section: { id: Number, title: String, tasks: Array } },
  components: {
    NeuContainer,
    Task,
    BigAddButton,
    SmallAddButton,
    NeuTextarea,
    NeuInput,
    Avatar,
    Alert,
    UserDropdown,
    draggable
  },
  data() {
    return {
      newTaskTitle: "",
      newTaskMembers: [],
      addingTask: false,
      showAlert: false,
      alertMessage: "",
      showUserDropdown: false,
      dragging: false
    };
  },
  mounted() {
    document.addEventListener("click", handleOutsideClick.bind(this));
  },
  destroyed() {
    document.removeEventListener("click", handleOutsideClick.bind(this));
  },
  computed: {
    ...mapGetters(["workgroups"]),
    workgroupMembers() {
      const { workgroupId } = this.$route.params;
      return this.workgroups.find(wg => wg.id === parseInt(workgroupId))
        .members;
    },
    workgroupLabels() {
      const { workgroupId } = this.$route.params;
      return this.workgroups.find(wg => wg.id === parseInt(workgroupId)).labels;
    }
  },
  methods: {
    ...mapActions(["addTask", "editTask", "editSection"]),
    addNewTaskMember(member) {
      this.newTaskMembers.push(member);
      this.showUserDropdown = false;
    },
    handleAddingTask() {
      this.addingTask = false;
      this.newTaskTitle = this.newTaskTitle.trim();
      if (this.newTaskTitle.length !== 0) {
        const { workgroupId } = this.$route.params;
        this.addTask({
          workgroupId,
          sectionId: this.section.id,
          task: {
            title: this.newTaskTitle,
            label: null,
            members: this.newTaskMembers
          }
        }).catch(err => {
          this.alertMessage = "Creazione task fallita. " + err.message;
          this.showAlert = true;
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
    },
    handleDragStart({ oldDraggableIndex }) {
      this.dragging = true;
      this.$emit("drag-start", this.section.tasks[oldDraggableIndex]);
    },
    async handleTaskMove({ added, moved }) {
      const { workgroupId } = this.$route.params;
      if (added) {
        // Change task's section
        await this.editTask({
          workgroupId,
          sectionId: added.element.section,
          taskId: added.element.id,
          editObject: { section: this.section.id, index: added.newIndex }
        });
      }

      if (moved) {
        // Change task's index
        this.editTask({
          workgroupId,
          sectionId: this.section.id,
          taskId: moved.element.id,
          editObject: { index: moved.newIndex }
        });
      }
    },
    handleDragEnd() {
      this.dragging = false;
      this.$emit("drag-end");
    },
    setTitle() {
      const { workgroupId } = this.$route.params;
      this.editSection({
        workgroupId,
        sectionId: this.section.id,
        editObject: { title: this.section.title }
      });
    }
  }
};
</script>

<style>
.activity__section {
  width: 300px;
}
.activity__section .neu-input > input {
  color: #1c4885;
  font-size: 16px;
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
.dropdown > button {
  border: none;
  outline: none;
}
.dropdown img {
  width: 20px;
  height: 20px;
}
.dropdown-item {
  cursor: pointer;
}
.dropdown-item.warning {
  color: orangered;
}
.dropdown-item:active,
.dropdown-item:hover {
  color: white;
  background-color: orangered;
}
</style>
