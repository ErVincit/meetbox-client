<template>
  <div class="d-flex align-items-center">
    <Avatar
      class="mr-2"
      :firstname="member.firstname"
      :lastname="member.lastname"
    />
    {{ member.firstname }} {{ member.lastname }}
    <button
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
  props: { member: { id: Number, fistname: String, lastname: String } },
  components: { Avatar }
};
</script>

<style scoped>
.close:hover {
  color: orangered;
  cursor: pointer;
}
</style>
