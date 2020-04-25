<template>
  <div class="homepage h-100 d-flex flex-column">
    <header class="container-fluid d-flex flex-row justify-content-between align-items-center">
      <Logo class="logo" />
      <div class="homepage__buttons">
        <router-link to="/login">
          <NeuButton value="Accedi" color="#2F80ED" />
        </router-link>
        <router-link to="/signup">
          <NeuButton
            value="Registrati"
            backgroundColor="#2F80ED"
            color="white"
            :radius="2"
            :blur="6"
          />
        </router-link>
      </div>
    </header>
    <main class="flex-grow-1">
      <h1>
        Collabora in modo
        <br />semplice e veloce
      </h1>
      <img id="draw-left" src="../../assets/homepage-draw-left.svg" />
      <img id="draw-right" src="../../assets/homepage-draw-right.svg" />
    </main>
  </div>
</template>

<script>
import Logo from "../../components/logo/Logo";
import NeuButton from "../../components/neu-button/NeuButton";

export default {
  name: "Homepage",
  components: { Logo, NeuButton }
};
</script>

<style>
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

.neu-button {
  margin: 0px 5px;
  width: 200px;
  height: 50px;
  line-height: 50px;
  font-size: 24px;
  padding: 0;
  font-weight: 600;
}
</style>