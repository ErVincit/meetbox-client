<template>
  <NeuButton class="mt-3 rounded-pill" v-bind="$attrs" v-on="$listeners">
    <div class="d-flex">
      <div class="document justify-content-start w-25">
        <img class="mx-2" src="@/assets/folderIcon.svg" ref="icon" />
        {{ document.name }}
      </div>
      <div class="document w-25">
        {{ document.owner }}
      </div>
      <div class="document w-25">
        {{ data }}
      </div>
      <div class="document w-25">
        {{ size }}
      </div>
    </div>
  </NeuButton>
</template>

<script>
import NeuButton from "@/components/neu-button/NeuButton";
import Calendarutils from "@/views/calendar/calendar_utils";
export default {
  name: "Document",
  props: ["document"],
  components: { NeuButton },
  mounted() {
    this.data = Calendarutils.dateToString(
      new Date(this.document.creationdate)
    );
    this.size = this.humanFileSize(this.document.size);
    if (this.document.name.includes(".")) {
      var ext = this.document.name.split(".").pop();
      switch (ext) {
        case "mp3":
          this.$refs.icon.src = require("@/assets/audioIcon.svg");
          break;
        case "mp4":
        case "mov":
        case "avi":
          this.$refs.icon.src = require("@/assets/videoIcon.svg");
          break;
        case "png":
        case "jpeg":
        case "svg":
          this.$refs.icon.src = require("@/assets/imageIcon.svg");
          break;
        case "pdf":
          this.$refs.icon.src = require("@/assets/pdfIcon.svg");
          break;
        case "zip":
        case "rar":
          this.$refs.icon.src = require("@/assets/zipIcon.svg");
          break;
        default:
          this.$refs.icon.src = require("@/assets/defaultIcon.svg");
      }
    }
  },
  data() {
    return {
      data: "",
      size: ""
    };
  },
  methods: {
    humanFileSize(bytes) {
      var thresh = 1024;
      if (Math.abs(bytes) < thresh) {
        return bytes + " B";
      }
      var units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      var u = -1;
      do {
        bytes /= thresh;
        ++u;
      } while (Math.abs(bytes) >= thresh && u < units.length - 1);
      return bytes.toFixed(1) + " " + units[u];
    }
  }
};
</script>

<style>
.document {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
}
</style>
