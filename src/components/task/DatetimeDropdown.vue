<template>
  <NeuContainer
    class="dropdown-menu datetime-dropdown p-2"
    disableHover
    @click.stop
  >
    <span class="highlight">Data</span>
    <NeuInput type="date" class="mb-1" v-model="date" />
    <span class="highlight">Orario</span>
    <NeuInput type="time" class="mt-1" v-model="time" />
    <div class="d-flex mt-3 mb-2">
      <NeuButton
        class="col mx-2"
        @click.stop="send"
        backgroundColor="var(--primary)"
        color="var(--text-color-primary)"
      >
        Salva
      </NeuButton>
      <NeuButton class="col mx-2" @click.stop="remove">Rimuovi</NeuButton>
    </div>
    <Alert
      v-if="alertShowed"
      :message="alertMessage"
      :type="alertType"
      @close="alertShowed = false"
    />
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuInput from "@/components/neu-button/NeuInput";
import NeuButton from "@/components/neu-button/NeuButton";
import Alert from "@/components/alert/Alert";

export default {
  name: "DatetimeDropdown",
  components: { NeuContainer, NeuInput, NeuButton, Alert },
  data() {
    return {
      date: "",
      time: "",
      alertShowed: false,
      alertType: "",
      alertMessage: ""
    };
  },
  methods: {
    send() {
      if (!this.date || !this.time) {
        this.showAlert(
          "warning",
          "Devi selezionare sia una data che un orario"
        );
        setTimeout(() => (this.alertShowed = false), 3000);
      } else {
        const timestamp = new Date(this.date);
        const array = this.time.split(":");
        timestamp.setHours(array[0], array[1]);
        this.$emit("selected", timestamp);
      }
    },
    remove() {
      this.$emit("selected", null);
    },
    showAlert(type, message) {
      this.alertType = type;
      this.alertMessage = message;
      this.alertShowed = true;
    }
  }
};
</script>

<style scoped>
.datetime-dropdown {
  margin: 10px 0;
  border: none;
  z-index: 2000;
}
</style>
