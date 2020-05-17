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
    <span
      class="col-auto rounded-circle d-flex align-items-center justify-content-center dark-btn"
      @click="changeTheme"
    >
      🌙
    </span>
    <Alert
      v-if="alertShowed"
      :type="alertType"
      :message="alertMessage"
      @close="alertShowed = false"
    />
  </div>
</template>

<script>
import Avatar from "@/components/avatar/Avatar";
import NeuButton from "@/components/neu-button/NeuButton";
import NeuContainer from "@/components/neu-button/NeuContainer";
import Loading from "@/components/loading/Loading";
import Alert from "@/components/alert/Alert";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "UserInfo",
  components: { Avatar, NeuButton, NeuContainer, Loading, Alert },
  data() {
    return {
      alertShowed: false,
      alertType: "",
      alertMessage: ""
    };
  },
  computed: {
    ...mapGetters(["currentUser"])
  },
  async created() {
    if (!this.currentUser) await this.validateUser();
  },
  methods: {
    ...mapActions(["validateUser", "signoutUser", "changeTheme"]),
    async signout() {
      this.showAlert("info", "Disconnessione in corso...");
      await this.signoutUser();
      if (!this.currentUser) this.$router.push("/login");
      else this.showAlert("danger", "Errore nella disconnessione. Riprovare");
    },
    showAlert(type, message) {
      this.alertType = type;
      this.alertMessage = message;
      this.alertShowed = true;
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

.user-info .dark-btn {
  width: 50px;
  height: 50px;
  transition: all 500ms;
  cursor: pointer;
}
.user-info .dark-btn:hover {
  background-color: rgba(0, 0, 0, 0.6);
}
</style>
