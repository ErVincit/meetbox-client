<template>
  <div class="w-100 h-100">
    <div class="d-flex flex-column align-items-center text-center">
      <Logo class="p-5" />
      <h1 style="margin: 100px 10%">
        😥 Ci dispiace, ma questa pagina non è disponibile
      </h1>
      <router-link to="/" class="w-50">
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
