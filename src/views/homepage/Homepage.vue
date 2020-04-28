<template>
  <div class="homepage h-100 d-flex flex-column">
    <header class="container-fluid d-flex flex-row justify-content-between align-items-center">
      <Logo class="logo" />
      <div class="homepage__buttons">
        <router-link to="/login">
          <NeuButton class="m-2" color="#2F80ED">Accedi</NeuButton>
        </router-link>
        <router-link to="/signup">
          <NeuButton
            class="m-2"
            backgroundColor="#2F80ED"
            color="white"
            :shadowRadius="2"
            :shadowBlur="6"
          >Registrati</NeuButton>
        </router-link>
      </div>
    </header>
    <main class="flex-grow-1">
      <h1>
        Collabora in modo
        <br />semplice e veloce
      </h1>
      <img id="draw-left" src="@/assets/homepage-draw-left.svg" />
      <img id="draw-right" src="@/assets/homepage-draw-right.svg" />
      <div class="homepage__section d-flex justify-content-between">
        <NeuContainer class="p-2 m-2">
          <img src="@/assets/homepage-drive.svg" />
          <h3>Archivia</h3>
          <p>Conserva foto, progetti, disegni, registrazioni, video e molto altro</p>
        </NeuContainer>
        <NeuContainer class="p-2 m-2">
          <img src="@/assets/homepage-drive.svg" />
          <h3>Archivia</h3>
          <p>Conserva foto, progetti, disegni, registrazioni, video e molto altro</p>
        </NeuContainer>
        <NeuContainer class="p-2 m-2">
          <img src="@/assets/homepage-drive.svg" />
          <h3>Archivia</h3>
          <p>Conserva foto, progetti, disegni, registrazioni, video e molto altro</p>
        </NeuContainer>
        <NeuContainer class="p-2 m-2">
          <img src="@/assets/homepage-drive.svg" />
          <h3>Archivia</h3>
          <p>Conserva foto, progetti, disegni, registrazioni, video e molto altro</p>
        </NeuContainer>
      </div>
    </main>
  </div>
</template>

<script>
import Logo from "@/components/logo/Logo";
import NeuButton from "@/components/neu-button/NeuButton";
import NeuContainer from "@/components/neu-button/NeuContainer";

export default {
  name: "Homepage",
  components: { Logo, NeuButton, NeuContainer }
};
</script>

<style scoped>
main {
  position: relative;
}

main > h1 {
  top: 100px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 600;
  font-size: 5em;
  text-overflow: clip;
  white-space: nowrap;
  z-index: 100;
}

#draw-left {
  position: absolute;
  top: 0;
  left: 0;
}

#draw-right {
  position: absolute;
  top: 0;
  right: 0;
}

header {
  padding: 5px 10px;
}

div.homepage__buttons {
  display: flex;
}

.neu-button {
  width: 180px;
}

.neu-container {
  width: 300px;
  text-align: center;
}

div.homepage__section {
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
}
</style>