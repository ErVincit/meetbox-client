<template>
  <header
    class="container-fluid d-flex flex-row justify-content-between align-items-center"
  >
    <Logo />
    <WorkgroupSelector />
  </header>
</template>

<script>
import Logo from "@/components/logo/Logo";
import WorkgroupSelector from "./WorkgroupSelector";

export default {
  name: "PageHeader",
  components: { Logo, WorkgroupSelector }
};
</script>

<style></style>
