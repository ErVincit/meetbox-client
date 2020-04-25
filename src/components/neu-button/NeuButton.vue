<template>
  <button type="button" :style="style" class="btn neu-button">{{ value }}</button>
</template>

<script>
export default {
  name: "NeuButton",
  props: {
    value: { type: String, required: true },
    backgroundColor: { type: String, default: "#efeeee" },
    color: { type: String, default: "#787878" },
    radius: { type: Number, default: 9 },
    blur: { type: Number, default: 16 }
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
        "--radius": this.radius + "px",
        "--blur": this.blur + "px"
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
button {
  background-color: var(--background-color);
  color: var(--color);
  box-shadow: var(--radius) var(--radius) var(--blur) var(--dark-color),
    calc(0px - var(--radius)) calc(0px - var(--radius)) var(--blur)
      var(--light-color);
  transition: 1s all;
  border-radius: 10px;
  border: none;
}

button:hover {
  box-shadow: inset var(--radius) var(--radius) var(--blur) var(--dark-color),
    inset calc(0px - var(--radius)) calc(0px - var(--radius)) var(--blur)
      var(--light-color);
  color: var(--color);
}

button:focus {
  outline: none;
  box-shadow: inset var(--radius) var(--radius) var(--blur) var(--dark-color),
    inset calc(0px - var(--radius)) calc(0px - var(--radius)) var(--blur)
      var(--light-color);
}
</style>