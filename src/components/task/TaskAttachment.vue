<template>
  <NeuContainer class="d-flex align-items-center p-1 px-2">
    <img src="@/assets/logo.png" />
    <p
      class="m-0 px-2 overflow-hidden text-nowrap text-truncate"
      v-tooltip="attachment.name"
    >
      {{ attachment.name }}
    </p>
    <button
      type="button"
      class="close ml-auto"
      aria-label="Close"
      @click.stop="$emit('delete', attachment)"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";

export default {
  name: "TaskAttachment",
  props: { attachment: { name: String } },
  components: { NeuContainer }
};
</script>

<style scoped>
.neu-container {
  cursor: pointer;
}

.neu-container > img {
  width: 30px;
  height: 30px;
}

.close:hover {
  color: orangered;
}
</style>
