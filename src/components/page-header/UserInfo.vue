<template>
  <Loading v-if="!currentUser" show hideMessage />
  <div v-else class="d-flex align-items-center user-info">
    <NeuContainer class="d-flex align-items-center p-2 mx-2" disableHover>
      <Avatar
        class="mx-2"
        :firstname="currentUser.firstname"
        :lastname="currentUser.lastname"
      />
      <p class="m-0 mr-5">{{ currentUser.firstname }}</p>
    </NeuContainer>
    <NeuButton class="p-2 mx-2" @click="signout">
      <p class="m-0 w-100 text-center">Esci</p>
    </NeuButton>
  </div>
</template>

<script>
import Avatar from "@/components/avatar/Avatar";
import NeuButton from "@/components/neu-button/NeuButton";
import NeuContainer from "@/components/neu-button/NeuContainer";
import Loading from "@/components/loading/Loading";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "UserInfo",
  components: { Avatar, NeuButton, NeuContainer, Loading },
  computed: {
    ...mapGetters(["currentUser"])
  },
  async created() {
    if (!this.currentUser) await this.validateUser();
  },
  methods: {
    ...mapActions(["validateUser", "signoutUser"]),
    async signout() {
      const result = await this.signoutUser();
      if (result) this.$router.push("/login");
    }
  }
};
</script>

<style>
.user-info {
  font-size: 20px;
}

.user-info .neu-button button {
  width: 100px;
}
</style>
