<template>
  <form ref="fileform" @submit.prevent>
    <slot />
  </form>
</template>

<script>
export default {
  name: "FileDropArea",
  data() {
    return { dragCounter: 0 };
  },
  mounted() {
    [
      "drag",
      "dragstart",
      "dragend",
      "dragover",
      "dragenter",
      "dragleave",
      "drop"
    ].forEach(event => {
      this.$refs.fileform.addEventListener(
        event,
        e => {
          e.preventDefault();
          e.stopPropagation();
        },
        false
      );
    });

    this.$refs.fileform.addEventListener("dragenter", e => {
      if (this.dragCounter == 0) this.$emit("file-enter", e);
      this.dragCounter++;
    });

    this.$refs.fileform.addEventListener("dragleave", e => {
      this.dragCounter--;
      if (this.dragCounter == 0) this.$emit("file-leave", e);
    });

    this.$refs.fileform.addEventListener("drop", e => {
      this.$emit("file-drop", e.dataTransfer.files);
      this.dragCounter = 0;
    });
  }
};
</script>

<style></style>
