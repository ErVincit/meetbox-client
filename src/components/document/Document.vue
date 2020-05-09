<template>
  <NeuButton class="mt-3 rounded-pill">
    <div class="d-flex">
      <div class="document justify-content-start w-25">
        <img class="mx-2" src="@/assets/folderIcon.png" ref="ciccio" />
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
        console.log(bytes);
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
