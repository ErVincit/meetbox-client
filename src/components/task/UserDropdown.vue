<template>
  <NeuContainer
    class="dropdown-menu user-dropdown p-2"
    v-bind="$attrs"
    v-on="$listeners"
    disableHover
  >
    <NeuInput
      class="user-dropdown__search-bar flex-grow-1"
      type="text"
      placeholder="Cerca utente..."
      v-model="keyword"
    ></NeuInput>
    <transition-group class="my-2" name="user-dropdown__element-fade" tag="ul">
      <li
        v-for="user in shownUsers"
        :key="user.id"
        class="d-flex align-items-center user-dropdown__element px-2"
        @click.stop="$emit('select-user', user)"
      >
        <Avatar
          class="mr-1 my-1"
          :firstname="user.firstname"
          :lastname="user.lastname"
        />
        <span class="mx-1 text-nowrap"
          >{{ user.firstname }} {{ user.lastname }}</span
        >
      </li>
    </transition-group>

    <div
      class="d-flex justify-content-center m-3 pt-2"
      v-if="shownUsers.length === 0"
    >
      <span class="text-nowrap">⚠️ Non ci sono altri membri ⚠️</span>
    </div>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuInput from "@/components/neu-button/NeuInput";
import Avatar from "@/components/avatar/Avatar";

export default {
  name: "UserDropdown",
  props: { users: Array, members: Array },
  data() {
    return { keyword: "", membersD: this.members };
  },
  components: { NeuContainer, NeuInput, Avatar },
  computed: {
    shownUsers() {
      return this.users.filter(
        ({ firstname, lastname, id }) =>
          (firstname.toLowerCase().includes(this.keyword.toLowerCase()) ||
            lastname.toLowerCase().includes(this.keyword.toLowerCase())) &&
          this.includeUser(id)
      );
    }
  },
  methods: {
    includeUser: function(id) {
      if (!this.members) this.membersD = [];
      for (let i = 0; i < this.membersD.length; i++)
        if (this.members[i].id == id) return false;
      return true;
    }
  },
  watch: {
    members: function(val) {
      this.membersD = val;
    }
  }
};
</script>

<style>
.user-dropdown {
  z-index: 1000;
  margin-top: 10px;
  border: none;
}

.user-dropdown__search-bar input,
.user-dropdown__search-bar input:focus {
  font-size: 14px;
}

.user-dropdown__element:hover {
  background-color: var(--primary);
  cursor: pointer;
}

.user-dropdown__element-fade-enter-active,
.user-dropdown__element-fade-leave-active {
  transition: all 300ms;
}
.user-dropdown__element-fade-enter,
.user-dropdown__element-fade-leave-to {
  opacity: 0;
}

/* .dropdown__element-fade-move {
  transition: transform 1s;
} */
</style>
