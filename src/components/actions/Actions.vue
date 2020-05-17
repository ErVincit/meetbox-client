<template>
  <div
    class="actions col-lg-auto d-none d-lg-flex flex-column justify-content-center py-2"
  >
    <div class="flex-grow-1 d-flex flex-column align-items-center">
      <slot />
    </div>
    <div
      class="d-flex flex-column justify-content-center align-items-center members"
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
      class="dropleft d-flex flex-column justify-content-center align-items-center py-3"
    >
      <NeuContainer
        class="d-flex justify-content-center align-items-center"
        id="workgroupDropdownBtn"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        style="width: 50px; height: 50px; cursor: pointer"
      >
        <img src="@/assets/kebab-icon.svg" />
      </NeuContainer>
      <NeuContainer
        class="dropdown-menu px-2"
        aria-labelledby="workgroupDropdownBtn"
      >
        <li
          class="dropdown-item m-0 px-3 rounded-pill"
          @click="showSettings = true"
        >
          Impostazioni workgroup
        </li>
      </NeuContainer>
      <WorkgroupSettings v-if="showSettings" @exit="showSettings = false" />
    </div>
  </div>
</template>

<script>
import Avatar from "@/components/avatar/Avatar";
import NeuContainer from "@/components/neu-button/NeuContainer";
import WorkgroupSettings from "./WorkgroupSettings";

import { mapGetters } from "vuex";

export default {
  name: "Actions",
  components: { Avatar, NeuContainer, WorkgroupSettings },
  data() {
    return { showSettings: false };
  },
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
.actions .members .avatar {
  width: 50px;
  height: 50px;
  font-size: 16px;
  margin-bottom: -10px;
  --background-color: var(--primary-bg-color);
}
.actions .members .avatar:last-child {
  margin-bottom: 0px;
}
.actions .dropdown-menu {
  border: none;
  margin-right: 10px;
  margin-bottom: 10px;
}
.actions .dropdown-item {
  color: var(--text-color-bg);
}
.actions .dropdown-item:hover {
  background-color: var(--primary);
  color: var(--text-color-primary);
}
</style>
