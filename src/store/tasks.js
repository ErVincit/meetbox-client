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
    commit("setSections", json.data);
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
    await fetch(url, { credentials: "include", method: "DELETE" });
  },
  async editTask({ commit }, { workgroupId, sectionId, taskId, editObject }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/section/${sectionId}/task/${taskId}/edit`;
    const response = await fetch(url, {
      credentials: "include",
      body: JSON.stringify(editObject),
      headers: { "Content-Type": "application/json" },
      method: "PUT"
    });
    const task = (await response.json()).data;
    // If the section is changed take the new
    if (editObject.section) sectionId = editObject.section;
    commit("setTask", { sectionId, task });
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
    const section = json.data;
    commit("setSection", section);
  },
  async deleteSection({ commit }, { workgroupId, sectionId }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/section/${sectionId}`;
    const response = await fetch(url, {
      credentials: "include",
      method: "DELETE"
    });
    const json = await response.json();
    const section = json.data;
    commit("removeSection", section.id);
  },
  async addSection({ commit }, { workgroupId, section }) {
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/section`;
    const response = await fetch(url, {
      credentials: "include",
      body: JSON.stringify(section),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    });
    const newSection = (await response.json()).data;
    commit("newSection", newSection);
  },
  clearLabel({ commit }, labelId) {
    commit("clearLabel", labelId);
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
  }
};

export default { state, getters, actions, mutations };
