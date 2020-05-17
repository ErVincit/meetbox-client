<template>
  <NeuContainer
    class="mt-3 rounded-pill document"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div class="row px-2">
      <div class="document-col justify-content-start col-12 col-md-3">
        <img
          class="mx-2"
          style="width: 40px"
          src="@/assets/folderIcon.svg"
          ref="icon"
        />
        <NeuInput
          v-model="document.name"
          :disabled="!edit"
          :backgroundHidden="!edit"
          @blur="editTitle"
          @click.stop
        />
      </div>
      <div class="document-col col-3 d-none d-md-flex">
        {{ memberName }}
      </div>
      <div class="document-col col-3 d-none d-md-flex">
        {{ data }}
      </div>
      <div class="document-col col-3 d-none d-md-flex">
        {{ size }}
      </div>
    </div>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuInput from "@/components/neu-button/NeuInput";
import Calendarutils from "@/views/calendar/calendar_utils";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "Document",
  props: { document: Object, edit: { type: Boolean, default: false } },
  components: { NeuContainer, NeuInput },
  computed: {
    ...mapGetters(["workgroups"]),
    currentWorkgroup() {
      const { workgroupId } = this.$route.params;
      if (this.workgroups)
        return this.workgroups.find(wg => wg.id === parseInt(workgroupId));
      return null;
    },
    memberName() {
      if (!this.currentWorkgroup) return "";
      const member = this.currentWorkgroup.members.find(
        mem => mem.id == this.document.owner
      );
      return member.firstname + " " + member.lastname;
    }
  },
  mounted() {
    this.data = Calendarutils.dateToString(
      new Date(this.document.creationdate)
    );
    if (this.document.isfolder) this.size = "--";
    else this.size = this.humanFileSize(this.document.size);
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
        case "jpg":
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
    ...mapActions(["editName"]),
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
    },
    async editTitle() {
      const { workgroupId } = this.$route.params;
      await this.editName({
        workgroupId,
        documentId: this.document.id,
        editObject: { name: this.document.name }
      });
    }
  }
};
</script>

<style>
.document {
  border: 1px solid transparent;
  cursor: pointer;
}

.document input {
  text-overflow: ellipsis;
}

.document-col {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  user-select: none;
}
</style>
