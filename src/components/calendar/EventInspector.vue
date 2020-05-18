<template>
  <NeuContainer class="event-inspector p-4" disableHover>
    <div class="row m-0 align-items-center justify-content-center">
      <div class="p-0 py-2 pr-3 col-11 col-md">
        <h3 v-if="!isEditable" class="hightlight font-weight-bold my-2">
          {{ ourEvent.title }}
        </h3>
        <NeuInput
          v-else
          :placeholder="'Titolo'"
          v-model="ourEvent.title"
          @blur="setTitle"
        />
      </div>
      <button
        type="button"
        class="close col-1 d-block d-md-none p-2"
        aria-label="Close"
        @click="$emit('hideEventInspector')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <NeuButton
        v-if="isErasable"
        class="col-auto my-3 my-lg-0 px-2"
        @click.stop="deleteEvent"
      >
        🗑️ Elimina
      </NeuButton>
    </div>
    <div class="row m-0 py-2 align-items-center">
      <p class="hightlight p-0 m-0 mb-3 my-sm-0 col-12 col-sm-4">
        Inizio
      </p>
      <div class="col-6 col-sm-5 px-2">
        <NeuInput
          type="date"
          v-model="inputBeginDate"
          :disabled="isTimestampBeginEditable"
          :min="todayDate"
        />
      </div>
      <div class="col-6 col-sm-3 px-2">
        <NeuInput
          type="time"
          v-model="inputBeginTime"
          :disabled="isTimestampBeginEditable"
        />
      </div>
    </div>
    <div class="row m-0 py-2 align-items-center">
      <p class="hightlight p-0 m-0 mb-3 my-sm-0 col-12 col-sm-4">Fine</p>
      <div class="col-6 col-sm-5 px-2">
        <NeuInput
          type="date"
          v-model="inputEndDate"
          :disabled="!isEditable"
          :min="timestampBeginDate"
        />
      </div>
      <div class="col-6 col-sm-3 px-2">
        <NeuInput type="time" v-model="inputEndTime" :disabled="!isEditable" />
      </div>
    </div>
    <div class="row m-0">
      <div class="col-12 col-md-6 p-0 pr-3 d-flex flex-column">
        <p class="hightlight mt-4">Descrizione:</p>
        <NeuTextarea
          class="h-100"
          v-if="isEditable"
          v-model="ourEvent.description"
          :placeholder="'Aggiungi qui la tua descrizione!'"
          ref="description"
          @blur="setDescription"
        />
        <p class="pl-3" v-else>
          {{ ourEvent.description !== "" ? ourEvent.description : "Ciaoo" }}
        </p>
      </div>
      <div class="col-12 col-md-6 p-0 pl-3 d-flex flex-column">
        <p class="hightlight mt-4 mb-1">👑 Proprietario:</p>
        <li class="d-flex align-items-center">
          <Avatar
            class="mr-2"
            :firstname="getMember(event.owner).firstname"
            :lastname="getMember(event.owner).lastname"
          />
          {{ getMember(event.owner).firstname }}
          {{ getMember(event.owner).lastname }}
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
          <span
            v-if="isEditable"
            class="ml-auto mr-2"
            @click.stop="removeMember(index)"
            >&times;</span
          >
        </li>
        <div class="dropdown justify-content-center">
          <BigAddButton
            v-if="isEditable"
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
      :type="alertType"
      v-if="alertShowed"
      @close="alertShowed = false"
      :message="alertMessage"
    />
  </NeuContainer>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuTextarea from "@/components/neu-button/NeuTextarea";
import NeuInput from "@/components/neu-button/NeuInput";
import NeuButton from "@/components/neu-button/NeuButton";
import BigAddButton from "@/components/section/BigAddButton";
import Avatar from "@/components/avatar/Avatar";
import UserDropdown from "@/components/task/UserDropdown";
import Alert from "@/components/alert/Alert";

import calendarUtils from "@/views/calendar/calendar_utils";

export default {
  name: "EventInspector",
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
  props: ["event"],
  data() {
    return {
      showUserDropdown: false,
      ourEvent: {
        id: this.event.id,
        title: this.event.title,
        timestampBegin:
          this.event.originalBegin == undefined
            ? new Date(this.event.timestampBegin)
            : new Date(this.event.originalBegin),
        timestampEnd:
          this.event.originalBegin == undefined
            ? new Date(this.event.timestampEnd)
            : new Date(this.event.originalEnd),
        description: this.event.description,
        members: this.event.members
      },
      alertShowed: false,
      alertType: "",
      alertMessage: "",
      deleted: false,
      noDescription: "Nessuna descrizione presente"
    };
  },
  methods: {
    ...mapActions(["editEvent", "removeEvent"]),
    async addMember(member) {
      for (let i = 0; i < this.ourEvent.members.length; i++)
        if (member.id == this.ourEvent.members[i].id) return;
      const { workgroupId } = this.$route.params;
      const newEvent = {
        id: this.event.id,
        members: [...this.ourEvent.members, member].map(m => m.id)
      };
      this.editEvent({
        workgroupId,
        event: newEvent,
        oldEvent: this.event
      });
      this.ourEvent.members.push(member);
      this.showDropdown = false;
    },
    async setTitle() {
      if (this.ourEvent.title == "") {
        this.showAlert("warning", "Il titolo dell'evento non può essere vuoto");
        return;
      }
      this.alertShowed = false;
      const { workgroupId } = this.$route.params;
      const newEvent = {
        id: this.ourEvent.id,
        title: this.ourEvent.title
      };
      await this.editEvent({
        workgroupId,
        event: newEvent,
        oldEvent: this.event
      });
    },
    async setDescription() {
      const { workgroupId } = this.$route.params;
      const newEvent = {
        id: this.ourEvent.id,
        description: this.ourEvent.description
      };
      await this.editEvent({
        workgroupId,
        event: newEvent,
        oldEvent: this.event
      });
    },
    async removeMember(index) {
      this.ourEvent.members.splice(index, 1);
      const { workgroupId } = this.$route.params;
      const newEvent = {
        id: this.ourEvent.id,
        members: this.ourEvent.members.map(m => m.id)
      };
      await this.editEvent({
        workgroupId,
        event: newEvent,
        oldEvent: this.event
      });
    },
    async deleteEvent() {
      this.deleted = true;
      const { workgroupId } = this.$route.params;
      this.showAlert("info", "Eliminazione in corso...");
      await this.removeEvent({
        workgroupId,
        event: this.event
      });
      this.$emit("deletedEvent");
    },
    async changeDate() {
      const now = new Date();
      if (
        this.ourEvent.timestampBegin <= now &&
        !this.isTimestampBeginEditable
      ) {
        this.showAlert("warning", "L'evento non puo iniziare prima di adesso");
        return;
      }

      if (this.ourEvent.timestampEnd <= now) {
        this.showAlert("warning", "L'evento non puo finire prima di adesso");
        return;
      }

      if (this.ourEvent.timestampBegin >= this.ourEvent.timestampEnd) {
        this.showAlert(
          "warning",
          "L'evento deve iniziare prima della sua fine"
        );
        return;
      }

      this.alertShowed = false;

      const newEvent = {
        id: this.ourEvent.id,
        timestampBegin: this.ourEvent.timestampBegin,
        timestampEnd: this.ourEvent.timestampEnd
      };
      const { workgroupId } = this.$route.params;
      await this.editEvent({
        workgroupId,
        event: newEvent,
        oldEvent: this.event
      });
    },
    getMember(idUser) {
      for (let i = 0; i < this.workgroupMembers.length; i++)
        if (this.workgroupMembers[i].id == idUser)
          return this.workgroupMembers[i];
      return { firstname: "Nessun", lastname: "risultato" };
    },
    showAlert(type, message) {
      this.alertType = type;
      this.alertMessage = message;
      this.alertShowed = true;
    }
  },
  computed: {
    ...mapGetters(["workgroups", "currentUser"]),

    inputBeginDate: {
      get() {
        return calendarUtils.dateToDateType(this.ourEvent.timestampBegin);
      },
      set(val) {
        const h = this.ourEvent.timestampBegin.getHours();
        const m = this.ourEvent.timestampBegin.getMinutes();
        this.ourEvent.timestampBegin = new Date(val);
        this.ourEvent.timestampBegin.setHours(h, m);
        this.changeDate();
      }
    },
    inputBeginTime: {
      get() {
        return calendarUtils.dateToTimeType(this.ourEvent.timestampBegin);
      },
      set(val) {
        const split = val.split(":");
        const h = Number.parseInt(split[0]);
        const m = Number.parseInt(split[1]);
        const timestampBegin = new Date(this.ourEvent.timestampBegin);
        timestampBegin.setHours(h, m);
        this.ourEvent.timestampBegin = timestampBegin;
        this.changeDate();
      }
    },
    inputEndDate: {
      get() {
        return calendarUtils.dateToDateType(this.ourEvent.timestampEnd);
      },
      set(val) {
        const h = this.ourEvent.timestampEnd.getHours();
        const m = this.ourEvent.timestampEnd.getMinutes();
        this.ourEvent.timestampEnd = new Date(val);
        this.ourEvent.timestampEnd.setHours(h, m);
        this.changeDate();
      }
    },
    inputEndTime: {
      get() {
        return calendarUtils.dateToTimeType(this.ourEvent.timestampEnd);
      },
      set(val) {
        const split = val.split(":");
        const h = Number.parseInt(split[0]);
        const m = Number.parseInt(split[1]);
        const timestampEnd = new Date(this.ourEvent.timestampEnd);
        timestampEnd.setHours(h, m);
        this.ourEvent.timestampEnd = timestampEnd;
        this.changeDate();
      }
    },
    workgroupMembers() {
      const { workgroupId } = this.$route.params;
      return this.workgroups.find(wg => wg.id === parseInt(workgroupId))
        .members;
    },
    isEditable() {
      if (this.deleted) return false;
      if (this.event.timestampEnd < new Date()) return false;
      if (this.event.owner == this.currentUser.id) return true;
      for (let i = 0; i < this.event.members.length; i++)
        if (this.event.members[i].id == this.currentUser.id) return true;
      return false;
    },
    isTimestampBeginEditable() {
      if (this.event.originalBegin)
        return !this.isEditable || this.event.originalBegin < new Date();
      return !this.isEditable || this.event.timestampBegin < new Date();
    },
    isErasable() {
      if (this.deleted) return false;
      if (this.event.owner == this.currentUser.id) return true;
      for (let i = 0; i < this.event.members.length; i++)
        if (this.event.members[i].id == this.currentUser.id) return true;
      return false;
    },
    todayDate() {
      return calendarUtils.dateToDateType(new Date());
    },
    timestampBeginDate() {
      const now = new Date();
      if (this.event.originalBegin && this.event.originalBegin <= now)
        return calendarUtils.dateToDateType(this.event.originalBegin);
      else if (this.event.timestampBegin <= now)
        return calendarUtils.dateToDateType(this.event.timestampBegin);
      else return calendarUtils.dateToDateType(now);
    },
    membersId() {
      return this.ourEvent.members.map(m => m.id);
    }
  },
  watch: {
    event: function(event) {
      this.ourEvent = {
        id: event.id,
        title: event.title,
        timestampBegin:
          event.originalBegin == undefined
            ? new Date(event.timestampBegin)
            : new Date(event.originalBegin),
        timestampEnd:
          event.originalBegin == undefined
            ? new Date(event.timestampEnd)
            : new Date(event.originalEnd),
        description: event.description,
        members: this.event.members
      };
    }
  }
};
</script>

<style>
.event-inspector {
  position: fixed;
  top: 45%;
  left: 50%;
  min-width: 600px;
  width: 60%;
  max-width: 800px;
  transform: translate(-50%, -50%);
  z-index: 100;
  border: 4px dotted transparent;
}
@media (max-width: 768px) {
  .event-inspector {
    min-width: unset;
    width: 100vw;
    height: 100vh;
    top: 50%;
    overflow: auto;
  }
}
.hightlight {
  color: #1c4885;
}
.event-inspector .neu-button {
  height: 40px;
}
.event-inspector .neu-button > button {
  font-size: medium;
}
.event-inspector li {
  list-style: none;
}
.event-inspector span:hover {
  cursor: pointer;
}

input:invalid + span::after {
  content: "✖";
}

input:valid + span::after {
  content: "✓";
}

.settings {
  width: 60%;
}

.membri {
  width: 40%;
}
</style>
