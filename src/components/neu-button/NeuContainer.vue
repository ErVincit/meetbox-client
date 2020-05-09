<template>
  <div
    class="neu-container"
    :class="{
      'neu-container--hover': !disableHover,
      'neu-container--always-hover': alwaysHover
    }"
    :style="style"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: "NeuContainer",
  props: {
    backgroundColor: { type: String, default: "#efeeee" },
    color: { type: String, default: "#787878" },
    borderRadius: { type: Number, default: 10 },
    shadowRadius: { type: Number, default: 5 },
    shadowBlur: { type: Number, default: 10 },
    disableHover: { type: Boolean, default: false },
    alwaysHover: { type: Boolean, default: false }
  },
  computed: {
    style() {
      const darkColor = this.computeColor(this.backgroundColor, -1 * 0.15);
      const lightColor = this.computeColor(this.backgroundColor, 0.15);

      return {
        "--background-color": this.backgroundColor,
        "--color": this.color,
        "--dark-color": darkColor,
        "--light-color": lightColor,
        "--border-radius": this.borderRadius + "px",
        "--shadow-radius": this.shadowRadius + "px",
        "--shadow-blur": this.shadowBlur + "px"
      };
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
