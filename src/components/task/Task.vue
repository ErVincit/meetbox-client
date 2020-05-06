<template>
  <NeuContainer
    class="task"
    :disableHover="disableHover"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <Label name="prova" />
    <p class="m-0 my-1">{{ task.title }}</p>
    <div class="d-flex justify-content-end">
      <Avatar
        v-for="member in task.members"
        :key="member.id"
        :firstname="member.firstname"
        :lastname="member.lastname"
      />
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
      label: Number,
      deadline: Date,
      members: Array,
      attachments: Array
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
