<template>
  <NeuContainer class="dropdown-menu label-dropdown p-2" disableHover>
    <div v-if="!editingLabel && !addingLabel">
      <div
        class="label-container"
        style="width: 150px"
        v-for="label in workgroupLabels"
        :key="label.id"
      >
        <Label
          class="my-2"
          :label="label"
          @click.stop="$emit('selected', label)"
          showName
        />
        <button
          class="rounded-pill position-absolute d-flex justify-content-end align-items-center px-1"
          style="outline: none"
          @click.stop="startEditing(label)"
        >
          <svg
            width="15"
            height="16"
            viewBox="0 0 25 26"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            style="z-index: 10"
          >
            <path
              d="M7.40704 19.3016L9.29511 21.2807L19.3164 10.7764L17.4283 8.79736L7.40704 19.3016V19.3016ZM16.5569 7.88395L14.6688 5.90488L4.64756 16.4091L6.68086 18.5404L16.5569 7.88395ZM19.6069 0.728867L24.3997 5.75265C25.2711 6.66606 25.1259 8.03618 24.3997 8.79736L10.0213 23.8687L0 26L2.03331 15.4957C11.0379 5.90488 15.8307 0.881103 16.4117 0.424396C17.2831 -0.184547 18.7355 -0.184547 19.6069 0.728867V0.728867Z"
            />
          </svg>
        </button>
      </div>
      <BigAddButton @click.stop="addingLabel = true">
        Crea etichetta
      </BigAddButton>
    </div>
    <div v-else class="editLabel w-100 h-100" @click.stop>
      <div style="position: relative">
        <p class=" mb-0 highlight" style="line-height: 20px">
          Gestisci etichetta
        </p>
        <button
          type="button"
          class="close"
          aria-label="Close"
          style="position: absolute; right: 10px; top: 50%; transform: translate(0, -50%)"
          @click.stop="exitManagement"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <hr class="my-1" />
      <div class="mt-3">
        <p class="col m-0">Nome:</p>
        <NeuInput
          type="text"
          class="col-auto rounded-pill m-1 px-0"
          style="width: 200px;"
          v-model="labelToEdit.name"
          autofocus
        />
      </div>
      <div class="mt-3">
        <p class="col m-0">Colore:</p>
        <div class="d-flex m-2 flex-wrap">
          <div
            class="col-auto rounded-pill m-1 p-0"
            style="width: 30px; height: 30px; background-color: transparent; cursor: pointer"
            v-for="color in colors"
            :key="color"
            :class="{ selected: '#' + labelToEdit.color === color }"
            @click="selectColor(color)"
          >
            <div
              class="w-100 h-100 rounded-pill"
              :style="{ 'background-color': color }"
            />
          </div>
        </div>
      </div>
      <div class="d-flex">
        <NeuButton
          class="col-5 mx-auto m-2 mt-3"
          backgroundColor="var(--primary)"
          color="var(--text-color-primary)"
          style="height: 35px;"
          @click="changeLabel"
        >
          Salva
        </NeuButton>
        <NeuButton
          v-if="editingLabel"
          class="col-5 mx-auto m-2 mt-3"
          color="var(--danger)"
          style="height: 35px;"
          @click="removeLabel"
        >
          Elimina
        </NeuButton>
      </div>
    </div>
    <Alert
      v-if="alertShowed"
      :message="alertMessage"
      @close="alertShowed = false"
      :type="alertType"
    />
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuInput from "@/components/neu-button/NeuInput";
import NeuButton from "@/components/neu-button/NeuButton";
import BigAddButton from "@/components/section/BigAddButton";
import Label from "./Label";
import Alert from "@/components/alert/Alert";

import { mapGetters, mapActions } from "vuex";

const colors = [
  "#d36c27",
  "#8060ab",
  "#309291",
  "#5b3108",
  "#2e3ec5",
  "#7a0147",
  "#74c712",
  "#fa3483",
  "#b22126",
  "#3918cf"
];

const EMPTY_LABEL = { name: "", color: "" };

export default {
  name: "LabelDropdown",
  props: { idLabel: Number },
  components: { Label, NeuContainer, NeuInput, NeuButton, BigAddButton, Alert },
  data() {
    return {
      editingLabel: false,
      addingLabel: false,
      labelToEdit: EMPTY_LABEL,
      colors,
      alertMessage: null,
      alertShowed: false,
      alertType: ""
    };
  },
  computed: {
    ...mapGetters(["workgroups"]),
    workgroupLabels() {
      const { workgroupId } = this.$route.params;
      return this.workgroups.find(wg => wg.id === parseInt(workgroupId)).labels;
    }
  },
  methods: {
    ...mapActions(["createLabel", "editLabel", "deleteLabel", "clearLabel"]),
    startEditing(label) {
      this.editingLabel = true;
      this.labelToEdit = label;
    },
    async changeLabel() {
      if (!this.labelToEdit.color) {
        this.showAlert("warning", "Devi selezionare un colore");
        setTimeout(() => (this.alertShowed = false), 5000);
      } else {
        if (this.editingLabel) {
          const { workgroupId } = this.$route.params;
          this.editLabel({
            workgroupId,
            labelId: this.labelToEdit.id,
            editObject: this.labelToEdit
          });
        } else {
          const { workgroupId } = this.$route.params;
          this.showAlert("info", "Creazione in corso...");
          await this.createLabel({
            workgroupId,
            label: this.labelToEdit
          });
          this.alertShowed = false;
        }
        this.exitManagement();
      }
    },
    async removeLabel() {
      if (this.labelToEdit.id !== this.idLabel) {
        const { workgroupId } = this.$route.params;
        this.showAlert("info", "Eliminazione in corso...");
        this.clearLabel(this.labelToEdit.id);
        await this.deleteLabel({ workgroupId, labelId: this.labelToEdit.id });
        this.alertShowed = false;
        this.exitManagement();
      } else {
        this.showAlert(
          "danger",
          "Non è possibile rimuovere un'etichetta attiva attualmente"
        );
        setTimeout(() => (this.alertShowed = false), 5000);
      }
    },
    selectColor(color) {
      const colorStr = color.substring(1);
      if (this.labelToEdit.color === colorStr) this.labelToEdit.color = null;
      else this.labelToEdit.color = colorStr;
    },
    exitManagement() {
      this.labelToEdit = EMPTY_LABEL;
      this.editingLabel = false;
      this.addingLabel = false;
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
.label-dropdown {
  margin-top: 10px;
  border: none;
  z-index: 2000;
}
.label-dropdown .label-container {
  width: 100%;
  font-size: 16px;
  position: relative;
}
.label-dropdown .label-container .label {
  width: 100%;
  transition: all 200ms;
  z-index: 100;
  position: relative;
}
.label-dropdown .label-container:hover .label {
  width: calc(100% - 20px);
}
.label-dropdown .label-container button {
  width: 100%;
  height: 100%;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  z-index: 0;
  cursor: pointer;
  border: none;
  background-color: var(--primary);
}
.label-dropdown .label-container button:hover {
  background-color: #787878;
}
.label-dropdown .label-container button:hover svg {
  fill: white;
}
.label-dropdown .selected {
  border: 3px solid var(--primary);
  box-shadow: 3px 3px 6px #cbcbcb, -3px -3px 6px #fff;
}
.label-dropdown .neu-input input {
  height: 30px !important;
  font-size: 16px;
}
.label-dropdown .neu-button button {
  font-size: 16px;
}
.label-dropdown .big-add-btn {
  height: 30px;
}
</style>
