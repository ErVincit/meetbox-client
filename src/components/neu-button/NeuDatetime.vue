<template>
  <div>
    <NeuInput type="date" class="mb-1" />
    <NeuInput type="time" class="mt-1" />
  </div>
</template>

<script>
import NeuInput from "@/components/neu-button/NeuInput";

export default {
  name: "NueDatetime",
  components: { NeuInput }
};
</script>

<style></style>
