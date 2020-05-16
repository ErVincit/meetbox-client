<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb m-0 p-0 d-none d-md-flex align-items-end flex-nowrap">
      <li
        class="breadcrumb-item"
        v-for="folder in value"
        :key="folder.id"
        @click="setPosition(folder.id)"
        style="cursor: pointer"
      >
        <span class="px-1 rounded text-truncate">{{ folder.name }}</span>
      </li>
    </ol>
    <ol
      class="breadcrumb h-100 m-0 p-0 d-flex d-md-none align-items-center flex-nowrap"
    >
      <li
        class="breadcrumb-item"
        v-if="value && value.length >= 2"
        @click="setPosition(value[value.length - 2].id)"
        style="cursor: pointer"
      >
        <span class="px-1 rounded text-truncate">...</span>
      </li>
      <li
        class="breadcrumb-item text-truncate"
        v-if="value"
        @click="setPosition(value[value.length - 1].id)"
        style="cursor: pointer"
      >
        <span class="px-1 rounded">{{ value[value.length - 1].name }}</span>
      </li>
    </ol>
  </nav>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Breadcrumb",
  props: { currentPosition: String },
  computed: {
    ...mapGetters(["tree"]),
    value() {
      if (!this.tree) return [{ id: "root", name: "Drive" }];
      const list = [];
      let folder = this.currentPosition;
      const values = Object.values(this.tree);
      let count = 0;
      while (folder !== "root" && count < 100) {
        count++;
        for (const array of values)
          for (const doc of array) {
            if (doc.id === parseInt(folder)) {
              list.unshift(doc);
              folder = doc.folder;
            }
          }
      }
      return [{ id: "root", name: "Drive" }, ...list];
    }
  },
  methods: {
    setPosition(folderId) {
      this.$emit("set-position", folderId);
    }
  }
};
</script>

<style>
.breadcrumb {
  background-color: transparent;
}
.breadcrumb-item:first-child {
  font-size: 2rem;
}
.breadcrumb-item {
  font-size: 1.3rem;
  color: var(--primary);
}
.breadcrumb-item:hover span {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
