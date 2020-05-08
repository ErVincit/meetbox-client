<template>
  <FileDropArea
    @file-enter="draggingFile = true"
    @file-leave="draggingFile = false"
    @file-drop="onFileDrop"
  >
    <NeuContainer
      class="task-inspector w-50 px-5 py-4"
      :class="{ 'drag-over': draggingFile }"
      disableHover
    >
      <div class="attachments-drop" v-if="draggingFile">
        📎 Rilascia per aggiungere come allegato 📎
      </div>
      <div class="d-flex align-items-center">
        <h3 class="hightlight font-weight-bold my-2 flex-grow-1">
          {{ task.title }}
        </h3>
        <NeuButton class="px-2 mx-2 completed" @click="onComplete"
          >Completa</NeuButton
        >
        <NeuButton class="px-2" @click="onDelete">Elimina</NeuButton>
      </div>
      <p class="my-4 mb-5">{{ task.description }}</p>
      <div class="d-flex justify-content-between my-2 mb-5">
        <div class="flex-grow-1 pr-2">
          <p class="hightlight">🏷️ Etichetta:</p>
          <NeuButton
            class="rounded-pill"
            backgroundColor="#EB5757"
            color="white"
            :shadowRadius="0"
            :shadowBlur="0"
            >{{ "Importante" }}</NeuButton
          >
        </div>
        <div class="flex-grow-1 pl-2">
          <p class="hightlight">📅 Scadenza:</p>
          <NeuButton>{{ deadlineString }}</NeuButton>
        </div>
      </div>
      <div class="d-flex justify-content-between my-3">
        <div class="flex-grow-1 pr-2">
          <p class="hightlight">📎 Allegati:</p>
          <li v-for="attachment in task.attachments" :key="attachment.id">
            {{ attachment.name }}
          </li>
          <BigAddButton @click="$refs.file.click()"
            >Aggiungi un nuovo allegato</BigAddButton
          >
          <input
            class="d-none"
            ref="file"
            type="file"
            @change="onFileDrop($refs.file.files)"
          />
        </div>
        <div class="flex-grow-1 pl-2">
          <p class="hightlight">🧑‍🤝‍🧑 Membri:</p>
          <li
            v-for="(member, index) in task.members"
            :key="member.id"
            class="d-flex align-items-center"
          >
            <Avatar
              class="mr-2"
              :firstname="member.firstname"
              :lastname="member.lastname"
            />
            {{ member.firstname }} {{ member.lastname }}
            <span class="ml-auto mr-2" @click.stop="removeMember(index)"
              >&times;</span
            >
          </li>
          <BigAddButton>Aggiungi un nuovo membro</BigAddButton>
        </div>
      </div>
    </NeuContainer>
  </FileDropArea>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuButton from "@/components/neu-button/NeuButton";
import BigAddButton from "@/components/section/BigAddButton";
import Avatar from "@/components/avatar/Avatar";
import FileDropArea from "./FileDropArea";

import calendarUtils from "@/views/calendar/calendar_utils";
import { mapActions } from "vuex";

export default {
  name: "TaskInspector",
  components: { NeuContainer, NeuButton, BigAddButton, Avatar, FileDropArea },
  props: {
    sectionId: Number,
    task: {
      id: Number,
      title: String,
      description: String,
      label: Number,
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
    }
  },
  data() {
    return { draggingFile: false };
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
      this.editTask({
        workgroupId,
        sectionId: this.sectionId,
        taskId: this.task.id,
        editObject: { completed: true }
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
    removeMember(index) {
      this.task.members.splice(index, 1);
    }
  }
};
</script>

<style>
.drag-over {
  border: 4px dashed purple !important;
}
.completed {
  background-color: rgb(211, 76, 76) !important;
  color: white !important;
}
.task-inspector {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  border: 4px dotted transparent;
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
}
.hightlight {
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
.task-inspector span {
  font-size: 25px;
}
.task-inspector span:hover {
  color: rgb(211, 76, 76);
  cursor: pointer;
}
</style>
