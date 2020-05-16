<template>
  <div style="height: 100px">
    <nav class="navbar d-none d-lg-flex h-100">
      <a class="text-left p-0" href="/"><Logo class="col"/></a> <UserInfo />
    </nav>
    <nav class="d-flex d-lg-none align-items-center h-100">
      <NeuContainer
        class="d-flex justify-content-center align-items-center"
        style="width: 50px; height: 50px; cursor: pointer"
      >
        <img src="@/assets/hamburger.svg" @click="$emit('open-navbar')"
      /></NeuContainer>
      <div class="col-9"><slot /></div>
      <div
        class="dropdown d-flex flex-column justify-content-center align-items-center py-3"
      >
        <NeuContainer
          class="d-flex justify-content-center align-items-center"
          id="optionsDropdownBtn"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          style="width: 50px; height: 50px; cursor: pointer"
        >
          <img src="@/assets/kebab-icon.svg" />
        </NeuContainer>
        <NeuContainer
          disableHover
          style="border: none; margin-top: 10px; margin-right: 10px;"
          class="dropdown-menu"
          aria-labelledby="optionsDropdownBtn"
        >
          <a class="dropdown-item m-0" @click="signout">Disconnetti utente</a>
          <a class="dropdown-item m-0">
            Impostazioni workgroup
          </a>
        </NeuContainer>
      </div>
    </nav>
    <Alert
      v-if="alertShowed"
      :type="alertType"
      :message="alertMessage"
      @close="alertShowed = false"
    />
  </div>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import Logo from "@/components/logo/Logo";
import Alert from "@/components/alert/Alert";
import UserInfo from "./UserInfo";

import { mapActions, mapGetters } from "vuex";

export default {
  name: "PageHeader",
  components: { Logo, UserInfo, NeuContainer, Alert },
  data() {
    return {
      alertShowed: false,
      alertType: "",
      alertMessage: ""
    };
  },
  computed: mapGetters(["currentUser"]),
  methods: {
    ...mapActions(["validateUser", "signoutUser"]),
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

<style></style>
