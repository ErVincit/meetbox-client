<template>
  <NeuContainer
    class="task d-flex"
    :disableHover="disableHover"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <Label v-if="task.label" :label="label" />
    <div class="flex-grow-1">
      <div class="d-flex align-items-center">
        <p class="m-0 my-1 ml-2 flex-grow-1">
          {{ task.title }}
        </p>
        <p class="m-0">{{ task.completed ? " ✔️" : "" }}</p>
      </div>
      <div class="d-flex justify-content-end">
        <Avatar
          v-for="member in members"
          :key="member.id"
          :firstname="member.firstname"
          :lastname="member.lastname"
        />
      </div>
    </div>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import Label from "./Label";
import Avatar from "@/components/avatar/Avatar";

import { mapGetters } from "vuex";

export default {
  name: "Task",
  props: {
    task: {
      title: String,
      description: String,
      label: Number,
      deadline: Date,
      members: Array,
      attachments: Array,
      completed: Boolean
    },
    disableHover: Boolean
  },
  components: { NeuContainer, Label, Avatar },
  computed: {
    ...mapGetters(["workgroups"]),
    currentWorkgroup() {
      const { workgroupId } = this.$route.params;
      if (this.workgroups)
        return this.workgroups.find(wg => wg.id === parseInt(workgroupId));
      return null;
    },
    members() {
      return this.currentWorkgroup.members.filter(m =>
        this.task.members.includes(m.id)
      );
    },
    label() {
      return this.currentWorkgroup.labels.find(
        label => label.id === this.task.label
      );
    }
  }
};
</script>

<style>
.task {
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
}

.task .avatar {
  margin-right: -10px;
}
.task .avatar:last-child {
  margin-right: 0px;
}
</style>
