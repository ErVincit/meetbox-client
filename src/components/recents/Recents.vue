<template>
  <div id="recents" class="col col-lg-2 p-2 d-none d-lg-block">
    <div class="mb-5">
      <p class="text-left m-0 mb-2">Attività</p>
      <NeuButton class="mt-3">Ciao</NeuButton>
      <NeuButton class="mt-3">Ciao</NeuButton>
      <NeuButton class="mt-3">Ciao</NeuButton>
      <NeuButton
        class="mt-3"
        backgroundColor="#2F80ED"
        color="white"
        :shadowRadius="2"
        :shadowBlur="6"
      >Vai alle attività</NeuButton>
    </div>
    <div class="mb-5">
      <p class="text-left m-0 mb-2">Appuntamenti</p>
      <NeuButton class="mt-3">Ciao</NeuButton>
      <NeuButton class="mt-3">Ciao</NeuButton>
      <NeuButton class="mt-3">Ciao</NeuButton>
      <NeuButton
        class="mt-3"
        backgroundColor="#2F80ED"
        color="white"
        :shadowRadius="2"
        :shadowBlur="6"
      >Vai al calendario</NeuButton>
    </div>
  </div>
</template>

<script>
// import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuButton from "@/components/neu-button/NeuButton";

export default {
  name: "Recents",
  components: { NeuButton }
};
</script>

<style>
</style>