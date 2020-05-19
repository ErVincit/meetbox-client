<template>
  <NeuContainer class="pos-edit px-5 py-4" disableHover>
    <p class="col-auto highlight m-0 pb-2 pr-3 text-nowrap">Sposta in:</p>
    <div
      class="d-flex justify-content-start align-items-center"
      v-if="folderName !== 'root'"
    >
      <svg
        width="12"
        height="10"
        viewBox="0 0 12 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        @click="goBack"
        style="cursor:pointer"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.78119 0.698475C5.85103 0.761501 5.90644 0.836372 5.94425 0.918802C5.98206 1.00123 6.00152 1.0896 6.00152 1.17884C6.00152 1.26809 5.98206 1.35645 5.94425 1.43888C5.90644 1.52131 5.85103 1.59618 5.78119 1.65921L1.81081 5.24975L5.78119 8.84029C5.85092 8.90337 5.90623 8.97826 5.94397 9.06069C5.98171 9.14311 6.00113 9.23145 6.00113 9.32066C6.00113 9.40987 5.98171 9.49821 5.94397 9.58063C5.90623 9.66305 5.85092 9.73794 5.78119 9.80103C5.71146 9.86411 5.62868 9.91415 5.53757 9.94829C5.44647 9.98243 5.34882 10 5.2502 10C5.15159 10 5.05394 9.98243 4.96284 9.94829C4.87173 9.91415 4.78895 9.86411 4.71922 9.80103L0.219357 5.73012C0.149515 5.66709 0.0941018 5.59222 0.0562933 5.50979C0.0184848 5.42736 -0.000976563 5.339 -0.000976562 5.24975C-0.000976563 5.16051 0.0184848 5.07214 0.0562933 4.98971C0.0941018 4.90728 0.149515 4.83241 0.219357 4.76938L4.71922 0.698475C4.78889 0.635291 4.87165 0.58516 4.96276 0.550956C5.05388 0.516751 5.15156 0.499146 5.2502 0.499146C5.34885 0.499146 5.44653 0.516751 5.53765 0.550956C5.62876 0.58516 5.71152 0.635291 5.78119 0.698475V0.698475Z"
          fill="#747070"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.750488 5.24965C0.750488 5.06971 0.829504 4.89713 0.970152 4.76989C1.1108 4.64265 1.30156 4.57117 1.50047 4.57117H11.2502C11.4491 4.57117 11.6398 4.64265 11.7805 4.76989C11.9211 4.89713 12.0001 5.06971 12.0001 5.24965C12.0001 5.4296 11.9211 5.60217 11.7805 5.72941C11.6398 5.85665 11.4491 5.92814 11.2502 5.92814H1.50047C1.30156 5.92814 1.1108 5.85665 0.970152 5.72941C0.829504 5.60217 0.750488 5.4296 0.750488 5.24965Z"
          fill="#747070"
        />
      </svg>
      <p class="my-0 mx-3">{{ folderName }}</p>
    </div>
    <NeuContainer
      v-for="folder in folders"
      :key="folder.id"
      :class="{
        selected:
          selectedFolder.length !== 0 && folder.id === selectedFolder[0].id
      }"
      class="mt-3 rounded-pill folder"
      v-bind="$attrs"
      v-on="$listeners"
      @click.stop="handleClick(folder)"
      @dblclick.stop="handleDblClick($event, folder)"
    >
      <div class="row px-2">
        <div class="folder-col">
          <img
            class="mx-3"
            style="width: 40px"
            src="@/assets/folderIcon.svg"
            ref="icon"
          />
          <div>
            {{ folder.name }}
          </div>
        </div>
      </div>
    </NeuContainer>
    <div class="d-flex justify-content-center">
      <NeuButton
        class="my-3 mt-5 w-50 "
        backgroundColor="#2F80ED"
        color="white"
        :shadowRadius="0"
        :shadowBlur="0"
        @click="Move"
        >Sposta</NeuButton
      >
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
import NeuButton from "@/components/neu-button/NeuButton";
import Alert from "@/components/alert/Alert";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "MoveTo",
  components: { NeuContainer, NeuButton, Alert },
  props: { document: Array },
  computed: {
    ...mapGetters(["tree"]),
    folders() {
      //if (!this.folders.includes(this.currentPosition)) return [];
      if (this.tree) {
        const folders = this.tree[this.currentPosition].filter(
          doc => doc.isfolder === true && doc.id !== this.document[0].id ///!!!!!!!!!!!!da modificare rendere compatibile se più di un documento
        );
        return folders;
      }
      return [];
    }
  },
  data() {
    return {
      currentPosition: "root",
      selectedFolder: [],
      folderName: "root",
      folderFatherId: "",
      folderFather: "",
      alertShowed: false,
      alertType: "",
      alertMessage: ""
    };
  },
  methods: {
    ...mapActions(["fetchTree", "moveFile"]),
    handleClick(folder) {
      if (this.selectedFolder.length === 0) this.selectedFolder.push(folder);
      else {
        if (this.selectedFolder[0].id !== folder.id) {
          this.selectedFolder = [];
          this.selectedFolder.push(folder);
        } else this.selectedFolder = [];
      }
    },
    handleDblClick(e, folder) {
      this.folderFatherId = this.currentPosition;
      this.folderFather = this.folderName;
      this.currentPosition = folder.id + "";
      this.folderName = folder.name + "";
    },
    goBack() {
      this.currentPosition = this.folderFatherId;
      this.folderName = this.folderFather;
    },
    async Move() {
      if (this.selectedFolder.length > 0) {
        const { workgroupId } = this.$route.params;
        const pastFolder = this.document[0].folder;
        this.showAlert(
          "info",
          "Spostamento in corso..." + this.document.length
        );
        await this.moveFile({
          workgroupId,
          documentId: this.document[0].id,
          pastFolder,
          editObject: { folder: this.selectedFolder[0].id }
        });
        this.showAlert("success", "File spostato con successo!");
        this.alertShowed = false;
        this.$emit("close");
      }
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
.pos-edit {
  position: fixed;
  top: 45%;
  left: 50%;
  min-width: 600px;
  width: 60%;
  max-width: 800px;
  transform: translate(-50%, -50%);
  z-index: 100;
  border: 4px dotted transparent;
}
.folder {
  border: 1px solid transparent;
  cursor: pointer;
}
.folder.selected {
  border: 1px solid var(--file-drop-border) !important;
}
.folder-col {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: left;
  align-items: center;
  font-size: 16px;
}
</style>
