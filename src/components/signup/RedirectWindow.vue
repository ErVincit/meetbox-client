<template>
  <NeuContainer class="redirect-window w-50 px-5 py-4" disableHover>
    <Logo class="my-5" />
    <div id="messaggio">
      <h3 class="hightlight font-weight-bold my-2">
        Registrazione effettuata
      </h3>
      <img id="spunta" src="@/assets/spunta-blu-png-.png" />
    </div>
    <p class="my-4 mb-5">
      Clicca qui per effettuare il login:
      <router-link to="/Login">Accedi</router-link>
    </p>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import Logo from "@/components/logo/Logo";

export default {
  name: "RedirectWindow",
  components: { NeuContainer, Logo }
};
</script>

<style>
.redirect-window {
  position: fixed;
  display: flex;
  flex-direction: column;
  text-align: center;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
.hightlight {
  color: #1c4885;
}
#messaggio {
  display: flex;
  align-items: center;
  justify-content: center;
}
#spunta {
  width: 50px;
  height: auto;
  margin: 4pt;
}
</style>
