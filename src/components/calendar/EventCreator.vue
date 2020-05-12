<template>
  <NeuContainer class="event-inspector w-50 px-5 py-4" disableHover>
    <div class="row align-items-center justify-content-center">
      <NeuInput
        class="hightlight font-weight-bold my-2 mx-3 col-12 col-xl p-0 pb-2 pb-md-0"
        :placeholder="'Titolo'"
        v-model="event.title"
      />
      <div class="px-2 col-auto col-xl-auto">
        <NeuButton
          class="px-2"
          :backgroundColor="'#efeeee'"
          :color="'#787878'"
          :shadowRadius="5"
          :shadowBlur="10"
          @click.stop="createEvent"
          >✔️ Conferma</NeuButton
        >
      </div>
    </div>
    <div>
      <div class="p-2">
        <div class="d-flex">
          <div class="d-flex flex-column justify-content-center w-25">
            <p class="hightlight p-0 m-0 col-sm-4">
              Inizio
            </p>
          </div>
          <div class="d-flex">
            <NeuInput type="date" v-model="inputBeginDate" :min="todayDate" />
            <NeuInput type="time" class="w-50" v-model="inputBeginTime" />
          </div>
        </div>
        <div class="d-flex">
          <div class="d-flex flex-column justify-content-center w-25">
            <p class="hightlight p-0 m-0 col-sm-4">Fine</p>
          </div>
          <div class="d-flex">
            <NeuInput type="date" v-model="inputEndDate" :min="minEndDate" />
            <NeuInput type="time" class="w-50" v-model="inputEndTime" />
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex">
      <div class="w-50">
        <p class="hightlight mt-4">Descrizione:</p>
        <NeuTextarea
          v-model="event.description"
          :placeholder="'Aggiungi qui la tua descrizione!'"
        />
      </div>
      <div class="w-50 p-5">
        <p class="hightlight mb-1">👑 Proprietario:</p>
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
            aria-labelledby="membersDropdown"
            :users="workgroupMembers"
            :members="workgroupMembers.filter(m => membersId.includes(m.id))"
            @select-user="addMember"
          />
        </div>
      </div>
    </div>
    <div
      v-if="error"
      class="alert mt-3 alert-warning alert-dismissible fade show"
      role="alert"
    >
      <strong>Attenzione!</strong> {{ errorText }}
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
        @click.stop="
          e => {
            error = false;
          }
        "
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </NeuContainer>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuButton from "@/components/neu-button/NeuContainer";
import NeuTextarea from "@/components/neu-button/NeuTextarea";
import NeuInput from "@/components/neu-button/NeuInput";
import BigAddButton from "@/components/section/BigAddButton";
import Avatar from "@/components/avatar/Avatar";
import UserDropdown from "@/components/task/UserDropdown";

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
    NeuButton
  },
  data() {
    return {
      showUserDropdown: false,
      error: false,
      event: {
        id: 0,
        title: "",
        timestampBegin: new Date(),
        timestampEnd: new Date(),
        description: "",
        members: []
      }
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
        this.error = false;
        this.errorText = "Devi impostare un titolo all'evento";
        this.error = true;
        return;
      }
      const now = new Date();
      if (this.event.timestampBegin <= now) {
        this.error = false;
        this.errorText =
          "La data e ora di inizio devono essere maggiore di ora";
        this.error = true;
        return;
      }

      const { workgroupId } = this.$route.params;
      await this.addEvent({ workgroupId, event: this.event });
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
      if (this.event.timestampBegin > this.event.timestampEnd) {
        const hx = this.event.timestampEnd.getHours();
        const mx = this.event.timestampEnd.getMinutes();
        this.event.timestampEnd = new Date(this.event.timestampBegin);
        this.event.timestampEnd.setDate(this.event.timestampEnd.getDate() + 1);
        this.event.timestampEnd.setHours(hx, mx);
      }
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
        return calendarUtils.dateToTimeType(this.event.timestampBegin);
      },
      set(val) {
        const split = val.split(":");
        const h = Number.parseInt(split[0]);
        const m = Number.parseInt(split[1]);
        this.event.timestampBegin.setHours(h, m);
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
        this.event.timestampEnd.setHours(h, m);
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
  color: #1c4885;
}
</style>
