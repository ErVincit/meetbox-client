<template>
  <NeuContainer class="d-flex align-items-center p-1 px-2" @click="handleClick">
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
  props: { attachment: { id: Number, name: String } },
  components: { NeuContainer },
  methods: {
    handleClick() {
      const { workgroupId } = this.$route.params;
      window.open(
        `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/drive/document/${this.attachment.id}/download`,
        "_blank"
      );
    }
  }
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
  color: var(--danger);
}
</style>
