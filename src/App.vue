<template>
  <div id="app" :style="style">
    <router-view />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  methods: mapActions(["initTheme"]),
  computed: {
    ...mapGetters(["isLightTheme"]),
    style() {
      return {
        "--primary-bg-color": this.isLightTheme ? "#efeeee" : "#222",
        "--secondary-bg-color": this.isLightTheme ? "#efeeee" : "#666",

        "--primary": "#4e8fe7",
        "--secondary": "grey",
        "--danger": "rgb(252, 109, 109)",

        "--text-color-primary": "white",
        "--text-color-bg": "#787878",

        "--file-drop-border": "purple",
        "--grid-border": "lightgrey",
        "--homepage-text-color": this.isLightTheme ? "black" : "white"
      };
    }
  },
  mounted() {
    this.initTheme();
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap");

* {
  margin: 0;
  padding: 0;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
}

html,
body,
#app {
  overflow: hidden;
  height: 100%;
}

#app {
  background-color: var(--primary-bg-color);
}
</style>
