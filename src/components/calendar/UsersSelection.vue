<template>
  <div v-if="display" class="members position-relative d-flex flex-column px-3">
    <NeuInput
      class="user-selection__search-bar flex-grow-1 mt-2"
      type="text"
      placeholder="Cerca utente..."
      v-model="keyword"
    />
    <transition-group
      class="my-2 members_div"
      name="user-selection__element-fade"
      tag="ul"
    >
      <li
        v-for="user in membersToShow"
        :key="user.id"
        class="d-flex align-items-center user-selection__element w-100 px-2"
        d-flex
        align-items-center
        px-2
        @click.stop="
          $emit('memberSelected', user);
          handleMember(user);
        "
      >
        <div
          class="d-flex align-items-center w-100 px-2 rounded-pill"
          :class="{ selected: selected.find(m => m.id === user.id) }"
        >
          <Avatar
            class="mr-1 my-1"
            :firstname="user.firstname"
            :lastname="user.lastname"
          />
          <span class="mx-1 text-nowrap"
            >{{ user.firstname }} {{ user.lastname }}</span
          >
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import NeuInput from "@/components/neu-button/NeuInput";
import Avatar from "@/components/avatar/Avatar";

export default {
  name: "UserSelection",
  components: { NeuInput, Avatar },
  props: ["allMembers", "selectedMembers", "display"],
  data() {
    return {
      keyword: "",
      selected: []
    };
  },
  methods: {
    handleMember(member) {
      const array = [];
      if (this.selected.filter(m => m.id === member.id).length > 0) {
        for (let i = 0; i < this.selected.length; i++)
          if (this.selected[i].id !== member.id) {
            array.push(this.selected[i]);
          }
        this.selected = array;
      } else this.selected.push(member);
    }
  },
  computed: {
    membersToShow: function() {
      if (this.keyword === "") return this.allMembers;
      return this.allMembers.filter(
        ({ firstname, lastname }) =>
          firstname.toLowerCase().includes(this.keyword.toLowerCase()) ||
          lastname.toLowerCase().includes(this.keyword.toLowerCase())
      );
    }
  }
};
</script>

<style scoped>
.selected {
  color: var(--text-color-primary);
  background-color: var(--primary);
}
.members_div {
  overflow: hidden auto;
  max-height: 200px;
}
</style>
