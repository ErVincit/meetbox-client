<template>
  <NeuContainer
    class="event-inspector p-4"
    aria-labelledby="filterDropdownBtn"
    :disableHover="true"
    :class="{ hide: !showEventFilter }"
  >
    <div class="row m-0 align-items-center justify-content-between">
      <h2 class="font-weight-bold">Filtri</h2>
      <button
        type="button"
        class="close col-1 d-block d-md-none p-2"
        aria-label="Close"
        @click="showEventFilter = false"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="row">
      <div class="col-12 col-md-6 my-3 mt-md-0">
        <h6 class="hightlight title col m-0 mx-2 p-0 pb-2">
          Durata massima evento
        </h6>
        <div class="px-3">
          <div class="d-flex align-items-center px-2">
            <input
              type="radio"
              id="24ore"
              name="gender"
              value="24ore"
              @change="handleRadioButton"
            />
            <label class="m-0 ml-2" for="24ore">Minore di 24 ore</label><br />
          </div>
          <div class="d-flex align-items-center px-2">
            <input
              type="radio"
              id="48ore"
              name="gender"
              value="48ore"
              @change="handleRadioButton"
            />
            <label class="m-0 ml-2" for="48ore">Minore di 48 ore</label><br />
          </div>
          <div class="d-flex align-items-center px-2">
            <input
              type="radio"
              id="72ore"
              name="gender"
              value="72ore"
              @change="handleRadioButton"
            />
            <label class="m-0 ml-2" for="72ore">Minore di 72 ore</label>
          </div>
          <div class="d-flex align-items-center px-2">
            <input
              type="radio"
              id="1set"
              name="gender"
              value="1set"
              @change="handleRadioButton"
            />
            <label class="m-0 ml-2" for="1set">Minore di 1 settimana</label>
          </div>
          <div class="d-flex align-items-center px-2">
            <input
              type="radio"
              id="nessuno"
              name="gender"
              value="nessuno"
              @change="handleRadioButton"
            />
            <label class="m-0 ml-2" for="nessuno">Nessuno</label>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 mt-3 mt-md-0">
        <h6 class="hightlight col m-0 mx-2 p-0 pb-2">Filtro membri</h6>
        <UserSelection
          :allMembers="workgroupMembers"
          :selectedMembers="filteredMembers"
          :display="true"
          @memberSelected="handleSelectedMember"
        />
      </div>
    </div>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import UserSelection from "@/components/calendar/UsersSelection";

import { mapGetters } from "vuex";

export default {
  name: "EventFilter",
  components: { NeuContainer, UserSelection },
  props: ["allMembers", "showEventFilter"],
  methods: {
    handleRadioButton(value) {
      this.$emit("maxEventSize", value.target.value);
      this.eventsDuration = value.target.value;
      value.target.checked = true;
    },
    handleSelectedMember(member) {
      const array = [];
      if (this.filteredMembers.filter(m => m.id === member.id).length > 0) {
        for (let i = 0; i < this.filteredMembers.length; i++)
          if (this.filteredMembers[i].id !== member.id) {
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
      filteredMembers: []
    };
  },
  computed: {
    ...mapGetters(["workgroups"]),
    workgroupMembers() {
      const { workgroupId } = this.$route.params;
      if (this.workgroups)
        return this.workgroups.find(wg => wg.id === parseInt(workgroupId))
          .members;
      return [];
    }
  }
};
</script>

<style>
.hide {
  display: none;
}
.panico {
  width: 400px !important;
}
.title {
  white-space: nowrap;
}
.user-dropdown {
  z-index: 1000;
  top: unset;
  right: unset;
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
</style>
