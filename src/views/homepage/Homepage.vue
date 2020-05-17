<template>
  <div class="homepage h-100 d-flex flex-column overflow-auto">
    <header class="container-fluid row align-items-center m-0 p-2 pb-3 pb-lg-2">
      <Logo
        class="col-12 col-lg pb-3 pb-lg-0 d-flex justify-content-center justify-content-lg-start"
      />
      <router-link to="/login" class="col-6 col-lg-2">
        <NeuButton class="w-100" color="#2F80ED">Accedi</NeuButton>
      </router-link>
      <router-link to="/signup" class="col-6 col-lg-2">
        <NeuButton
          class="w-100"
          backgroundColor="#2F80ED"
          color="white"
          :shadowRadius="2"
          :shadowBlur="6"
        >
          Registrati
        </NeuButton>
      </router-link>
      <span
        class="col-auto rounded-circle d-flex align-items-center justify-content-center dark-btn"
        @click="changeTheme"
      >
        🌙
      </span>
    </header>
    <main
      class="flex-grow-1 d-flex align-items-center flex-column position-relative"
    >
      <img
        id="draw-left"
        class="d-none d-md-block"
        src="@/assets/homepage-draw-left.svg"
      />
      <img
        id="draw-right"
        class="d-none d-md-block"
        src="@/assets/homepage-draw-right.svg"
      />
      <h1 class="text-center my-5 py-5">
        Collabora in modo
        <br />semplice e veloce
      </h1>
      <div class="row w-75 justify-content-center">
        <div class="p-2 col-12 col-md-6 col-lg-3">
          <NeuContainer class="p-2 text-center h-100">
            <img class="my-3" src="@/assets/homepage-drive.svg" />
            <h3 style="color: #2F80ED; font-weight: 600">Archivia</h3>
            <p>
              Puoi archiviare qualsiasi formato. Conserva foto, progetti,
              disegni, registrazioni, video e molto altro...
            </p>
          </NeuContainer>
        </div>
        <div class="p-2 col-12 col-md-6 col-lg-3">
          <NeuContainer class="p-2 text-center h-100">
            <img class="my-3" src="@/assets/homepage-activity.svg" />
            <h3 style="color: #27AE60; font-weight: 600">Organizza</h3>
            <p>
              Crea le tue attività, assegnale ad uno o più membri e rispettare
              le scadenze sarà una garanzia
            </p>
          </NeuContainer>
        </div>
        <div class="p-2 col-12 col-md-6 col-lg-3">
          <NeuContainer class="p-2 text-center h-100">
            <img class="my-3" src="@/assets/homepage-calendar.svg" />
            <h3 style="color: #EB5757; font-weight: 600">Pianifica</h3>
            <p>
              Usa un intero calendario per te ed il tuo gruppo di lavoro, la
              pianificazione potrà essere così condivisa
            </p>
          </NeuContainer>
        </div>
        <div class="p-2 col-12 col-md-6 col-lg-3">
          <NeuContainer class="p-2 text-center h-100">
            <img class="my-3" src="@/assets/homepage-team.svg" />
            <h3 style="color: #F2C94C; font-weight: 600">Collabora</h3>
            <p>
              La collaborazione è fondamentale in gruppo di lavoro. Aggiungi e
              rimuovi membri in modo semplice e rapido
            </p>
          </NeuContainer>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Logo from "@/components/logo/Logo";
import NeuButton from "@/components/neu-button/NeuButton";
import NeuContainer from "@/components/neu-button/NeuContainer";

import { mapActions } from "vuex";

export default {
  name: "Homepage",
  components: { Logo, NeuButton, NeuContainer },
  methods: mapActions(["changeTheme"])
};
</script>

<style scoped>
main > h1 {
  font-weight: 600;
  font-size: 5vw;
  z-index: 100;
  max-width: 80%;
  color: var(--homepage-text-color);
}
@media (max-width: 992px) {
  main > h1 {
    font-size: 8vw;
  }
}

#draw-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 10%;
  max-height: 100%;
}

#draw-right {
  position: absolute;
  top: 0;
  right: 0;
  width: 10%;
  max-height: 100%;
}

.dark-btn {
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.3);
  transition: all 500ms;
  cursor: pointer;
}
.dark-btn:hover {
  background-color: #222;
}
</style>
