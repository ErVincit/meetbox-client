<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarTogglerDemo01"
      aria-controls="navbarTogglerDemo01"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
      <a class="navbar-brand text-left" href="#"><Logo /></a>
    </div>
  </nav>
</template>

<script>
import Logo from "@/components/logo/Logo";
// import WorkgroupSelector from "./WorkgroupSelector";

export default {
  name: "PageHeader",
  components: { Logo }
};
</script>

<style></style>
