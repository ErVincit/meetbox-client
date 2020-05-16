<template>
  <nav class="navbar" style="height: 100px">
    <a class="text-left p-0" href="/"><Logo class="col"/></a>
    <UserInfo />
  </nav>
</template>

<script>
import Logo from "@/components/logo/Logo";
import UserInfo from "./UserInfo";

export default {
  name: "PageHeader",
  components: { Logo, UserInfo }
};
</script>

<style></style>
