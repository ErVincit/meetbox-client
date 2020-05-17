<template>
  <div
    :class="{
      'neu-container': !disabled,
      'neu-container--hover': !disabled && !disableHover,
      'neu-container--always-hover': !disabled && alwaysHover
    }"
    :style="style"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "NeuContainer",
  props: {
    backgroundColor: { type: String, default: "#efeeee" },
    color: { type: String, default: "#787878" },
    borderRadius: { type: Number, default: 10 },
    shadowRadius: { type: Number, default: 5 },
    shadowBlur: { type: Number, default: 10 },
    disableHover: { type: Boolean, default: false },
    alwaysHover: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters(["isLightTheme"]),
    style() {
      const background =
        this.isLightTheme || this.backgroundColor !== "#efeeee"
          ? this.backgroundColor
          : "#333333";
      const object = {
        "--background-color": background,
        "--color": this.color,
        "--border-radius": this.borderRadius + "px"
      };

      const value = this.isLightTheme ? 0.15 : 0.6;
      if (!background.startsWith("var")) {
        object["--dark-color"] = this.computeColor(background, -1 * value);
        object["--light-color"] = this.computeColor(background, value);
        object["--shadow-radius"] = this.shadowRadius + "px";
        object["--shadow-blur"] = this.shadowBlur + "px";
      }

      return object;
    }
  },
  methods: {
    computeColor(e, t) {
      (e = String(e).replace(/[^0-9a-f]/gi, "")).length < 6 &&
        (e = e[0] + e[0] + e[1] + e[1] + e[2] + e[2]),
        (t = t || 0);
      var a,
        n,
        o = "#";
      for (n = 0; n < 3; n++)
        (a = parseInt(e.substr(2 * n, 2), 16)),
          (o += (
            "00" +
            (a = Math.round(Math.min(Math.max(0, a + a * t), 255)).toString(16))
          ).substr(a.length));
      return o;
    }
  }
};
</script>

<style scoped>
.neu-container {
  background-color: var(--background-color);
  color: var(--color);
  box-shadow: var(--shadow-radius) var(--shadow-radius) var(--shadow-blur)
      var(--dark-color),
    calc(0px - var(--shadow-radius)) calc(0px - var(--shadow-radius))
      var(--shadow-blur) var(--light-color);
  border-radius: var(--border-radius);
}

.neu-container--hover:hover {
  box-shadow: inset var(--shadow-radius) var(--shadow-radius) var(--shadow-blur)
      var(--dark-color),
    inset calc(0px - var(--shadow-radius)) calc(0px - var(--shadow-radius))
      var(--shadow-blur) var(--light-color);
  color: var(--color);
}

.neu-container--always-hover {
  background-color: var(--background-color);
  color: var(--color);
  box-shadow: inset var(--shadow-radius) var(--shadow-radius) var(--shadow-blur)
      var(--dark-color),
    inset calc(0px - var(--shadow-radius)) calc(0px - var(--shadow-radius))
      var(--shadow-blur) var(--light-color);
  border-radius: var(--border-radius);
}
</style>
