<template>
  <div class="drive container-fluid h-100 d-flex flex-column">
    <PageHeader />
    <div id="page-content" class="row flex-grow-1">
      <Recents currentPage="drive" />
      <main class="col col-lg-9">
        <p class="m-0">Drive</p>
        <hr class="mt-0 mb-2" />
        <div class="d-flex mt-3">
          <div class="d-flex w-50 align-items-center">
            <NeuInput placeholder="Cerca..." />
          </div>
          <div class="d-flex w-50 justify-content-end">
            <NeuButton class="w-50 rounded-pill">
              <div class="d-flex justify-content-center align-items-center">
                <img class="mx-3" src="@/assets/cloud-upload.svg" />
                <p class="carica m-0">Carica</p>
              </div>
            </NeuButton>
          </div>
        </div>
        <div class="d-flex mt-3">
          <div class="header w-25">
            Nome
          </div>
          <div class="header w-25">
            Proprietario
          </div>
          <div class="header w-25">
            Data
          </div>
          <div class="header w-25">
            Dimensioni
          </div>
        </div>
        <div class="h-100 documents">
          <Document
            v-for="document in rootItems"
            :key="document.id"
            :document="document"
          />
        </div>
      </main>
      <div
        class="col col-lg-1 d-none d-lg-block"
        style="background-color: red"
      ></div>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/page-header/PageHeader";
import Recents from "@/components/recents/Recents";
import Document from "@/components/document/Document";
import NeuInput from "@/components/neu-button/NeuInput";
import NeuButton from "@/components/neu-button/NeuButton";

export default {
  name: "Drive",
  components: { PageHeader, Recents, Document, NeuInput, NeuButton },
  computed: {
    rootItems() {
      return this.documents["root"];
    }
  },
  data() {
    return {
      documents: {
        "14": [
          {
            id: 27,
            name: "File della vita 2",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 28,
            name: "File della vita 3",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 29,
            name: "File della vita 4",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 30,
            name: "Cartella",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: true,
            isnote: false,
            path: null,
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 32,
            name: "Cartella",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 33,
            name: "file.mp4",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 34,
            name: "file2.mp4",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 35,
            name: "file3.mp4",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 36,
            name: "file4.mp4",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 37,
            name: "file5.mp4",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 38,
            name: "file6.mp4",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 39,
            name: "file7.mp4",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 50,
            name: "amico der cinghiale",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 45,
            name: "file11.mp4",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 46,
            name: "file12.mp4",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 47,
            name: "file13.mp4",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 48,
            name: "file14.mp4",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          },
          {
            id: 49,
            name: "amico de ciccio",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 14,
            workgroup: 17,
            task: null
          }
        ],
        "15": [
          {
            id: 19,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 15,
            workgroup: 17,
            task: null
          },
          {
            id: 21,
            name: "File della vita 2",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 15,
            workgroup: 17,
            task: null
          }
        ],
        "18": [
          {
            id: 52,
            name: "Cartella de pasta frolla der cinghiale",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: true,
            isnote: false,
            path: null,
            size: 10000,
            owner: 10,
            folder: 18,
            workgroup: 17,
            task: null
          },
          {
            id: 57,
            name: "figlio4Del51.123",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: 18,
            workgroup: 17,
            task: null
          }
        ],
        root: [
          {
            id: 1,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: null,
            size: 10000,
            owner: 10,
            folder: "root",
            workgroup: 17,
            task: null
          },
          {
            id: 2,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: null,
            size: 10000,
            owner: 10,
            folder: "root",
            workgroup: 17,
            task: null
          },
          {
            id: 3,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: null,
            size: 10000,
            owner: 10,
            folder: "root",
            workgroup: 17,
            task: null
          },
          {
            id: 4,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: true,
            isnote: false,
            path: null,
            size: 10000,
            owner: 10,
            folder: "root",
            workgroup: 17,
            task: null
          },
          {
            id: 7,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: true,
            isnote: false,
            path: null,
            size: 10000,
            owner: 10,
            folder: "root",
            workgroup: 17,
            task: null
          },
          {
            id: 9,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: true,
            isnote: false,
            path: null,
            size: 10000,
            owner: 10,
            folder: "root",
            workgroup: 17,
            task: null
          },
          {
            id: 10,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: true,
            isnote: false,
            path: null,
            size: 10000,
            owner: 10,
            folder: "root",
            workgroup: 17,
            task: null
          },
          {
            id: 11,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: true,
            isnote: false,
            path: null,
            size: 10000,
            owner: 10,
            folder: "root",
            workgroup: 17,
            task: null
          },
          {
            id: 12,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: true,
            isnote: false,
            path: null,
            size: 10000,
            owner: 10,
            folder: "root",
            workgroup: 17,
            task: null
          },
          {
            id: 13,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: true,
            isnote: false,
            path: null,
            size: 10000,
            owner: 10,
            folder: "root",
            workgroup: 17,
            task: null
          },
          {
            id: 14,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: true,
            isnote: false,
            path: null,
            size: 10000,
            owner: 10,
            folder: "root",
            workgroup: 17,
            task: null
          },
          {
            id: 15,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: null,
            size: 10000,
            owner: 10,
            folder: "root",
            workgroup: 17,
            task: null
          },
          {
            id: 16,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: null,
            size: 10000,
            owner: 10,
            folder: "root",
            workgroup: 17,
            task: null
          },
          {
            id: 17,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: "root",
            workgroup: 17,
            task: null
          },
          {
            id: 18,
            name: "File della vita",
            creationdate: "2020-04-27T00:18:39.000Z",
            isfolder: false,
            isnote: false,
            path: "nomedellapath",
            size: 10000,
            owner: 10,
            folder: "root",
            workgroup: 17,
            task: null
          }
        ]
      }
    };
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
</style>
