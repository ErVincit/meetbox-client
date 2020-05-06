<template>
  <div class="activity container-fluid h-100 d-flex flex-column">
    <PageHeader />
    <div id="page-content" class="row flex-grow-1">
      <Recents currentPage="activity" />
      <main class="col col-lg-9 d-flex flex-column">
        <p class="m-0">Attività</p>
        <hr class="mt-0 mb-2" />
        <div class="row p-2 pb-4 flex-grow-1 align-items-start">
          <p v-if="!sections">Caricamento...</p>
          <Section
            class="mx-2 p-3"
            v-for="section in sections"
            :key="section.id"
            :title="section.title"
            :tasks="section.tasks"
            @showTask="showTask"
          />
        </div>
        <TaskInspector
          v-if="showTaskInspector"
          ref="task-inspector"
          :task="taskToShow"
        />
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
import Section from "@/components/section/Section";
import TaskInspector from "@/components/task/TaskInspector";

const handleOutsideClick = function(event) {
  if (!this.showTaskInspector) return;
  const taskInspector = this.$refs["task-inspector"].$vnode.elm;
  if (!taskInspector.contains(event.target)) this.showTaskInspector = false;
};

export default {
  name: "Activity",
  data() {
    return {
      sections: null,
      showTaskInspector: false,
      taskToShow: null
    };
  },
  components: { PageHeader, Recents, Section, TaskInspector },
  created() {
    const { workgroupId } = this.$route.params;
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/section/`;
    fetch(url, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then(data => data.json())
      .then(json => (this.sections = json.data));
  },
  methods: {
    showTask(task) {
      this.taskToShow = task;
      this.showTaskInspector = true;
    }
  },
  mounted() {
    document.addEventListener("click", handleOutsideClick.bind(this));
  },
  destroyed() {
    document.removeEventListener("click", handleOutsideClick.bind(this));
  }
};
</script>

<style></style>
