<template>
  <NeuContainer
    class="task d-flex"
    :disableHover="disableHover"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <Label v-if="task.label" :label="task.label" />
    <div class="flex-grow-1">
      <div class="d-flex align-items-center">
        <p class="m-0 my-1 ml-2 flex-grow-1">
          {{ task.title }}
        </p>
        <p class="m-0">{{ task.completed ? " ✔️" : "" }}</p>
      </div>
      <div class="d-flex justify-content-end">
        <Avatar
          v-for="member in task.members"
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

export default {
  name: "Task",
  props: {
    task: {
      title: String,
      description: String,
      label: Object,
      deadline: Date,
      members: Array,
      attachments: Array,
      completed: Boolean
    },
    disableHover: Boolean
  },
  components: { NeuContainer, Label, Avatar }
};
</script>

<style>
.task {
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
}

.avatar {
  margin-right: -10px;
}
.avatar:last-child {
  margin-right: 0px;
}
</style>
