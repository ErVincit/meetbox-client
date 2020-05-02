<template>
  <div class="activity container-fluid h-100 d-flex flex-column">
    <PageHeader />
    <div id="page-content" class="row flex-grow-1">
      <Recents currentPage="activity" />
      <main class="col col-lg-9 d-flex flex-column">
        <p class="m-0">Attività</p>
        <hr class="mt-0 mb-2" />
        <div class="row p-2 pb-4 flex-grow-1 align-items-start">
          <Section
            class="mx-2 p-3"
            v-for="section in sections"
            :key="section.id"
            :title="section.title"
            :tasks="section.tasks"
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
import Section from "@/components/section/Section";

export default {
  name: "Activity",
  data() {
    return {
      sections: []
    };
  },
  components: { PageHeader, Recents, Section },
  created() {
    const { workgroupId } = this.$route.params;
    const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/workgroup/${workgroupId}/activity/section/`;
    fetch(url, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    }).then(async value => {
      const data = await value.json();
      console.log(data);
      this.sections = data.data;
    });
  }
};
</script>

<style></style>
