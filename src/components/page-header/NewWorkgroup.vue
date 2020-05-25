<template>
  <NeuContainer class="new-workgroup" disableHover>
    <div style="position: relative">
      <p class=" mb-0 highlight" style="line-height: 30px; font-size: 1.5rem">
        Crea workgroup
      </p>
      <button type="button" class="close" aria-label="Close" @click.stop="exit">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <hr class="my-1" />
    <div class="mt-3">
      <p class="col m-0">Immagine:</p>
      <div class="d-flex align-items-center px-2 mt-1">
        <img class="rounded-circle" :src="imageURL" width="50" height="50" />
        <NeuInput
          class="col px-0 mx-2"
          v-model="image"
          placeholder="URL immagine"
        />
      </div>
    </div>
    <div class="mt-3">
      <p class="col m-0">Nome:</p>
      <div class="d-flex align-items-center px-2 mt-1">
        <NeuInput
          class="col px-0 mx-2"
          v-model="name"
          placeholder="es. Mio workgroup"
        />
      </div>
    </div>
    <NeuButton
      class="col mx-auto m-2 mt-5 w-50"
      backgroundColor="var(--primary)"
      color="var(--text-color-primary)"
      style="height: 35px;"
      @click="newWorkgroup"
    >
      Salva
    </NeuButton>
    <Alert
      :type="alertType"
      @close="alertShowed = false"
      v-if="alertShowed"
      :message="alertMessage"
    />
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuInput from "@/components/neu-button/NeuInput";
import NeuButton from "@/components/neu-button/NeuButton";
import Alert from "@/components/alert/Alert";

import { mapActions } from "vuex";

export default {
  name: "NewWorkgroup",
  components: { NeuContainer, NeuInput, NeuButton, Alert },
  data() {
    return {
      image: "",
      name: "",
      alertType: "",
      alertMessage: "",
      alertShowed: false
    };
  },
  computed: {
    imageURL() {
      if (this.image.trim().length === 0)
        return "https://meet-box.herokuapp.com/img/logo";
      return this.image;
    }
  },
  methods: {
    ...mapActions(["createWorkgroup"]),
    exit() {
      this.image = "";
      this.name = "";
      this.$emit("exit");
    },
    async newWorkgroup() {
      if (!this.name) {
        this.showAlert(
          "warning",
          "Devi inserire un nome per creare un gruppo di lavoro"
        );
        setTimeout(() => (this.alertShowed = false), 5000);
      } else {
        this.showAlert("info", "Creazione in corso...");
        const data = await this.createWorkgroup({
          name: this.name,
          image: this.imageURL
        });
        this.exit();
        this.alertShowed = false;
        this.$router.push(`/${data.id}/drive`);
      }
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
.new-workgroup {
  position: fixed;
  min-width: 300px;
  width: 40%;
  z-index: 1000;
  cursor: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.new-workgroup .neu-button button {
  font-size: 16px !important;
}

.new-workgroup .close {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
  color: var(--text-color-bg);
}
.new-workgroup .close:hover {
  color: var(--danger);
}
</style>
