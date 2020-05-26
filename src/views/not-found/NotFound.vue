<template>
  <div class="w-100 h-100 overflow-auto">
    <div class="d-flex flex-column align-items-center text-center">
      <Logo class="p-5" />
      <img src="@/assets/404_image.svg" width="300px" height="300px" />
      <h1 class="w-50 my-5" style="color: var(--text-color-bg)">
        Sembra che la pagina che stai cercando è stata rapita dagli 👽
      </h1>
      <router-link to="/" class="my-5 w-50">
        <NeuButton>Torna alla pagina principale</NeuButton>
      </router-link>
      <img id="draw-left" src="@/assets/homepage-draw-left.svg" />
      <img id="draw-right" src="@/assets/homepage-draw-right.svg" />
    </div>
  </div>
</template>

<script>
import Logo from "@/components/logo/Logo";
import NeuButton from "@/components/neu-button/NeuButton";

export default { name: "NotFound", components: { Logo, NeuButton } };
</script>

<style scoped>
.neu-button {
  height: 50px;
}

#draw-left {
  position: absolute;
  top: 0;
  left: 0;
  max-width: 10%;
  height: 100%;
  object-fit: cover;
  object-position: right;
  width: auto;
}

#draw-right {
  position: absolute;
  top: 0;
  right: 0;
  max-width: 10%;
  height: 100%;
  object-fit: cover;
  object-position: left;
  width: auto;
}
</style>
