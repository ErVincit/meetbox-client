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
        class="close d-block d-lg-none"
        aria-label="Close"
        @click="$emit('hide')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <div class="row align-items-center justify-content-center">
        <h3 class="highlight font-weight-bold my-2 pb-2 col-12 col-xl">
          {{ task.title }}
        </h3>
        <div class="px-2 col-auto col-xl-auto">
          <NeuButton
            class="px-2"
            :backgroundColor="task.completed ? '#1c4885' : '#efeeee'"
            :color="task.completed ? 'white' : ''"
            :shadowRadius="1"
            :shadowBlur="5"
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
        :value="task.description"
        placeholder="Inserisci qui una descrizione dell'attività..."
      ></NeuTextarea>
      <div class="row mb-4">
        <div class="col-12 col-xl-6 d-flex align-items-center pb-3">
          <p class="col-auto highlight m-0 pr-3 text-nowrap">
            🏷️ Etichetta:
          </p>
          <Label
            class="col"
            v-if="task.label"
            :label="task.label"
            @click="showLabelDropdown = true"
          />
          <BigAddButton v-else class="col" @click="showLabelDropdown = true"
            >Aggiungi label</BigAddButton
          >
        </div>
        <NeuContainer
          v-if="showLabelDropdown"
          class="label-dropdown p-2"
          :shadowRadius="5"
          :shadowBlur="12"
          disableHover
        >
          <button
            type="button"
            class="close"
            aria-label="Close"
            @click.stop="showLabelDropdown = false"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <Label
            class="my-2"
            v-for="label in workgroupLabels"
            :key="label.id"
            :label="label"
            @click.stop="setLabel(label)"
          />
          <BigAddButton>Crea label</BigAddButton>
        </NeuContainer>
        <div class="col-12 col-xl-6 d-flex align-items-center pb-3">
          <p class="col-auto highlight m-0 pr-3 text-nowrap">📅 Scadenza:</p>
          <NeuButton class="col">{{ deadlineString }}</NeuButton>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col-12 col-md-6 pb-3 pb-md-0">
          <p class="col-auto highlight m-0 pb-2 pr-3 text-nowrap">
            📎 Allegati:
          </p>
          <TaskAttachment
            class="my-2"
            v-for="attachment in task.attachments"
            :key="attachment.id"
            :attachment="attachment"
            @delete="removeAttachment"
          />
          <BigAddButton class="col mt-2" @click="$refs.file.click()"
            >Aggiungi un nuovo allegato</BigAddButton
          >
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
            v-for="member in task.members"
            :key="member.id"
            :member="member"
            @remove="removeMember"
          />
          <BigAddButton class="col mt-2" @click="showUserDropdown = true"
            >Aggiungi un nuovo membro</BigAddButton
          >
          <UserDropdown
            v-if="showUserDropdown"
            :users="workgroupMembers"
            @select-user="addMember"
            @hide="showUserDropdown = false"
          />
        </div>
      </div>
    </NeuContainer>
  </FileDropArea>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuButton from "@/components/neu-button/NeuButton";
import NeuTextarea from "@/components/neu-button/NeuTextarea";
import BigAddButton from "@/components/section/BigAddButton";
import FileDropArea from "./FileDropArea";
import UserDropdown from "./UserDropdown";
import Label from "./Label";
// import NeuLabel from "./NeuLabel";
import Member from "./Member";
import TaskAttachment from "./TaskAttachment";

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
    // NeuLabel,
    Member,
    NeuTextarea,
    TaskAttachment
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
      showUserDropdown: false,
      showLabelDropdown: false
    };
  },
  methods: {
    ...mapActions(["deleteTask", "editTask"]),
    onDelete() {
      const { workgroupId } = this.$route.params;
      this.deleteTask({
        workgroupId,
        sectionId: this.sectionId,
        taskId: this.task.id
      });
      this.$emit("hide");
    },
    onComplete() {
      const { workgroupId } = this.$route.params;
      this.task.completed = !this.task.completed;
      this.editTask({
        workgroupId,
        sectionId: this.sectionId,
        taskId: this.task.id,
        editObject: { completed: this.task.completed }
      });
      this.$emit("hide");
    },
    onFileDrop(files) {
      // TODO: upload file to server
      for (const file of files) {
        this.task.attachments.push(file);
        console.log("File uploaded!", file);
      }
      this.draggingFile = false;
    },
    removeAttachment(attachment) {
      this.task.attachments = this.task.attachments.filter(
        file => file !== attachment
      );
    },
    addMember(member) {
      const { workgroupId } = this.$route.params;
      console.log(this.task);
      this.editTask({
        workgroupId,
        sectionId: this.sectionId,
        taskId: this.task.id,
        editObject: { members: [...this.task.members, member].map(m => m.id) }
      });
      this.task.members.push(member);
      this.showDropdown = false;
    },
    removeMember(member) {
      const { workgroupId } = this.$route.params;
      const members = this.task.members.filter(m => m.id !== member.id);
      this.task.members = members;
      this.editTask({
        workgroupId,
        sectionId: this.sectionId,
        taskId: this.task.id,
        editObject: {
          members: members.map(m => m.id)
        }
      });
    },
    setLabel(label) {
      console.log(label);
      const { workgroupId } = this.$route.params;
      if (this.task.label && this.task.label.id === label.id) {
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
        this.task.label = label;
        this.editTask({
          workgroupId,
          sectionId: this.sectionId,
          taskId: this.task.id,
          editObject: { label: label.id }
        });
      }
      // this.showLabelDropdown = false;
    }
  }
};
</script>

<style>
.drag-over {
  border: 4px dashed purple !important;
}
.task-inspector .completed {
  color: white;
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
  overflow: auto;
}
@media (max-width: 768px) {
  .task-inspector {
    min-width: 0;
    width: 100vw;
    height: 100vh;
    top: 50%;
  }
}

.highlight {
  color: #1c4885;
}
.task-inspector .neu-button {
  height: 40px;
}
.task-inspector .neu-button > button {
  font-size: medium;
}
.task-inspector li {
  list-style: none;
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

.task-inspector .label-dropdown {
  position: absolute;
  margin-top: 50px;
  width: 300px;
  z-index: 2000;
}
.task-inspector .label-dropdown .label {
  height: 30px;
  width: 100%;
  font-size: 16px;
  transition: all 200ms;
}
.task-inspector .label-dropdown .label:hover {
  opacity: 0.8;
  transform: scale(0.9);
}
</style>
