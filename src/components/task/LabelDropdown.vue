<template>
  <NeuContainer class="dropdown-menu label-dropdown p-2" disableHover>
    <Label
      class="my-2"
      v-for="label in workgroupLabels"
      :key="label.id"
      :label="label"
      @click.stop="$emit('selected', label)"
      showName
    />
    <BigAddButton>Crea label</BigAddButton>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import BigAddButton from "@/components/section/BigAddButton";
import Label from "./Label";

import { mapGetters } from "vuex";

export default {
  name: "LabelDropdown",
  props: { idLabel: Number },
  components: { Label, NeuContainer, BigAddButton },
  computed: {
    ...mapGetters(["workgroups"]),
    workgroupLabels() {
      const { workgroupId } = this.$route.params;
      return this.workgroups.find(wg => wg.id === parseInt(workgroupId)).labels;
    }
  }
};
</script>

<style scoped>
.label-dropdown {
  margin-top: 10px;
  border: none;
  z-index: 2000;
}
.label-dropdown .label {
  height: 30px;
  width: 100%;
  font-size: 16px;
  transition: all 200ms;
}
.label-dropdown .label:hover {
  opacity: 0.8;
  transform: scale(0.9);
}
</style>
