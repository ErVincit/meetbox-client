<template>
  <NeuContainer class="event-inspector p-4" disableHover>
    <div class="row m-0 align-items-center justify-content-center">
      <div class="p-0 py-2 pr-3 col-11 col-md">
        <NeuInput
          class="hightlight font-weight-bold p-0"
          :placeholder="'Titolo'"
          v-model="event.title"
        />
      </div>
      <button
        type="button"
        class="close col-1 d-block d-md-none p-2"
        aria-label="Close"
        @click="$emit('hideEventCreator')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <NeuButton class="col-auto my-3 my-lg-0 px-2" @click.stop="createEvent">
        ✔️ Conferma
      </NeuButton>
    </div>
    <div class="row m-0 py-2 align-items-center">
      <p class="hightlight p-0 m-0 mb-3 my-sm-0 col-12 col-sm-4">
        Inizio
      </p>
      <div class="col-6 col-sm-5 px-2">
        <NeuInput type="date" v-model="inputBeginDate" :min="todayDate" />
      </div>
      <div class="col-6 col-sm-3 px-2">
        <NeuInput type="time" v-model="inputBeginTime" />
      </div>
    </div>
    <div class="row m-0 py-2 align-items-center">
      <p class="hightlight p-0 m-0 mb-3 my-sm-0 col-12 col-sm-4">Fine</p>
      <div class="col-6 col-sm-5 px-2">
        <NeuInput type="date" v-model="inputEndDate" :min="minEndDate" />
      </div>
      <div class="col-6 col-sm-3 px-2">
        <NeuInput type="time" v-model="inputEndTime" />
      </div>
    </div>
    <div class="row m-0 ">
      <div class="col-12 col-md-6 p-0 pr-3 d-flex flex-column">
        <p class="hightlight mt-4">Descrizione:</p>
        <NeuTextarea
          class="h-100"
          v-model="event.description"
          :placeholder="'Aggiungi qui la tua descrizione!'"
        />
      </div>
      <div class="col-12 col-md-6 p-0 pl-3 d-flex flex-column">
        <p class="hightlight mt-4 mb-1">👑 Proprietario:</p>
        <li class="d-flex align-items-center">
          <Avatar
            class="mr-2"
            :firstname="getMember(currentUser.id).firstname"
            :lastname="getMember(currentUser.id).lastname"
          />
          {{ getMember(currentUser.id).firstname }}
          {{ getMember(currentUser.id).lastname }}
        </li>
        <p class="hightlight mt-3">🧑‍🤝‍🧑 Assegnato:</p>
        <li
          v-for="(member, index) in event.members"
          :key="member.id"
          class="d-flex align-items-center"
        >
          <Avatar
            class="mr-2"
            :firstname="member.firstname"
            :lastname="member.lastname"
          />
          {{ member.firstname }} {{ member.lastname }}
          <span class="ml-auto mr-2" @click.stop="removeMember(index)"
            >&times;</span
          >
        </li>
        <div class="dropdown justify-content-center">
          <BigAddButton
            class="col mt-2"
            id="membersDropdown"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Aggiungi un nuovo membro
          </BigAddButton>
          <UserDropdown
            class="mb-2"
            aria-labelledby="membersDropdown"
            :users="workgroupMembers"
            :members="workgroupMembers.filter(m => membersId.includes(m.id))"
            @select-user="addMember"
          />
        </div>
      </div>
    </div>
    <Alert
      v-if="alertShowed"
      :type="alertType"
      :message="alertMessage"
      @close="alertShowed = false"
    />
  </NeuContainer>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuButton from "@/components/neu-button/NeuButton";
import NeuTextarea from "@/components/neu-button/NeuTextarea";
import NeuInput from "@/components/neu-button/NeuInput";
import BigAddButton from "@/components/section/BigAddButton";
import Avatar from "@/components/avatar/Avatar";
import UserDropdown from "@/components/task/UserDropdown";
import Alert from "@/components/alert/Alert";

import calendarUtils from "@/views/calendar/calendar_utils";

export default {
  name: "EventCreator",
  components: {
    NeuContainer,
    BigAddButton,
    Avatar,
    NeuTextarea,
    NeuInput,
    UserDropdown,
    Alert,
    NeuButton
  },
  data() {
    return {
      showUserDropdown: false,
      event: {
        id: 0,
        title: "",
        timestampBegin: new Date(),
        timestampEnd: new Date(),
        description: "",
        members: []
      },
      alertShowed: false,
      alertType: "",
      alertMessage: ""
    };
  },
  created() {
    this.event.timestampBegin.setHours(
      this.event.timestampBegin.getHours() + 1
    );
    this.event.timestampEnd.setDate(this.event.timestampBegin.getDate() + 1);
  },
  methods: {
    ...mapActions(["addEvent"]),
    showAlert(type, message) {
      this.alertType = type;
      this.alertMessage = message;
      this.alertShowed = true;
    },
    addMember(member) {
      for (let i = 0; i < this.event.members.length; i++)
        if (member.id == this.event.members[i].id) return;
      this.event.members.push(member);
    },
    removeMember(index) {
      this.event.members.splice(index, 1);
    },
    async createEvent() {
      if (this.event.title == "") {
        this.showAlert("warning", "Devi impostare un titolo all'evento");
        return;
      }
      const now = new Date();
      if (this.event.timestampBegin <= now) {
        this.showAlert(
          "warning",
          "La data e ora di inizio devono essere maggiore di ora"
        );
        return;
      }
      if (this.event.timestampBegin >= this.event.timestampEnd) {
        //TODO: Impostare durata minima evento
        this.showAlert(
          "warning",
          "La data e ora di inizio devono essere maggiore di ora"
        );
        return;
      }

      this.showAlert("info", "Creazione in corso...");
      const { workgroupId } = this.$route.params;
      const event = Object.assign({}, this.event);
      event.members = event.members.map(m => m.id);
      await this.addEvent({ workgroupId, event });
      this.$emit("hideEventCreator");
      this.cleanEvent();
    },
    cleanEvent() {
      this.event = {
        id: 0,
        title: "",
        timestampBegin: new Date(),
        timestampEnd: new Date(),
        description: "",
        members: []
      };
      this.event.timestampEnd.setDate(this.event.timestampEnd.getDate() + 1);
    },
    checkDate() {
      const now = new Date();
      if (this.event.timestampBegin <= now) {
        this.showAlert(
          "warning",
          "La data e ora di inizio devono essere maggiore di ora"
        );
        return;
      }
      if (this.event.timestampBegin >= this.event.timestampEnd) {
        //TODO: Impostare durata minima evento
        this.showAlert(
          "warning",
          "La data e ora di inizio devono essere maggiore di ora"
        );
        return;
      }
      this.alertShowed = false;
    },
    getMember(idUser) {
      for (let i = 0; i < this.workgroupMembers.length; i++)
        if (this.workgroupMembers[i].id == idUser)
          return this.workgroupMembers[i];
      return { firstname: "Nessun", lastname: "risultato" };
    }
  },
  computed: {
    ...mapGetters(["workgroups", "currentUser"]),

    inputBeginDate: {
      get() {
        return calendarUtils.dateToDateType(this.event.timestampBegin);
      },
      set(val) {
        const h = this.event.timestampBegin.getHours();
        const m = this.event.timestampBegin.getMinutes();
        this.event.timestampBegin = new Date(val);
        this.event.timestampBegin.setHours(h, m);
        this.checkDate();
      }
    },
    inputBeginTime: {
      get() {
        console.log("Posteriore", this.event.timestampBegin);
        return calendarUtils.dateToTimeType(this.event.timestampBegin);
      },
      set(val) {
        const split = val.split(":");
        const h = Number.parseInt(split[0]);
        const m = Number.parseInt(split[1]);
        const timestampBegin = new Date(this.event.timestampBegin);
        timestampBegin.setHours(h, m);
        this.event.timestampBegin = timestampBegin;
        console.log(this.event.timestampBegin);
        this.checkDate();
      }
    },
    inputEndDate: {
      get() {
        return calendarUtils.dateToDateType(this.event.timestampEnd);
      },
      set(val) {
        const h = this.event.timestampEnd.getHours();
        const m = this.event.timestampEnd.getMinutes();
        this.event.timestampEnd = new Date(val);
        this.event.timestampEnd.setHours(h, m);
        this.checkDate();
      }
    },
    inputEndTime: {
      get() {
        return calendarUtils.dateToTimeType(this.event.timestampEnd);
      },
      set(val) {
        const split = val.split(":");
        const h = Number.parseInt(split[0]);
        const m = Number.parseInt(split[1]);
        const timestampEnd = new Date(this.event.timestampEnd);
        timestampEnd.setHours(h, m);
        this.event.timestampEnd = timestampEnd;
        this.checkDate();
      }
    },
    workgroupMembers() {
      const { workgroupId } = this.$route.params;
      return this.workgroups.find(wg => wg.id === parseInt(workgroupId))
        .members;
    },
    todayDate() {
      return calendarUtils.dateToDateType(new Date());
    },
    minEndDate() {
      return calendarUtils.dateToDateType(this.event.timestampBegin);
    },
    membersId() {
      return this.event.members.map(wg => wg.id);
    }
  }
};
</script>

<style>
.hightlight {
  color: var(--primary);
}
.event-inspector .neu-button,
.event-inspector .neu-input > input {
  height: 40px;
}
.event-inspector .neu-button > button {
  font-size: medium;
}
.event-inspector .neu-textarea textarea {
  height: 100% !important;
}
</style>
