<template>
  <div class="activity container-fluid h-100 d-flex flex-column">
    <PageHeader />
    <div id="page-content" class="row flex-grow-1">
      <Recents currentPage="activity" />
      <main class="col col-lg-9 d-flex flex-column">
        <p class="page__title m-0">Attività</p>
        <hr class="m-0" />
        <div
          class="row pl-3 py-3 flex-grow-1 align-items-start flex-nowrap overflow-auto"
        >
          <Loading :show="!allTasks" />
          <draggable
            :list="allTasks"
            :disabled="editingSection"
            ghost-class="ghost"
            class="d-flex"
          >
            <div class="pr-3" v-for="section in allTasks" :key="section.id">
              <Section
                class="px-3 py-3"
                :section="section"
                @showTask="showTask(section.id, ...arguments)"
                @drag-start="handleDragStart(section.id, ...arguments)"
                @drag-end="dragging = false"
                @start-editing="editingSection = true"
                @end-editing="editingSection = false"
              />
            </div>
          </draggable>
        </div>
        <TaskInspector
          v-if="showTaskInspector"
          ref="task-inspector"
          :task="taskToShow"
          :sectionId="sectionToShow"
          @hide="showTaskInspector = false"
        />
        <NeuContainer
          v-if="dragging"
          class="trash"
          ref="trash"
          @drop="removeTask"
          @dragover.prevent
          disableHover
        >
          <p class="m-0 px-3">
            Rilascia le attività qui per eliminarle
          </p>
        </NeuContainer>
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
import NeuContainer from "@/components/neu-button/NeuContainer";
import TaskInspector from "@/components/task/TaskInspector";
import Loading from "@/components/loading/Loading";

import { mapGetters, mapActions } from "vuex";
import draggable from "vuedraggable";

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
      taskToShow: null,
      sectionToShow: null,
      dragging: false,
      draggingItemInfo: null,
      editingSection: false
    };
  },
  components: {
    PageHeader,
    Recents,
    Section,
    TaskInspector,
    NeuContainer,
    Loading,
    draggable
  },
  computed: mapGetters(["allTasks"]),
  created() {
    const { workgroupId } = this.$route.params;
    this.fetchTasks(workgroupId);
  },
  methods: {
    ...mapActions(["fetchTasks", "deleteTask"]),
    showTask(section, task) {
      this.taskToShow = task;
      this.sectionToShow = section;
      this.showTaskInspector = true;
    },
    handleDragStart(sectionIndex, taskIndex) {
      this.draggingItemInfo = { section: sectionIndex, task: taskIndex };
      this.dragging = true;
    },
    removeTask() {
      const { section, task } = this.draggingItemInfo;
      const { workgroupId } = this.$route.params;
      this.deleteTask({ workgroupId, sectionId: section, taskId: task.id });
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

<style>
.trash {
  width: calc(100% - 20px);
  min-height: 100px;
  height: auto !important;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 10px;
  left: 10px;
  right: 10px;
  border: 2px dashed rgb(252, 109, 109);
  color: black !important;
  border-radius: 30px;
}

.trash p {
  font-size: 30px;
  color: rgb(252, 109, 109);
}

@media (max-width: 991.98px) {
  .page__title {
    font-size: 2rem;
    color: #2f80ed;
  }
}
</style>
