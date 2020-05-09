<template>
  <NeuContainer
    class="workgroup-selector d-flex px-2 justify-content-center align-items-center"
    color="#2F80ED"
  >
    <img
      v-if="currentWorkgroup"
      class="rounded-circle mr-3"
      :src="currentWorkgroup.image"
    />
    <p class="current-workgroup m-0">
      {{ currentWorkgroup ? currentWorkgroup.name : "Caricamento..." }}
    </p>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";

import { mapActions, mapGetters } from "vuex";

export default {
  name: "WorkgroupSelector",
  components: { NeuContainer },
  methods: mapActions(["fetchWorkgroups"]),
  computed: {
    ...mapGetters(["workgroups"]),
    currentWorkgroup() {
      const { workgroupId } = this.$route.params;
      if (this.workgroups)
        return this.workgroups.find(wg => wg.id === parseInt(workgroupId));
      return null;
    }
  },
  mounted() {
    this.fetchWorkgroups();
  }
};
</script>

<style scoped>
.workgroup-selector {
  height: 50px;
  line-height: 50px;
  cursor: pointer;
}

p {
  font-weight: 600;
  font-size: 22px;
}

img {
  width: 35px;
  height: 35px;
}
</style>
