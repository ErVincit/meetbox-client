// Quali dati ci sono nello store
const state = {
  tree: null
};

// Campi che vogliamo offrire all'esterno (computed)
const getters = {
  tree: state => state.tree
};

// Metodi che puoi eseguire sullo store (methods)
const actions = {
  async fetchTree({ commit }, workgroupId) {
    state.tree = null;
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/drive/tree`;
    const data = await fetch(url, {
      credentials: "include"
    });
    const json = await data.json();
    if (json.error) console.error(json);
    else commit("setTree", json.result);
  },
  async uploadDocument({ dispatch }, { workgroupId, folder, file }) {
    const formData = new FormData();
    formData.append("fileToUpload", file);
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/drive/upload`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      credentials: "include"
    });
    const json = await response.json();
    if (json.error) throw new Error(json.message);
    const creationDetails = {
      name: file.name,
      isFolder: false,
      isNote: false,
      workgroup: workgroupId,
      members: [],
      path: json.path,
      size: json.size
    };
    if (folder !== "root") creationDetails.folder = folder;
    await dispatch("addDocument", { workgroupId, folder, creationDetails });
  },
  async removeDocument({ commit }, { workgroupId, documentId }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/drive/document/${documentId}`;
    await fetch(url, {
      credentials: "include",
      method: "DELETE"
    });
    // const json = await data.json();
    // console.log(json);
    commit("deleteDocument", documentId);
  },
  async editName({ commit }, { workgroupId, documentId, editObject }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/drive/document/${documentId}/edit`;
    await fetch(url, {
      credentials: "include",
      body: JSON.stringify(editObject),
      headers: { "Content-Type": "application/json" },
      method: "PUT"
    });
    const name = editObject.name;
    commit("editTitle", { documentId, name });
  },
  async addDocument({ commit }, { workgroupId, creationDetails }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/drive/create`;
    const response = await fetch(url, {
      credentials: "include",
      body: JSON.stringify(creationDetails),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    });
    const json = await response.json();
    if (json.error) throw new Error(json.message);
    const document = json.data;
    commit("addDocument", document);
  },
  async editMembers({ commit }, { workgroupId, documentId, editObject }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/drive/document/${documentId}/edit`;
    const response = await fetch(url, {
      credentials: "include",
      body: JSON.stringify(editObject),
      headers: { "Content-Type": "application/json" },
      method: "PUT"
    });
    const json = await response.json();
    if (json.error) console.error(json);
    else {
      const document = json.data;
      commit("deleteDocument", document.id);
      commit("addDocument", document);
    }
  },
  async moveFile(
    { commit },
    { workgroupId, documentId, pastFolder, editObject }
  ) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/drive/document/${documentId}/edit`;
    const response = await fetch(url, {
      credentials: "include",
      body: JSON.stringify(editObject),
      headers: { "Content-Type": "application/json" },
      method: "PUT"
    });
    const json = await response.json();
    if (json.error) console.error(json);
    else {
      const document = json.data;
      commit("moveTo", { document, pastFolder, folder: document.folder });
    }
  }
};

const delFolder = (tree, folderId) => {
  for (const doc of tree[folderId]) if (doc.isFolder) delFolder(tree, doc.id);
  delete tree[folderId];
};

import Vue from "vue";

// Imposta i valori nello stato
const mutations = {
  setTree: (state, tree) => (state.tree = tree),
  deleteDocument: (state, documentId) => {
    if (state.tree[documentId]) delFolder(state.tree, documentId);
    const values = Object.values(state.tree);
    for (const folder of values)
      for (const doc of folder) {
        if (doc.id === documentId) {
          if (!doc.folder) doc.folder = "root";
          state.tree[doc.folder] = state.tree[doc.folder].filter(
            doc => doc.id !== documentId
          );
        }
      }
  },
  editTitle: (state, { documentId, name }) => {
    const values = Object.values(state.tree);
    for (const folder of values)
      for (const doc of folder) {
        if (doc.id === documentId) doc.name = name;
      }
  },
  addDocument: (state, document) => {
    if (!document.folder) document.folder = "root";
    if (state.tree[document.folder]) state.tree[document.folder].push(document);
    else Vue.set(state.tree, document.folder, [document]);
  },
  moveTo: (state, { document, pastFolder, folder }) => {
    if (!pastFolder) pastFolder = "root";
    if (!folder) folder = "root";
    state.tree[pastFolder] = state.tree[pastFolder].filter(
      doc => doc.id != document.id
    );
    state.tree[folder].push(document);
  }
};

export default { state, getters, actions, mutations };
