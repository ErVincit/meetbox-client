<template>
  <NeuContainer class="user-dropdown p-2" disableHover>
    <div class="d-flex">
      <NeuInput
        class="user-dropdown__search-bar flex-grow-1"
        type="text"
        placeholder="Cerca utente..."
        v-model="keyword"
      ></NeuInput>
      <button
        type="button"
        class="close px-2"
        aria-label="Close"
        @click.stop="$emit('hide')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <transition-group class="my-2" name="user-dropdown__element-fade" tag="ul">
      <li
        v-for="user in shownUsers"
        :key="user.id"
        class="d-flex align-items-center user-dropdown__element"
        @click.stop="$emit('select-user', user)"
      >
        <Avatar
          class="mx-2 my-1"
          :firstname="user.firstname"
          :lastname="user.lastname"
        />
        {{ user.firstname }} {{ user.lastname }}
      </li>
    </transition-group>

    <div
      class="d-flex justify-content-center m-3 pt-2"
      v-if="shownUsers.length === 0"
    >
      ⚠️ Non ci sono altri membri ⚠️
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
  width: 300px;
  height: auto;
  z-index: 1000;
  margin-top: 20px;
  position: absolute;
  transition: all 1s;
}

.user-dropdown__search-bar input,
.user-dropdown__search-bar input:focus {
  font-size: 14px;
}

.user-dropdown__element:hover {
  background-color: lightgrey;
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
