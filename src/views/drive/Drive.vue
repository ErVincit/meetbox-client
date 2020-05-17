<template>
  <div class="drive container-fluid h-100 d-flex flex-column">
    <PageHeader @open-navbar="openNavBar = !openNavBar">
      <Breadcrumb
        class="d-block d-lg-none px-2"
        :currentPosition="currentPosition"
        @set-position="setPosition"
      />
    </PageHeader>
    <div
      id="page-content"
      class="row flex-grow-1"
      style="height: calc(100% - 100px)"
    >
      <LeftNavBar class="h-100" :open="openNavBar" />
      <main class="col d-flex flex-column h-100 px-1">
        <Breadcrumb
          class="d-none d-lg-block"
          :currentPosition="currentPosition"
          @set-position="setPosition"
        />
        <hr class="mt-0 mb-2" />
        <div class="row justify-content-between m-0 mt-3 px-2">
          <div
            class="d-flex col-12 col-sm-6 col-md-4 col-xl-3 my-2 align-items-center"
          >
            <NeuInput
              type="text"
              placeholder="Cerca..."
              v-model="researchString"
              class="w-100 search-bar"
            />
          </div>
          <div
            class="d-flex col-12 col-sm-6 col-md-4 col-xl-3 my-2 justify-content-end"
          >
            <NeuButton class="w-100 rounded-pill" @click="$refs.file.click()">
              <div class="d-flex justify-content-center align-items-center">
                <img class="mr-3" src="@/assets/cloud-upload.svg" />
                <p class="carica m-0">Carica</p>
              </div>
            </NeuButton>
            <input
              class="d-none"
              ref="file"
              type="file"
              @change="addFiles($refs.file.files)"
            />
          </div>
        </div>
        <FileDropArea
          @file-enter="draggingFile = true"
          @file-leave="draggingFile = false"
          @file-drop="handleFileDrop"
          class="flex-grow-1 m-1 overflow-hidden"
        >
          <div class="position-relative w-100 h-100 p-2 d-flex flex-column">
            <div
              v-if="draggingFile"
              class="drag-title d-flex justify-content-center align-items-center"
            >
              Rilascia il file per caricarlo sul Drive
            </div>
            <div class="row mt-3 px-2 d-none d-md-flex">
              <div class="header col-3 p-0">
                <p class="m-0" style="cursor:pointer" @click="orderBy = 'nome'">
                  Nome
                </p>
              </div>
              <div class="header col-3 p-0">
                <p
                  class="m-0"
                  style="cursor:pointer"
                  @click="orderBy = 'creatore'"
                >
                  Creatore
                </p>
              </div>
              <div class="header col-3 p-0">
                <p
                  class="m-0"
                  style="cursor:pointer"
                  @click="orderBy = 'dataCreazione'"
                >
                  Data
                </p>
              </div>
              <div class="header col-3 p-0">
                <p
                  class="m-0"
                  style="cursor:pointer"
                  @click="orderBy = 'dimensione'"
                >
                  Dimensione
                </p>
              </div>
            </div>
            <Loading :show="!tree" />
            <p
              v-if="tree && filteredDocuments && filteredDocuments.length === 0"
              class="mt-4 w-100 text-center"
              style="color:#787878"
            >
              Nessun documento presente
            </p>
            <div v-else-if="tree" class="documents h-100 p-2">
              <Document
                v-for="document in filteredDocuments"
                :key="document.id"
                :class="{
                  selected: filesSelected.find(doc => doc.id === document.id)
                }"
                :edit="
                  editmode &&
                    filesSelected.find(doc => doc.id === document.id) &&
                    rename
                "
                :document="document"
                @click.stop="handleClick(document)"
                @dblclick.stop="handleDblClick($event, document)"
              />
            </div>
          </div>
          <Alert
            v-if="alertShowed"
            :message="alertMessage"
            @close="alertShowed = false"
            :type="alertType"
          />
        </FileDropArea>
      </main>
      <Actions>
        <NeuButton
          class="d-flex justify-content-center align-items-center mt-3"
          style="width: 50px; height: 50px"
          @click="addFolder"
        >
          <img
            src="@/assets/addIcon.svg"
            v-tooltip:left="'Crea nuova cartella'"
          />
        </NeuButton>
        <NeuButton
          v-if="editmode"
          class="d-flex justify-content-center align-items-center mt-3"
          style="width: 50px; height: 50px"
          @click="deleteDocument"
        >
          <img src="@/assets/deleteIcon.svg" v-tooltip:left="'Elimina file'" />
        </NeuButton>
        <NeuButton
          v-if="editmode && filesSelected.length === 1"
          class="d-flex justify-content-center align-items-center mt-3"
          style="width: 50px; height: 50px"
          @click="editName"
        >
          <img src="@/assets/editIcon.svg" v-tooltip:left="'Rinomina'" />
        </NeuButton>
        <NeuButton
          v-if="editmode"
          class="d-flex justify-content-center align-items-center mt-3"
          style="width: 50px; height: 50px"
        >
          <img src="@/assets/moveIcon.svg" v-tooltip:left="'Sposta file'" />
        </NeuButton>
      </Actions>
    </div>
  </div>
</template>

<script>
import LeftNavBar from "@/components/page-header/LeftNavBar";
import PageHeader from "@/components/page-header/PageHeader";
import Document from "@/components/document/Document";
import NeuInput from "@/components/neu-button/NeuInput";
import NeuButton from "@/components/neu-button/NeuButton";
import FileDropArea from "@/components/task/FileDropArea";
import Actions from "@/components/actions/Actions";
import Loading from "@/components/loading/Loading";
import Breadcrumb from "./Breadcrumb";
import Alert from "@/components/alert/Alert";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "Drive",
  components: {
    LeftNavBar,
    PageHeader,
    Document,
    NeuInput,
    NeuButton,
    FileDropArea,
    Actions,
    Breadcrumb,
    Loading,
    Alert
  },
  computed: {
    ...mapGetters(["tree", "currentUser", "workgroups"]),
    currentWorkgroup() {
      const { workgroupId } = this.$route.params;
      if (this.workgroups)
        return this.workgroups.find(wg => wg.id === parseInt(workgroupId));
      return null;
    },
    folders() {
      if (!this.tree) return [];
      return Object.keys(this.tree);
    },
    filteredDocuments() {
      if (!this.folders.includes(this.currentPosition)) return [];
      if (this.tree) {
        const documentsFolder = this.tree[
          this.currentPosition
        ].filter(({ name }) =>
          name.toLowerCase().includes(this.researchString.toLowerCase())
        );
        if (this.orderBy === "def")
          return documentsFolder.sort((a, b) => b.isfolder - a.isfolder);
        else if (this.orderBy === "nome")
          return documentsFolder.sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase())
          );
        else if (this.orderBy === "creatore") {
          return documentsFolder.sort((a, b) =>
            this.ownerName(a)
              .toLowerCase()
              .localeCompare(this.ownerName(b).toLowerCase())
          );
        } else if (this.orderBy === "dataCreazione")
          return documentsFolder.sort(
            (a, b) => new Date(b.creationdate) - new Date(a.creationdate)
          );
        else if (this.orderBy === "dimensione")
          return documentsFolder.sort((a, b) => b.size - a.size);
      }
      return [];
    }
  },
  methods: {
    ...mapActions([
      "fetchTree",
      "removeDocument",
      "addDocument",
      "uploadDocument"
    ]),
    async addFiles(files) {
      const { workgroupId } = this.$route.params;
      this.showAlert("info", "Caricamento in corso...0/" + files.length);
      let count = 0;
      for (const file of files) {
        await this.uploadDocument({
          workgroupId,
          folder: this.currentPosition,
          file
        });
        count++;
        this.alertMessage =
          "Caricamento in corso..." + count + "/" + files.length;
      }
      this.alertShowed = false;
      files = [];
    },
    handleClick(document) {
      this.editmode = true;
      const index = this.filesSelected.findIndex(doc => doc.id === document.id);
      if (index === -1) this.filesSelected.push(document);
      else this.filesSelected.splice(index, 1);
      if (this.filesSelected.length === 0) {
        this.editmode = false;
        this.rename = false;
      }
    },
    handleDblClick(e, document) {
      if (document.isfolder) {
        this.currentPosition = document.id + "";
        this.editmode = false;
        this.filesSelected = [];
      } else {
        const { workgroupId } = this.$route.params;
        window.open(
          `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/drive/document/${document.id}/download`,
          "_blank"
        );
      }
    },
    handleFileDrop(files) {
      this.addFiles(files);
      this.draggingFile = false;
    },
    ownerName(document) {
      if (!this.currentWorkgroup) return "";
      const owner = this.currentWorkgroup.members.find(
        mem => mem.id == document.owner
      );
      return owner.firstname + " " + owner.lastname;
    },
    async deleteDocument() {
      const { workgroupId } = this.$route.params;
      this.showAlert(
        "info",
        "Cancellazione in corso...0/" + this.filesSelected.length
      );
      let count = 0;
      for (const document of this.filesSelected) {
        await this.removeDocument({ workgroupId, documentId: document.id });
        count++;
        this.alertMessage =
          "Cancellazione in corso..." + count + "/" + this.filesSelected.length;
      }
      this.alertShowed = false;
      this.filesSelected = [];
    },
    async addFolder() {
      const { workgroupId } = this.$route.params;
      const documents = this.tree[this.currentPosition];
      const checkNewFolder = (docs, digit) => {
        let found;
        if (digit === 0)
          found = docs.findIndex(doc => doc.name === "Nuova cartella");
        else
          found = docs.findIndex(
            doc => doc.name === "Nuova cartella (" + digit + ")"
          );
        if (found === -1) return digit;
        return checkNewFolder(docs, digit + 1);
      };
      const index = checkNewFolder(documents, 0);
      const name = "Nuova cartella" + (index === 0 ? "" : " (" + index + ")");
      const isFolder = true;
      const isNote = false;
      const folder = this.currentPosition;
      this.showAlert("info", "Creazione in corso...");
      if (folder === "root")
        await this.addDocument({
          workgroupId,
          folder,
          creationDetails: {
            name: name,
            isFolder: isFolder,
            isNote: isNote,
            workgroup: workgroupId
          }
        });
      else
        await this.addDocument({
          workgroupId,
          folder,
          creationDetails: {
            name: name,
            isFolder: isFolder,
            isNote: isNote,
            folder: folder,
            workgroup: workgroupId
          }
        });
      this.alertShowed = false;
    },
    editName() {
      this.rename = !this.rename;
    },
    setPosition(pos) {
      this.currentPosition = pos + "";
    },
    showAlert(type, message) {
      this.alertType = type;
      this.alertMessage = message;
      this.alertShowed = true;
    }
  },
  data() {
    return {
      draggingFile: false,
      currentPosition: "root",
      researchString: "",
      editmode: false,
      filesSelected: [],
      rename: false,
      alertShowed: false,
      alertType: "",
      alertMessage: "",
      openNavBar: false,
      orderBy: "def"
    };
  },
  created() {
    const { workgroupId } = this.$route.params;
    this.fetchTree(workgroupId);
  },
  watch: {
    $route() {
      const { workgroupId } = this.$route.params;
      this.fetchTree(workgroupId);
    }
  }
};
</script>

<style>
.carica {
  color: var(--primary);
}
.header {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-color-bg);
}
.documents {
  overflow: hidden auto;
}
.drag-title {
  border: 4px dashed var(--file-drop-border);
  border-radius: 10px;
  position: absolute;
  color: var(--text-color-bg);
  background-color: var(--primary-bg-color);
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  font-size: 30px;
}
.document.selected {
  border: 1px solid var(--file-drop-border) !important;
}
.documents-fade-enter-active,
.documents-fade-leave-active {
  transition: all 1s;
}
.documents-fade-enter,
.documents-fade-leave-to {
  opacity: 0;
}
.documents-fade-move {
  transition: transform 1s;
}

.search-bar {
  border-radius: 50rem !important;
}
.search-bar input {
  height: 40px !important;
}
</style>
