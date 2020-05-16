<template>
  <div
    class="actions col-lg-auto d-none d-lg-flex flex-column justify-content-center py-2"
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
        disableHover
        style="border: none; margin-right: 10px; margin-bottom: 10px;"
        class="dropdown-menu"
        aria-labelledby="workgroupDropdownBtn"
      >
        <a class="dropdown-item m-0">
          Cambia immagine workgroup...
        </a>
        <a class="dropdown-item m-0">
          Gestisci membri workgroup...
        </a>
        <a class="dropdown-item m-0">
          Rinomia workgroup...
        </a>
        <a class="dropdown-item m-0 warning" @click.prevent="removeWorkgroup">
          Elimina workgroup...
        </a>
      </NeuContainer>
    </div>
  </div>
</template>

<script>
import Avatar from "@/components/avatar/Avatar";
import NeuContainer from "@/components/neu-button/NeuContainer";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "Actions",
  components: { Avatar, NeuContainer },
  computed: {
    ...mapGetters(["workgroups"]),
    currentWorkgroup() {
      const { workgroupId } = this.$route.params;
      if (this.workgroups)
        return this.workgroups.find(wg => wg.id === parseInt(workgroupId));
      return null;
    }
  },
  methods: {
    ...mapActions(["deleteWorkgroup"]),
    async removeWorkgroup() {
      if (this.workgroups.length === 1) {
        alert("Non puoi eliminare il tuo ultimo gruppo di lavoro");
        return;
      }
      const { workgroupId } = this.$route.params;
      await this.deleteWorkgroup(workgroupId);
      const workgroup = this.workgroups[0];
      this.$router.push(`/${workgroup.id}/drive`);
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
