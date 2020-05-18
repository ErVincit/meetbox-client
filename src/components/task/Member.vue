<template>
  <div
    class="member d-flex align-items-center"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <Avatar
      class="mr-2"
      :firstname="member.firstname"
      :lastname="member.lastname"
    />
    {{ member.firstname }} {{ member.lastname }}
    <button
      v-if="!dontClose"
      type="button"
      class="close ml-auto mr-2"
      aria-label="Close"
      @click.stop="$emit('remove', member)"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
import Avatar from "@/components/avatar/Avatar";

export default {
  name: "Member",
  props: {
    member: { id: Number, fistname: String, lastname: String },
    dontClose: { type: Boolean, default: false }
  },
  components: { Avatar }
};
</script>

<style scoped>
.member {
  color: var(--text-color-bg);
}

.close:hover {
  color: var(--danger);
  cursor: pointer;
}
</style>
