<template>
  <div class="activity container-fluid h-100 d-flex flex-column">
    <PageHeader @open-navbar="openNavBar = !openNavBar">
      <p class="page__title m-0 mx-2">Attività</p>
    </PageHeader>
    <div
      id="page-content"
      class="row flex-grow-1"
      style="height: calc(100% - 100px)"
    >
      <LeftNavBar class="h-100" :open="openNavBar" />
      <main class="col d-flex flex-column h-100 px-4">
        <p class="page__title m-0 d-none d-lg-block">Attività</p>
        <hr class="m-0" />
        <div
          class="row pl-3 py-4 flex-grow-1 align-items-start flex-nowrap"
          style="overflow-x: auto; overflow-y: hidden"
        >
          <Loading :show="loading" />
          <p
            v-if="!loading && allTasks && allTasks.length == 0"
            class="mt-2 highlight"
            style="font-size: 24px; color: #787878; max-width: 750px"
          >
            Inizia subito a riempire questo spazio vuoto, crea una sezione con
            il pulsante a destra!
          </p>
          <draggable
            v-if="!loading"
            :list="allTasks"
            :disabled="editingSection"
            ghost-class="ghost"
            @change="handleSectionMove"
            class="d-flex h-100 align-items-start"
            draggable=".section"
          >
            <Section
              v-for="section in allTasks"
              :key="section.id"
              class="py-3 mr-4 mh-100 d-flex flex-column"
              :section="section"
              @showTask="showTask(section.id, ...arguments)"
              @drag-start="handleDragStart(section.id, ...arguments)"
              @drag-end="dragging = false"
              @start-editing="editingSection = true"
              @end-editing="editingSection = false"
            />
          </draggable>
          <Alert
            v-if="alertShowed"
            :message="alertMessage"
            @close="alertShowed = false"
            :type="alertType"
          />
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
      <Actions class="h-100">
        <NeuButton
          @click="createSection"
          class="d-flex justify-content-center align-items-center"
          style="width: 50px; height: 50px"
          v-tooltip:left="'Crea sezione'"
        >
          <img src="@/assets/addIcon.svg" />
        </NeuButton>
      </Actions>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/page-header/PageHeader";
import LeftNavBar from "@/components/page-header/LeftNavBar";
import Section from "@/components/section/Section";
import NeuContainer from "@/components/neu-button/NeuContainer";
import TaskInspector from "@/components/task/TaskInspector";
import Loading from "@/components/loading/Loading";
import NeuButton from "@/components/neu-button/NeuButton";
import Actions from "@/components/actions/Actions";
import Alert from "@/components/alert/Alert";

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
      showTaskInspector: false,
      taskToShow: null,
      sectionToShow: null,
      dragging: false,
      draggingItemInfo: null,
      editingSection: false,
      loading: false,
      alertShowed: false,
      alertMessage: "",
      alertType: "",
      openNavBar: false
    };
  },
  components: {
    PageHeader,
    LeftNavBar,
    Section,
    TaskInspector,
    NeuContainer,
    Loading,
    NeuButton,
    Actions,
    Alert,
    draggable
  },
  computed: mapGetters(["allTasks"]),
  created() {
    const { workgroupId } = this.$route.params;
    this.loading = true;
    this.fetchTasks(workgroupId).then(() => (this.loading = false));
  },
  watch: {
    $route() {
      const { workgroupId } = this.$route.params;
      this.loading = true;
      this.fetchTasks(workgroupId).then(() => (this.loading = false));
    }
  },
  methods: {
    ...mapActions(["fetchTasks", "deleteTask", "addSection", "editSection"]),
    showTask(section, task) {
      this.taskToShow = task;
      this.sectionToShow = section;
      this.showTaskInspector = true;
    },
    handleDragStart(sectionIndex, taskIndex) {
      this.draggingItemInfo = { section: sectionIndex, task: taskIndex };
      this.dragging = true;
    },
    async removeTask() {
      const { section, task } = this.draggingItemInfo;
      const { workgroupId } = this.$route.params;
      this.showAlert("info", "Rimozione in corso...");
      await this.deleteTask({
        workgroupId,
        sectionId: section,
        taskId: task.id
      });
      this.alertShowed = false;
    },
    async createSection() {
      const { workgroupId } = this.$route.params;
      this.showAlert("info", "Creazione in corso...");
      await this.addSection({
        workgroupId,
        section: { title: "Nuova sezione" }
      });
      this.alertShowed = false;
    },
    async handleSectionMove({ moved }) {
      const { workgroupId } = this.$route.params;
      await this.editSection({
        workgroupId,
        sectionId: moved.element.id,
        editObject: { index: moved.newIndex }
      });
    },
    showAlert(type, message) {
      this.alertType = type;
      this.alertMessage = message;
      this.alertShowed = true;
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
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  border: 2px dashed rgb(252, 109, 109);
  color: black !important;
  border-radius: 30px;
}

.trash p {
  font-size: 30px;
  color: rgb(252, 109, 109);
}

.page__title {
  font-size: 2rem;
  color: var(--primary);
}
</style>
