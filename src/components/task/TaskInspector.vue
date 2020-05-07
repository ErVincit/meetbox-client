<template>
  <NeuContainer class="task-inspector w-50 px-5 py-4" disableHover>
    <div class="d-flex align-items-center">
      <h3 class="hightlight font-weight-bold my-2 flex-grow-1">
        {{ task.title }}
      </h3>
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
          {{ attachment }}
        </li>
        <BigAddButton>Aggiungi un nuovo allegato</BigAddButton>
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
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuButton from "@/components/neu-button/NeuButton";
import BigAddButton from "@/components/section/BigAddButton";
import Avatar from "@/components/avatar/Avatar";

import calendarUtils from "@/views/calendar/calendar_utils";
import { mapActions } from "vuex";

export default {
  name: "TaskInspector",
  components: { NeuContainer, NeuButton, BigAddButton, Avatar },
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
  methods: {
    ...mapActions(["deleteTask"]),
    onDelete() {
      const { workgroupId } = this.$route.params;
      this.deleteTask({
        workgroupId,
        sectionId: this.sectionId,
        taskId: this.task.id
      });
      this.$emit("hide");
    },
    removeMember(index) {
      this.task.members.splice(index, 1);
    }
  }
};
</script>

<style>
.task-inspector {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
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
