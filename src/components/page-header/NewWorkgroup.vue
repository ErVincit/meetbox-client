<template>
  <NeuContainer class="new-workgroup" alwaysHover>
    <div style="position: relative">
      <p class=" mb-0 highlight" style="line-height: 20px">
        Crea workgroup
      </p>
      <button
        type="button"
        class="close"
        aria-label="Close"
        style="position: absolute; right: 10px; top: 50%; transform: translate(0, -50%)"
        @click.stop="exit"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <hr class="my-1" />
    <div class="mt-3">
      <p class="col m-0">Immagine:</p>
      <div class="d-flex align-items-center px-2 mt-1">
        <img class="rounded-circle" :src="imageURL" width="50" height="50" />
        <NeuInput
          class="mx-2"
          v-model="image"
          style="max-width: 200px"
          placeholder="URL immagine"
        />
      </div>
    </div>
    <div class="mt-3">
      <p class="col m-0">Nome:</p>
      <div class="d-flex align-items-center px-2 mt-1">
        <NeuInput v-model="name" class="mx-2" placeholder="es. Mio workgroup" />
      </div>
    </div>
    <NeuButton
      class="col mx-auto m-2 mt-3 w-50"
      color="#1c4885"
      style="height: 35px;"
      @click="newWorkgroup"
    >
      Salva
    </NeuButton>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuInput from "@/components/neu-button/NeuInput";
import NeuButton from "@/components/neu-button/NeuButton";

import { mapActions } from "vuex";

export default {
  name: "NewWorkgroup",
  components: { NeuContainer, NeuInput, NeuButton },
  data() {
    return {
      image: "",
      name: ""
    };
  },
  computed: {
    imageURL() {
      if (this.image.trim().length === 0)
        return "https://interactive-examples.mdn.mozilla.net/media/examples/grapefruit-slice-332-332.jpg";
      return this.image;
    }
  },
  methods: {
    ...mapActions(["createWorkgroup"]),
    exit() {
      this.image = "";
      this.name = "";
      this.$emit("exit");
    },
    async newWorkgroup() {
      console.log("Creating workgroup");
      await this.createWorkgroup({ name: this.name, image: this.image });
      // TODO:
      // - Create workgroup
      // - Redirect to new workgroup
      this.exit();
    }
  }
};
</script>

<style>
.new-workgroup .neu-button button {
  font-size: 16px !important;
}
</style>
