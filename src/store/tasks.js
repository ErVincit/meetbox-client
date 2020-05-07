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
  }
};

const mutations = {
  setSections: (state, sections) => (state.sections = sections),
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
  }
};

export default { state, getters, actions, mutations };
