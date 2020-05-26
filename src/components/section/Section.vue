<template>
  <NeuContainer class="activity__section" disableHover>
    <div class="d-flex align-items-center px-3 pb-2">
      <p class="m-0">📑</p>
      <NeuInput
        class="m-0 col rounded-pill p-0"
        v-model="section.title"
        ref="sectionName"
        @keypress.enter="$refs.sectionName.$el.querySelector('input').blur()"
        @blur="setTitle"
        @focus="$emit('start-editing')"
        backgroundHidden
      />
      <div class="dropdown col-auto px-2">
        <button
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          style="background-color: transparent"
        >
          <img src="@/assets/kebab-icon.svg" />
        </button>
        <NeuContainer
          class="dropdown-menu"
          aria-labelledby="dropdownMenuButton"
          style="border: none"
        >
          <p class="dropdown-item m-0 warning" @click="removeSection">
            Elimina
          </p>
        </NeuContainer>
      </div>
    </div>
    <draggable
      :list="taskList"
      :animation="200"
      group="tasks"
      @start="handleDragStart"
      @change="handleTaskMove"
      @end="handleDragEnd"
      draggable=".task"
      class="flex-grow-1"
      style="overflow: hidden auto; min-height: 20px"
    >
      <Task
        class="mt-3 p-2 mx-3"
        v-for="task in taskList"
        :key="task.id"
        :task="task"
        :disableHover="dragging"
        @click.stop="$emit('showTask', task)"
      />
    </draggable>
    <NeuContainer v-if="waitingAddTask" class="mx-3 mb-3">
      <Loading :show="waitingAddTask" hideMessage />
    </NeuContainer>
    <div class="add-task__container px-3" ref="add-task__container">
      <NeuContainer v-if="addingTask" class="add-task p-2" disableHover>
        <div class="d-flex mb-2 align-items-center">
          <div class="dropdown">
            <div id="labelsDropdown" data-toggle="dropdown">
              <Label v-if="newTaskLabel" :label="newTaskLabel" showName />
              <SmallAddButton v-else>
                Etichetta
              </SmallAddButton>
            </div>
            <LabelDropdown
              :idLabel="newTaskLabel ? newTaskLabel.id : null"
              @selected="addNewTaskLabel"
              ref="labelsDropdownBtn"
              aria-labelledby="labelsDropdown"
            />
          </div>
          <div class="dropdown">
            <SmallAddButton
              id="membersDropdown"
              data-toggle="dropdown"
              ref="membersDropdownBtn"
            >
              Membro
            </SmallAddButton>
            <UserDropdown
              aria-labelledby="membersDropdown"
              :users="workgroupMembers"
              :members="newTaskMembers"
              @select-user="addNewTaskMember"
            />
          </div>
        </div>
        <form @submit.prevent="handleAddingTask">
          <NeuTextarea
            ref="addTextarea"
            v-model="newTaskTitle"
            placeholder="Inserisci il titolo per questa attività..."
            class="add-task__title mb-2"
            @keypress.enter="handleAddingTask"
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
      <BigAddButton v-else @click.stop="startAddingTask">
        Aggiungi una nuova attività
      </BigAddButton>
      <Alert
        v-if="alertShowed"
        :message="alertMessage"
        @close="alertShowed = false"
        :type="alertType"
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
import Label from "@/components/task/Label";
import LabelDropdown from "@/components/task/LabelDropdown";
import UserDropdown from "@/components/task/UserDropdown";
import Loading from "@/components/loading/Loading";

import { mapActions, mapGetters } from "vuex";
import draggable from "vuedraggable";

const handleOutsideClick = function(event) {
  if (!this.addingTask) return;
  const addTaskContainer = this.$refs["add-task__container"];
  if (addTaskContainer && !addTaskContainer.contains(event.target)) {
    this.addingTask = false;
    this.$emit("end-editing");
  }
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
    Label,
    LabelDropdown,
    Loading,
    draggable
  },
  data() {
    return {
      newTaskTitle: "",
      newTaskMembers: [],
      newTaskLabel: null,
      addingTask: false,
      alertShowed: false,
      alertMessage: "",
      alertType: "",
      dragging: false,
      waitingAddTask: false,
      taskList: this.section.tasks
    };
  },
  watch: {
    section(value) {
      this.taskList = value.tasks;
    }
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
    ...mapActions(["addTask", "editTask", "editSection", "deleteSection"]),
    addNewTaskMember(member) {
      this.newTaskMembers.push(member);
      this.$refs.membersDropdownBtn.$el.click();
    },
    addNewTaskLabel(label) {
      this.newTaskLabel = label === this.newTaskLabel ? null : label;
      this.$refs.labelsDropdownBtn.$el.click();
    },
    startAddingTask() {
      this.addingTask = true;
      this.$nextTick(() =>
        this.$refs.addTextarea.$el.querySelector("textarea").focus()
      );
      this.$emit("start-editing");
    },
    async handleAddingTask() {
      this.addingTask = false;
      this.$emit("end-editing");
      this.newTaskTitle = this.newTaskTitle.trim();
      if (this.newTaskTitle.length !== 0) {
        this.waitingAddTask = true;
        const { workgroupId } = this.$route.params;
        this.showAlert("info", "Aggiunta in corso...");
        this.addTask({
          workgroupId,
          sectionId: this.section.id,
          task: {
            title: this.newTaskTitle,
            label: this.newTaskLabel ? this.newTaskLabel.id : null,
            members: this.newTaskMembers.map(m => m.id)
          }
        })
          .then(() => {
            this.waitingAddTask = false;
            this.alertShowed = false;
          })
          .catch(err => {
            this.alertMessage = "Creazione task fallita. " + err.message;
            this.showAlert = true;
          });
        this.newTaskTitle = "";
        this.newTaskMembers = [];
        this.newTaskLabel = null;
      }
    },
    exitAddingTask() {
      this.addingTask = false;
      this.$emit("end-editing");
      this.newTaskTitle = "";
      this.newTaskMembers = [];
      this.newTaskLabel = null;
    },
    handleDragStart({ oldDraggableIndex }) {
      this.dragging = true;
      this.$emit("drag-start", this.section.tasks[oldDraggableIndex]);
    },
    async handleTaskMove({ added, moved }) {
      const { workgroupId } = this.$route.params;
      if (added) {
        // Change task's section
        console.debug("Aggiungo elemento", added.element);
        console.debug("alla sezione", this.section.id);
        console.debug("all'indice", added.newIndex);

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
    async setTitle() {
      const { workgroupId } = this.$route.params;
      await this.editSection({
        workgroupId,
        sectionId: this.section.id,
        editObject: { title: this.section.title }
      });
      this.$emit("end-editing");
    },
    async removeSection() {
      const { workgroupId } = this.$route.params;
      this.showAlert("info", "Rimozione in corso...");
      await this.deleteSection({
        workgroupId,
        sectionId: this.section.id
      });
      this.alertShowed = false;
    },
    showAlert(type, message) {
      this.alertType = type;
      this.alertMessage = message;
      this.alertShowed = true;
    }
  }
};
</script>

<style>
.activity__section {
  width: 300px;
}
.activity__section .neu-input > input {
  color: var(--primary);
  font-size: 16px;
}
.activity__section .task:last-child {
  margin-bottom: 16px;
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
  border: 1px solid var(--primary);
}
.add-task__save,
.add-task__save:focus {
  background-color: var(--primary);
  border: none;
  color: var(--text-color-primary);
  border-radius: 10px;
  font-size: 18px;
  outline: none;
}
.add-task__close {
  cursor: pointer;
  font-size: 30px;
  line-height: 20px;
}
.add-task__close:hover {
  color: rgb(211, 76, 76) !important;
}
.add-task .avatar {
  margin-right: -10px;
}
.add-task .avatar:last-child {
  margin-right: 0px;
}
.add-task .label {
  width: 80px;
  height: 26px;
  cursor: pointer;
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
  color: var(--danger);
}
.dropdown-item:active,
.dropdown-item:hover {
  color: var(--text-color-primary);
  background-color: var(--danger);
}
</style>
