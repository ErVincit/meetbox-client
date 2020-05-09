<template>
  <div id="recents" class="col col-lg-2 p-2 d-none d-lg-block">
    <div class="mb-5" :class="{ hide: hideDrive }">
      <p class="text-left m-0 mb-2">Documenti</p>
      <NeuButton class="mt-3">Ciao</NeuButton>
      <NeuButton class="mt-3">Ciao</NeuButton>
      <NeuButton class="mt-3">Ciao</NeuButton>
      <router-link
        :to="{
          name: 'drive',
          params: { workgroupId: 17 }
        }"
        ><NeuButton
          class="mt-3"
          backgroundColor="#2F80ED"
          color="white"
          :shadowRadius="2"
          :shadowBlur="6"
          >Vai ai documenti</NeuButton
        ></router-link
      >
    </div>
    <div class="mb-5" :class="{ hide: hideActivity }">
      <p class="text-left m-0 mb-2">Attività</p>
      <NeuButton class="mt-3">Ciao</NeuButton>
      <NeuButton class="mt-3">Ciao</NeuButton>
      <NeuButton class="mt-3">Ciao</NeuButton>
      <router-link
        :to="{
          name: 'activity',
          params: { workgroupId: 17 }
        }"
        ><NeuButton
          class="mt-3"
          backgroundColor="#2F80ED"
          color="white"
          :shadowRadius="2"
          :shadowBlur="6"
          >Vai alle attività</NeuButton
        ></router-link
      >
    </div>
    <div class="mb-5" :class="{ hide: hideCalendar }">
      <p class="text-left m-0 mb-2">Appuntamenti</p>
      <NeuButton class="mt-3">Ciao</NeuButton>
      <NeuButton class="mt-3">Ciao</NeuButton>
      <NeuButton class="mt-3">Ciao</NeuButton>
      <router-link
        :to="{
          name: 'calendar',
          params: { workgroupId: 17 }
        }"
      >
        <NeuButton
          class="mt-3"
          backgroundColor="#2F80ED"
          color="white"
          :shadowRadius="2"
          :shadowBlur="6"
          >Vai al calendario</NeuButton
        ></router-link
      >
    </div>
  </div>
</template>

<script>
import NeuButton from "@/components/neu-button/NeuButton";

import { mapActions } from "vuex";

export default {
  name: "Recents",
  props: {
    currentPage: {
      required: true,
      validator: value =>
        ["drive", "activity", "calendar"].indexOf(value) !== -1
    }
  },
  components: { NeuButton },
  methods: mapActions(["fetchWorkgroups"]),
  mounted() {
    this.fetchWorkgroups();
  },
  computed: {
    hideDrive() {
      return this.currentPage === "drive";
    },
    hideActivity() {
      return this.currentPage === "activity";
    },
    hideCalendar() {
      return this.currentPage === "calendar";
    }
  }
};
</script>

<style scoped>
.hide {
  display: none;
}
</style>
