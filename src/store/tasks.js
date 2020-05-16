const state = {
  sections: null
};

const getters = {
  allTasks: state => state.sections
};

const actions = {
  async fetchTasks({ commit }, workgroupId) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/section/`;
    const data = await fetch(url, {
      credentials: "include"
    });
    const json = await data.json();
    if (json.error) console.error(json);
    else commit("setSections", json.data);
  },
  async addTask({ commit }, { workgroupId, sectionId, task }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/section/${sectionId}/task`;
    const data = await fetch(url, {
      credentials: "include",
      body: JSON.stringify(task),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    });
    const json = await data.json();
    if (json.error) throw new Error(json.message);
    commit("newTask", { sectionId, task: json.data });
  },
  async deleteTask({ commit }, { workgroupId, sectionId, taskId }) {
    commit("removeTask", { sectionId, taskId });
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/section/${sectionId}/task/${taskId}`;
    const data = await fetch(url, { credentials: "include", method: "DELETE" });
    const json = await data.json();
    if (json.error) console.error(json);
  },
  async editTask({ commit }, { workgroupId, sectionId, taskId, editObject }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/section/${sectionId}/task/${taskId}/edit`;
    const response = await fetch(url, {
      credentials: "include",
      body: JSON.stringify(editObject),
      headers: { "Content-Type": "application/json" },
      method: "PUT"
    });
    const json = await response.json();
    if (json.error) console.error(json);
    else {
      const task = json.data;
      // If the section is changed take the new
      if (editObject.section) sectionId = editObject.section;
      commit("setTask", { sectionId, task });
    }
  },
  async editSection({ commit }, { workgroupId, sectionId, editObject }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/section/${sectionId}/edit`;
    const response = await fetch(url, {
      credentials: "include",
      body: JSON.stringify(editObject),
      headers: { "Content-Type": "application/json" },
      method: "PUT"
    });
    const json = await response.json();
    if (json.error) console.error(json);
    else {
      const section = json.data;
      commit("setSection", section);
    }
  },
  async deleteSection({ commit }, { workgroupId, sectionId }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/section/${sectionId}`;
    const response = await fetch(url, {
      credentials: "include",
      method: "DELETE"
    });
    const json = await response.json();
    if (json.error) console.error(json);
    else {
      const section = json.data;
      commit("removeSection", section.id);
    }
  },
  async addSection({ commit }, { workgroupId, section }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/section`;
    const response = await fetch(url, {
      credentials: "include",
      body: JSON.stringify(section),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    });
    const json = await response.json();
    if (json.error) console.error(json);
    else commit("newSection", json.data);
  },
  clearLabel({ commit }, labelId) {
    commit("clearLabel", labelId);
  },
  async uploadAttachment({ commit }, { workgroupId, sectionId, taskId, file }) {
    const formData = new FormData();
    formData.append("fileToUpload", file);
    let url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/drive/upload`;
    let response = await fetch(url, {
      method: "POST",
      body: formData,
      credentials: "include"
    });
    let json = await response.json();
    const creationDetails = {
      name: file.name,
      isFolder: false,
      isNote: false,
      task: taskId,
      path: json.path,
      size: json.size
    };
    url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/drive/create`;
    response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(creationDetails),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    });
    json = await response.json();
    if (json.error) console.error(json);
    else commit("newAttachment", { sectionId, taskId, document: json.data });
  },
  async deleteAttachment({ commit }, { workgroupId, sectionId, taskId, file }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/drive/document/${file.id}`;
    const response = await fetch(url, {
      method: "DELETE",
      credentials: "include"
    });
    const json = await response.json();
    if (json.error) console.error(json);
    else commit("removeAttachment", { sectionId, taskId, file });
  }
};

import Vue from "vue";

const mutations = {
  setSections: (state, sections) => (state.sections = sections),
  setSection: (state, section) => {
    const sectionIndex = state.sections.findIndex(s => s.id === section.id);
    section.tasks = state.sections[sectionIndex].tasks;
    state.sections[sectionIndex] = section;
  },
  newSection: (state, section) => {
    state.sections.push(section);
  },
  removeSection: (state, sectionId) => {
    state.sections = state.sections.filter(s => s.id != sectionId);
  },
  setTasks: (state, { sectionId, tasks }) =>
    (state.sections.find(section => section.id === sectionId).tasks = tasks),
  newTask: (state, { sectionId, task }) =>
    state.sections.find(section => section.id === sectionId).tasks.push(task),
  removeTask: (state, { sectionId, taskId }) => {
    const section = state.sections.find(section => section.id === sectionId);
    section.tasks = section.tasks.filter(task => task.id !== taskId);
  },
  setTask: (state, { sectionId, task }) => {
    const section = state.sections.find(section => section.id === sectionId);
    const taskIndex = section.tasks.findIndex(t => t.id === task.id);
    section.tasks[taskIndex] = task;
  },
  clearLabel: (state, labelId) => {
    for (
      let sectionIndex = 0;
      sectionIndex < state.sections.length;
      sectionIndex++
    ) {
      const section = state.sections[sectionIndex];
      for (let taskIndex = 0; taskIndex < section.tasks.length; taskIndex++) {
        const label = section.tasks[taskIndex].label;
        if (label === labelId) {
          const task = section.tasks[taskIndex];
          task.label = null;
          Vue.set(state.sections, sectionIndex, section);
        }
      }
    }
  },
  newAttachment: (state, { sectionId, taskId, document }) => {
    const section = state.sections.find(section => section.id === sectionId);
    const task = section.tasks.find(t => t.id === taskId);
    task.attachments.push(document);
  },
  removeAttachment: (state, { sectionId, taskId, file }) => {
    const section = state.sections.find(section => section.id === sectionId);
    const task = section.tasks.find(t => t.id === taskId);
    const attachmentIndex = task.attachments.findIndex(
      att => att.id === file.id
    );
    task.attachments.splice(attachmentIndex, 1);
  }
};

export default { state, getters, actions, mutations };
