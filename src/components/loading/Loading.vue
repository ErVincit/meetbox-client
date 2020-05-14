<template>
  <div
    v-if="show"
    class="m-auto text-align-center d-flex flex-column align-items-center loading"
  >
    <div class="spinner-border my-4" role="status">
      <span class="sr-only">Caricamento...</span>
    </div>
    <p v-if="!hideMessage">{{ loadingMessage }}</p>
  </div>
</template>

<script>
export default {
  name: "Loading",
  props: { show: Boolean, hideMessage: { type: Boolean, default: false } },
  computed: {
    loadingMessage() {
      const messages = [
        "Invertendo tempo e spazio...",
        "Girando violentemente attorno all'asse y...",
        "Perfavore attendi mentre i piccoli elfi disegnano la tua mappa...",
        "Spostando i satelliti in posizione...",
        "Contando all'indietro da infinito..."
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
  }
};
</script>

<style scoped>
.loading {
  color: #1c4885;
}
.loading > div {
  width: 3rem;
  height: 3rem;
}
</style>
