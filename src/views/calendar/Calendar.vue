<template>
  <div class="activity container-fluid h-100 d-flex flex-column">
    <PageHeader />
    <div id="page-content" class="row flex-grow-1">
      <Recents currentPage="calendar" />
      <main class="col col-lg-9">
        <p class="m-0">Attività</p>
        <hr class="mt-0 mb-2" />
        <Section />
        <!-- -> 96 sezioni per ogni 15min -->
        <div class="ciotto">
          <MinuteCalendar
            v-for="element in tree"
            :key="element"
            :value="element"
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
import MinuteCalendar from "@/views/calendar/MinuteCalendar";

export default {
  name: "Calendar",
  components: { PageHeader, Recents, MinuteCalendar },
  data() {
    const list = [];
    for (var i = 0; i < 288; i++) list.push(i);
    return {
      tree: list
    };
  }
};
</script>

<style>
.ciotto {
  display: flex;
  height: 20px;
  width: 100%;
}
</style>
