<template>
  <FileDropArea
    @file-enter="draggingFile = true"
    @file-leave="draggingFile = false"
    @file-drop="onFileDrop"
  >
    <NeuContainer
      class="task-inspector px-5 py-4"
      :class="{ 'drag-over': draggingFile }"
      disableHover
    >
      <div class="attachments-drop" v-if="draggingFile">
        📎 Rilascia per aggiungere come allegato 📎
      </div>
      <button
        type="button"
        class="close d-block d-lg-none p-2"
        aria-label="Close"
        @click="$emit('hide')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <div class="row align-items-center justify-content-center">
        <NeuInput
          class="highlight font-weight-bold my-2 mx-3 col-12 col-xl p-0 pb-2 pb-md-0"
          v-model="task.title"
          @blur="setTitle"
        />
        <div class="px-2 col-auto col-xl-auto">
          <NeuButton
            class="px-2"
            :backgroundColor="task.completed ? '#1c4885' : '#efeeee'"
            :color="task.completed ? 'white' : '#787878'"
            :shadowRadius="task.completed ? 1 : 5"
            :shadowBlur="task.completed ? 5 : 10"
            @click.stop="onComplete"
            >✔️ {{ task.completed ? "Completato" : "Completa" }}</NeuButton
          >
        </div>
        <div class="px-2 col-auto col-xl-auto">
          <NeuButton class="px-2" @click="onDelete">🗑️ Elimina</NeuButton>
        </div>
      </div>
      <NeuTextarea
        class="my-4 mb-4"
        v-model="task.description"
        @blur="setDescription"
        placeholder="Inserisci qui una descrizione dell'attività..."
      ></NeuTextarea>
      <div class="row mb-4">
        <div class="col-12 col-xl-6 d-flex align-items-center pb-3">
          <p class="col-auto highlight m-0 pr-3 text-nowrap">
            🏷️ Etichetta:
          </p>
          <div class="dropdown col">
            <div
              class="w-100"
              id="labelsDropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <Label
                v-if="task.label"
                class="w-100"
                :label="workgroupLabels.find(l => task.label === l.id)"
                showName
              />
              <BigAddButton v-else class="w-100">Aggiungi label</BigAddButton>
            </div>
            <LabelDropdown
              aria-labelledby="labelsDropdown"
              :idLabel="task.label"
              @selected="setLabel"
            />
          </div>
        </div>
        <div class="col-12 col-xl-6 d-flex align-items-center pb-3">
          <p class="col-auto highlight m-0 pr-3 text-nowrap">📅 Scadenza:</p>
          <div class="col p-0" style="min-width: 0px">
            <NeuInput
              type="date"
              class="mb-1"
              v-model="deadlineDate"
              @blur="setDeadline"
            />
            <NeuInput
              type="time"
              class="mt-1"
              v-model="deadlineTime"
              @blur="setDeadline"
            />
          </div>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-12 col-md-6 pb-3 pb-md-0">
          <p class="col-auto highlight m-0 pb-2 pr-3 text-nowrap">
            📎 Allegati:
          </p>
          <TaskAttachment
            class="my-2"
            v-for="(attachment, index) in task.attachments"
            :key="index"
            :attachment="attachment"
            @delete="removeAttachment(attachment)"
          />
          <BigAddButton class="col mt-2" @click="$refs.file.click()">
            Aggiungi un nuovo allegato
          </BigAddButton>
          <input
            class="d-none"
            ref="file"
            type="file"
            @change="onFileDrop($refs.file.files)"
          />
        </div>
        <div class="col-12 col-md-6 pb-3 pb-md-0">
          <p class="col-auto highlight m-0 pb-2 pr-3 text-nowrap">🧑‍🤝‍🧑 Membri:</p>
          <Member
            v-for="member in workgroupMembers.filter(m =>
              task.members.includes(m.id)
            )"
            :key="member.id"
            :member="member"
            @remove="removeMember"
          />
          <div class="dropdown justify-content-center">
            <BigAddButton
              class="col mt-2"
              id="membersDropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Aggiungi un nuovo membro
            </BigAddButton>
            <UserDropdown
              aria-labelledby="membersDropdown"
              :users="workgroupMembers"
              :members="
                workgroupMembers.filter(m => task.members.includes(m.id))
              "
              @select-user="addMember"
            />
          </div>
        </div>
      </div>
    </NeuContainer>
    <Alert
      v-if="alertShowed"
      :message="alertMessage"
      :type="alertType"
      @close="alertShowed"
    />
  </FileDropArea>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuButton from "@/components/neu-button/NeuButton";
import NeuTextarea from "@/components/neu-button/NeuTextarea";
import BigAddButton from "@/components/section/BigAddButton";
import NeuInput from "@/components/neu-button/NeuInput";
import FileDropArea from "./FileDropArea";
import UserDropdown from "./UserDropdown";
import Label from "./Label";
import LabelDropdown from "./LabelDropdown";
import Member from "./Member";
import TaskAttachment from "./TaskAttachment";
import Alert from "@/components/alert/Alert";

import calendarUtils from "@/views/calendar/calendar_utils";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "TaskInspector",
  components: {
    NeuContainer,
    NeuButton,
    BigAddButton,
    FileDropArea,
    UserDropdown,
    Label,
    LabelDropdown,
    NeuInput,
    Member,
    NeuTextarea,
    TaskAttachment,
    Alert
  },
  props: {
    sectionId: Number,
    task: {
      id: Number,
      title: String,
      description: String,
      label: Object,
      deadline: String,
      members: Array,
      attachments: Array
    }
  },
  computed: {
    deadlineString() {
      return this.task.deadline
        ? calendarUtils.dateToString(new Date(this.task.deadline))
        : "Aggiungi";
    },
    deadlineDate: {
      get() {
        // The deadline isn't set
        if (!this.task.deadline) return null;
        return calendarUtils.dateToDateType(new Date(this.task.deadline));
      },
      set(value) {
        const date = this.task.deadline
          ? new Date(this.task.deadline)
          : new Date();
        const array = value.split("-");
        if (array.length != 3) return;
        if (array[2].length > 2) return;
        let intVal = parseInt(array[2]);
        if (intVal < 0 || intVal > 31) return;
        date.setDate(array[2]);
        if (array[1].length > 2) return;
        intVal = parseInt(array[1]);
        if (intVal < 0 || intVal > 12) return;
        date.setMonth(array[1]);
        if (parseInt(array[0]) < 1900) return;
        date.setFullYear(array[0]);
        this.task.deadline = date.getTime();
      }
    },
    deadlineTime: {
      get() {
        // The deadline isn't set
        if (!this.task.deadline) return null;
        return calendarUtils.dateToTimeType(new Date(this.task.deadline));
      },
      set(value) {
        if (!value) return;
        const date = this.task.deadline
          ? new Date(this.task.deadline)
          : new Date();
        const time = value.split(":");
        date.setHours(time[0]);
        date.setMinutes(time[1]);
        this.task.deadline = date;
      }
    },
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
  data() {
    return {
      draggingFile: false,
      alertType: "",
      alertShowed: false,
      alertMessage: ""
    };
  },
  methods: {
    ...mapActions([
      "deleteTask",
      "editTask",
      "uploadAttachment",
      "deleteAttachment"
    ]),
    async onDelete() {
      const { workgroupId } = this.$route.params;
      this.showAlert("info", "Eliminazione in corso...");
      await this.deleteTask({
        workgroupId,
        sectionId: this.sectionId,
        taskId: this.task.id
      });
      this.alertShowed = false;
      this.$emit("hide");
    },
    async onComplete() {
      const { workgroupId } = this.$route.params;
      this.task.completed = !this.task.completed;
      this.showAlert("info", "Operazione in corso...");
      await this.editTask({
        workgroupId,
        sectionId: this.sectionId,
        taskId: this.task.id,
        editObject: { completed: this.task.completed }
      });
      this.alertShowed = false;
      this.$emit("hide");
    },
    async onFileDrop(files) {
      const { workgroupId } = this.$route.params;
      let count = 0;
      for (const file of files) {
        this.showAlert(
          "info",
          "Caricamento dei file in corso..." + count + "/" + files.length
        );
        await this.uploadAttachment({
          workgroupId,
          sectionId: this.sectionId,
          taskId: this.task.id,
          file
        });
        count++;
      }
      this.alertShowed = false;
      this.draggingFile = false;
    },
    async removeAttachment(attachment) {
      const { workgroupId } = this.$route.params;
      this.showAlert("info", "Rimozione dell'allegato in corso...");
      await this.deleteAttachment({
        workgroupId,
        sectionId: this.sectionId,
        taskId: this.task.id,
        file: attachment
      });
      this.alertShowed = false;
    },
    addMember(member) {
      const { workgroupId } = this.$route.params;
      this.task.members.push(member.id);
      this.editTask({
        workgroupId,
        sectionId: this.sectionId,
        taskId: this.task.id,
        editObject: { members: this.task.members }
      });
    },
    removeMember(member) {
      const { workgroupId } = this.$route.params;
      const members = this.task.members.filter(id => id !== member.id);
      this.task.members = members;
      this.editTask({
        workgroupId,
        sectionId: this.sectionId,
        taskId: this.task.id,
        editObject: { members }
      });
    },
    setLabel(label) {
      const { workgroupId } = this.$route.params;
      if (this.task.label !== null && this.task.label === label.id) {
        // Remove label
        this.task.label = null;
        this.editTask({
          workgroupId,
          sectionId: this.sectionId,
          taskId: this.task.id,
          editObject: { label: null }
        });
      } else {
        // Set new label
        this.task.label = label.id;
        this.editTask({
          workgroupId,
          sectionId: this.sectionId,
          taskId: this.task.id,
          editObject: { label: this.task.label }
        });
      }
    },
    setDescription() {
      const { workgroupId } = this.$route.params;
      this.editTask({
        workgroupId,
        sectionId: this.sectionId,
        taskId: this.task.id,
        editObject: { description: this.task.description }
      });
    },
    setTitle() {
      const { workgroupId } = this.$route.params;
      this.editTask({
        workgroupId,
        sectionId: this.sectionId,
        taskId: this.task.id,
        editObject: { title: this.task.title }
      });
    },
    setDeadline() {
      const { workgroupId } = this.$route.params;
      this.editTask({
        workgroupId,
        sectionId: this.sectionId,
        taskId: this.task.id,
        editObject: { deadline: this.task.deadline }
      });
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
.drag-over {
  border: 4px dashed var(--file-drop-border) !important;
}
.task-inspector .completed {
  color: var(--text-color-primary);
}

.attachments-drop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  background-color: var(--background-color);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.task-inspector {
  position: fixed;
  top: 45%;
  left: 50%;
  min-width: 600px;
  width: 60%;
  max-width: 800px;
  transform: translate(-50%, -50%);
  z-index: 100;
  border: 4px dotted transparent;
}
@media (max-width: 768px) {
  .task-inspector {
    min-width: 0;
    width: 100vw;
    height: 100vh;
    top: 50%;
    overflow: auto;
  }
}

.task-inspector .neu-input > input,
.task-inspector .neu-textarea > textarea,
.highlight {
  color: var(--primary) !important;
}
.task-inspector .neu-button,
.task-inspector .neu-input > input {
  height: 40px;
}
.task-inspector .neu-button > button {
  font-size: medium;
}

.task-inspector .label {
  font-size: 16px;
  line-height: 30px;
  height: 30px;
  cursor: pointer;
  user-select: none;
  transition: transform 200ms;
}
.task-inspector .label:active {
  transform: scale(0.9);
}
</style>
