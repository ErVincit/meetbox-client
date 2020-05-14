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
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/drive/tree`;
    const data = await fetch(url, {
      credentials: "include"
    });
    const json = await data.json();
    commit("setTree", json.result);
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
    console.log(workgroupId, documentId, editObject);
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/drive/document/${documentId}/edit`;
    const response = await fetch(url, {
      credentials: "include",
      body: JSON.stringify(editObject),
      headers: { "Content-Type": "application/json" },
      method: "PUT"
    });
    console.log(await response.json());
    const name = editObject.name;
    commit("editTitle", { documentId, name });
  }
};

const delFolder = (tree, folderId) => {
  for (const doc of tree[folderId]) if (doc.isFolder) delFolder(tree, doc.id);
  delete tree[folderId];
};

// Imposta i valori nello stato
const mutations = {
  setTree: (state, tree) => (state.tree = tree),
  deleteDocument: (state, documentId) => {
    console.log(documentId);
    if (state.tree[documentId]) delFolder(state.tree, documentId);
    const values = Object.values(state.tree);
    for (const folder of values)
      for (const doc of folder) {
        if (doc.id === documentId) {
          console.log("Found document", doc);
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
  }
};

export default { state, getters, actions, mutations };
