<template>
  <div v-if="display" class="members position-relative col-auto">
    <div class="fa fa-caret-down">
      <NeuInput
        class="user-dropdown__search-bar flex-grow-1 mt-2"
        type="text"
        placeholder="Cerca utente..."
        v-model="keyword"
      ></NeuInput>
      <transition-group
        class="my-2 members_div"
        name="user-dropdown__element-fade"
        tag="ul"
      >
        <li
          v-for="user in membersToShow"
          :key="user.id"
          class="d-flex align-items-center user-dropdown__element px-2"
          @click.stop="$emit('memberSelected', user)"
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
    </div>
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
      keyword: ""
    };
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

<style>
.members {
  max-height: 210px;
}
.members_div {
  overflow: auto;
  max-height: 180px;
}
</style>
