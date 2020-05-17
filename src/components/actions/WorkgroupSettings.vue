<template>
  <NeuContainer class="workgroup-settings p-2" disableHover>
    <div style="position: relative">
      <p class=" mb-0 highlight" style="line-height: 30px; font-size: 1.5rem">
        Impostazioni gruppo di lavoro
      </p>
      <button type="button" class="close" aria-label="Close" @click.stop="exit">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <hr class="my-1" />
    <div class="mt-3">
      <p class="col m-0">Immagine:</p>
      <div class="d-flex align-items-center px-2 mt-1">
        <img class="rounded-circle" :src="image" width="50" height="50" />
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
    <button
      class="mx-4 mt-5 mb-2 delete-btn rounded-pill"
      @click="removeWorkgroup"
    >
      Elimina
    </button>
    <Alert
      :type="alertType"
      v-if="alertShowed"
      :message="alertMessage"
      :timeout="alertTimeout"
      @close="alertShowed = false"
    />
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuInput from "@/components/neu-button/NeuInput";
import Alert from "@/components/alert/Alert";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "WorkgroupSettings",
  components: { NeuContainer, Alert, NeuInput },
  data() {
    return {
      alertShowed: false,
      alertMessage: "",
      alertTimeout: null,
      alertType: ""
    };
  },
  computed: {
    ...mapGetters(["workgroups"]),
    currentWorkgroup() {
      const { workgroupId } = this.$route.params;
      if (this.workgroups)
        return this.workgroups.find(wg => wg.id === parseInt(workgroupId));
      return null;
    },
    image() {
      return this.currentWorkgroup.image;
    },
    name() {
      return this.currentWorkgroup.name;
    }
  },
  methods: {
    ...mapActions(["deleteWorkgroup"]),
    exit() {
      this.$emit("exit");
    },
    async removeWorkgroup() {
      if (this.workgroups.length === 1) {
        this.showAlert(
          "danger",
          "Non puoi eliminare il tuo ultimo gruppo di lavoro",
          3000
        );
        return;
      }
      this.showAlert("info", "Eliminazione in corso...");
      const { workgroupId } = this.$route.params;
      await this.deleteWorkgroup(workgroupId);
      const workgroup = this.workgroups[0];
      this.exit();
      this.$router.push(`/${workgroup.id}/drive`);
    },
    showAlert(type, message, timeout) {
      this.alertType = type;
      this.alertMessage = message;
      this.alertTimeout = timeout;
      this.alertShowed = true;
    }
  }
};
</script>

<style scoped>
.workgroup-settings {
  position: fixed;
  min-width: 400px;
  width: 40%;
  z-index: 1000;
  cursor: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@media (max-width: 400px) {
  .workgroup-settings {
    min-width: unset;
    width: 100%;
  }
}

.workgroup-settings .close {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
  color: var(--text-color-bg);
}
.workgroup-settings .close:hover {
  color: var(--danger);
}

.workgroup-settings .delete-btn {
  border: none;
  background-color: var(--danger);
  color: var(--text-color-primary);
  height: 40px;
  font-size: 1.2rem;
  width: 200px;
  float: right;
  outline: none;
}
</style>
