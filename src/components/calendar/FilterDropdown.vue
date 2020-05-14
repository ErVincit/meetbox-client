<template>
  <NeuContainer
    class="dropdown-menu border-0"
    aria-labelledby="filterDropdownBtn"
    :disableHover="true"
    @click.stop
  >
    <div class="col-auto">
      <div class="d-flex justify-content-between align-items-center px-2">
        <h6 class="title col m-0 p-0">Massima durata evento</h6>
        <NeuCheckbox
          class="col-auto px-0 ml-5"
          @pressed="handleClick"
        ></NeuCheckbox>
      </div>
    </div>
    <div class="col-auto">
      <div class="d-flex justify-content-between align-items-center px-2">
        <h6 class="col m-0 p-0">Filtro membri</h6>
        <NeuCheckbox
          class="col-auto px-0"
          @pressed="
            if (activeFilterMember) activeFilterMember = false;
            else activeFilterMember = true;
          "
        ></NeuCheckbox>
      </div>
      <UserSelection
        :allMembers="workgroupMembers"
        :selectedMembers="filteredMembers"
        :display="activeFilterMember"
        @memberSelected="handleSelectedMember"
      />
    </div>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
// import NeuInput from "@/components/neu-button/NeuInput";
import NeuCheckbox from "@/components/calendar/NeuCheckbox";
import UserSelection from "@/components/calendar/UsersSelection";
// import BigAddButton from "@/components/section/BigAddButton";
// import Avatar from "@/components/avatar/Avatar";
// import UserDropdown from "@/components/task/UserDropdown";

import { mapGetters } from "vuex";

export default {
  name: "FilterDropdown",
  components: { NeuContainer, NeuCheckbox, UserSelection },
  props: ["allMembers"],
  methods: {
    handleClick(val) {
      this.activeFilterMember = val;
    },
    handleSubmenuClick() {
      this.$refs.userDropdown.$el.style.display = "block";
    },
    handleSelectedMember(member) {
      const array = [];
      if (this.filteredMembers.filter(m => m.id === member.id).length > 0) {
        for (let i = 0; i < this.filteredMembers.length; i++)
          if (this.filteredMembers[i].id !== member.id) {
            console.log(member);
            array.push(this.filteredMembers[i]);
          }
        this.filteredMembers = array;
      } else this.filteredMembers.push(member);
      this.$emit("newFilteredUsers", this.filteredMembers);
    }
  },
  data() {
    return {
      eventsDuration: null,
      filteredMembers: [],
      activeEventDuration: false,
      activeFilterMember: false
    };
  },
  computed: {
    ...mapGetters(["workgroups"]),
    workgroupMembers() {
      const { workgroupId } = this.$route.params;
      console.log(this.workgroups);
      if (this.workgroups)
        return this.workgroups.find(wg => wg.id === parseInt(workgroupId))
          .members;
      return [];
    }
  }
};
</script>

<style>
.panico {
  width: 400px !important;
}
.title {
  white-space: nowrap;
}
.user-dropdown {
  z-index: 1000;
  /* margin-top: 10px; */
  top: unset;
  right: unset;
  border: none;
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
</style>
