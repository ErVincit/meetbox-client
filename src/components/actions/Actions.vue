<template>
  <div
    class="actions col col-lg-1 d-none d-lg-flex flex-column justify-content-center py-2"
  >
    <div class="flex-grow-1 d-flex flex-column align-items-center">
      <slot />
    </div>
    <div
      class="d-flex flex-column justify-content-center align-items-center"
      v-if="currentWorkgroup"
    >
      <Avatar
        v-for="member of currentWorkgroup.members"
        :key="member.id"
        :firstname="member.firstname"
        :lastname="member.lastname"
      />
    </div>
    <div
      class="dropdown d-flex flex-column justify-content-center align-items-center py-3"
    >
      <NeuButton
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        style="width: 50px; height: 50px"
      >
        <img src="@/assets/kebab-icon.svg" />
      </NeuButton>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <p class="dropdown-item m-0 warning">
          Elimina workgroup
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from "@/components/avatar/Avatar";
import NeuButton from "@/components/neu-button/NeuButton";

import { mapGetters } from "vuex";

export default {
  name: "Actions",
  components: { Avatar, NeuButton },
  computed: {
    ...mapGetters(["workgroups"]),
    currentWorkgroup() {
      const { workgroupId } = this.$route.params;
      if (this.workgroups)
        return this.workgroups.find(wg => wg.id === parseInt(workgroupId));
      return null;
    }
  }
};
</script>

<style>
.actions .avatar {
  width: 50px;
  height: 50px;
  font-size: 16px;
  margin-bottom: -10px;
  --background-color: #efeeee;
}
.actions .avatar:last-child {
  margin-bottom: 0px;
}
</style>
