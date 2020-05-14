<template>
  <div class="drive container-fluid h-100 d-flex flex-column">
    <PageHeader />
    <div id="page-content" class="row flex-grow-1">
      <LeftNavBar class="h-100" />
      <main class="col d-flex flex-column h-100 px-4">
        <Breadcrumb
          :currentPosition="currentPosition"
          @set-position="setPosition"
        />
        <hr class="mt-0 mb-2" />
        <div class="d-flex mt-3 px-4">
          <div class="d-flex w-50 align-items-center">
            <NeuInput
              type="text"
              placeholder="Cerca..."
              v-model="researchString"
            />
          </div>
          <div class="d-flex w-50 justify-content-end">
            <NeuButton class="w-50 rounded-pill" @click="$refs.file.click()">
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
          class="flex-grow-1 m-1"
        >
          <div class="position-relative w-100 h-100 p-2 d-flex flex-column">
            <div
              v-if="draggingFile"
              class="drag-title d-flex justify-content-center align-items-center"
            >
              Rilascia il file per caricarlo sul Drive
            </div>
            <div class="d-flex mt-3 px-4">
              <div class="header w-25">
                Nome
              </div>
              <div class="header w-25">
                Creatore
              </div>
              <div class="header w-25">
                Data
              </div>
              <div class="header w-25">
                Dimensioni
              </div>
            </div>
            <Loading :show="!tree" />
            <transition-group
              class="documents px-4"
              name="documents-fade"
              tag="div"
            >
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
            </transition-group>
          </div>
        </FileDropArea>
      </main>
      <Actions>
        <NeuButton
          class="d-flex justify-content-center align-items-center mt-3"
          style="width: 50px; height: 50px"
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
    Loading
  },
  computed: {
    ...mapGetters(["tree"]),
    folders() {
      return Object.keys(this.tree);
    },
    filteredDocuments() {
      if (this.tree)
        return this.tree[this.currentPosition].filter(({ name }) =>
          name.toLowerCase().includes(this.researchString.toLowerCase())
        );
      return [];
    }
  },
  methods: {
    ...mapActions(["fetchTree", "removeDocument"]),
    addFiles(files) {
      // TODO: upload file to server
      for (const file of files) {
        console.log("File uploaded!", file);
      }
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
      if (document.isfolder && this.folders.includes(document.id + ""))
        this.currentPosition = document.id + "";
    },
    handleFileDrop(files) {
      // TODO: Upload to server
      console.log("Uploading...", files);
    },
    async deleteDocument() {
      const { workgroupId } = this.$route.params;
      for (const document of this.filesSelected)
        await this.removeDocument({ workgroupId, documentId: document.id });
    },
    editName() {
      this.rename = !this.rename;
    },
    setPosition(pos) {
      this.currentPosition = pos + "";
    }
  },
  data() {
    return {
      draggingFile: false,
      currentPosition: "root",
      researchString: "",
      editmode: false,
      filesSelected: [],
      rename: false
    };
  },
  created() {
    const { workgroupId } = this.$route.params;
    this.fetchTree(workgroupId);
  }
};
</script>

<style>
.carica {
  color: #1c4885;
}
.header {
  width: 100%;
  margin: 3pt;
  display: flex;
  justify-content: center;
  align-items: center;
}
.documents {
  overflow: auto;
}
.drag-title {
  border: 4px dashed purple;
  border-radius: 10px;
  position: absolute;
  background-color: #efeeee;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 30px;
}
.document.selected {
  border: 1px solid purple !important;
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
</style>
