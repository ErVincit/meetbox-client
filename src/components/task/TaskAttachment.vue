<template>
  <NeuContainer class="d-flex align-items-center p-1 px-2" @click="handleClick">
    <img :src="icon" />
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
  computed: {
    icon() {
      var ext = this.document.name.split(".").pop();
      switch (ext) {
        case "mp3":
          return require("@/assets/audioIcon.svg");
        case "mp4":
        case "mov":
        case "avi":
          return require("@/assets/videoIcon.svg");
        case "png":
        case "jpeg":
        case "jpg":
        case "svg":
          return require("@/assets/imageIcon.svg");
        case "pdf":
          return require("@/assets/pdfIcon.svg");
        case "zip":
        case "rar":
          return require("@/assets/zipIcon.svg");
        default:
          return require("@/assets/defaultIcon.svg");
      }
    }
  },
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
