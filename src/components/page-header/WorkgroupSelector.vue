<template>
  <NeuContainer class="workgroup-selector px-5" color="#2F80ED">
    <p class="current-workgroup">Team 1</p>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";

export default { name: "WorkgroupSelector", components: { NeuContainer } };
</script>

<style scoped>
.workgroup-selector {
  height: 50px;
  line-height: 50px;
  cursor: pointer;
}
</style>