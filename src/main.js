import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

// Enabling Bootstrap tooltips
// https://stackoverflow.com/questions/37078423/how-can-add-bootstrap-tooltip-inside-vue-js
const bsTooltip = (el, binding) => {
  const t = [];

  if (binding.modifiers.focus) t.push("focus");
  if (binding.modifiers.hover) t.push("hover");
  if (binding.modifiers.click) t.push("click");
  if (!t.length) t.push("hover");

  // eslint-disable-next-line no-undef
  $(el).tooltip({
    title: binding.value,
    placement: binding.arg || "top",
    trigger: t.join(" "),
    boundary: "window",
    html: !!binding.modifiers.html
  });
};

Vue.directive("tooltip", {
  bind: bsTooltip,
  update: bsTooltip,
  unbind(el) {
    // eslint-disable-next-line no-undef
    $(el).tooltip("dispose");
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
