<template>
  <NeuContainer class="event-inspector w-50 px-5 py-4" disableHover>
    <div class="d-flex space-between justify-content-between mx-2 p-2">
      <h3 v-if="!isEditable" class="hightlight font-weight-bold my-2">
        {{ ourEvent.title }}
      </h3>
      <NeuInput
        v-if="isEditable"
        :placeholder="'Titolo'"
        v-model="ourEvent.title"
        @blur="setTitle"
      />
      <div v-if="isEditable" class="px-2 col-auto col-xl-auto">
        <NeuButton
          class="px-2"
          :backgroundColor="'#efeeee'"
          :color="'#787878'"
          :shadowRadius="5"
          :shadowBlur="10"
          >🗑️ Elimina</NeuButton
        >
      </div>
    </div>
    <div class="d-flex">
      <div class="settings">
        <div class="p-2">
          <div class="d-flex">
            <div class="d-flex flex-column justify-content-center w-25">
              <p class="hightlight p-0 m-0 col-sm-4">
                Inizio
              </p>
            </div>
            <div class="d-flex">
              <NeuInput
                type="date"
                v-model="inputBeginDate"
                :disabled="!isEditable"
                :min="todayDate"
              />
              <NeuInput
                type="time"
                class="w-50"
                v-model="inputBeginTime"
                :disabled="!isEditable"
              />
            </div>
          </div>
          <div class="d-flex">
            <div class="d-flex flex-column justify-content-center w-25">
              <p class="hightlight p-0 m-0 col-sm-4">Fine</p>
            </div>
            <div class="d-flex">
              <NeuInput
                type="date"
                v-model="inputEndDate"
                :disabled="!isEditable"
              />
              <NeuInput
                type="time"
                class="w-50"
                v-model="inputEndTime"
                :disabled="!isEditable"
              />
            </div>
          </div>
        </div>
        <p class="hightlight mt-4">Descrizione:</p>
        <NeuTextarea
          v-if="isEditable"
          v-model="ourEvent.description"
          :placeholder="'Aggiungi qui la tua descrizione!'"
          ref="description"
          @blur="setDescription"
        />
        <p class="pl-3" v-if="!isEditable">{{ ourEvent.description }}</p>
      </div>
      <div class="membri p-5">
        <p class="hightlight mb-1">👑 Proprietario:</p>
        <li class="d-flex align-items-center">
          <Avatar
            class="mr-2"
            :firstname="getMember(event.owner).firstname"
            :lastname="getMember(event.owner).lastname"
          />
          {{ getMember(event.owner).firstname }}
          {{ getMember(event.owner).lastname }}
        </li>
        <p class="hightlight">🧑‍🤝‍🧑 Assegnato:</p>
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
import NeuTextarea from "@/components/neu-button/NeuTextarea";
import NeuInput from "@/components/neu-button/NeuInput";
import NeuButton from "@/components/neu-button/NeuButton";
import BigAddButton from "@/components/section/BigAddButton";
import Avatar from "@/components/avatar/Avatar";
import UserDropdown from "@/components/task/UserDropdown";

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
      error: false,
      errorText: ""
    };
  },
  methods: {
    ...mapActions(["editEvent"]),
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
    checkDate() {
      if (this.ourEvent.timestampBegin > this.ourEvent.timestampEnd) {
        const hx = this.ourEvent.timestampEnd.getHours();
        const mx = this.ourEvent.timestampEnd.getMinutes();
        this.ourEvent.timestampEnd = new Date(this.ourEvent.timestampBegin);
        this.ourEvent.timestampEnd.setDate(
          this.ourEvent.timestampEnd.getDate() + 1
        );
        this.ourEvent.timestampEnd.setHours(hx, mx);
      }
    },
    async changeDate() {
      const newEvent = {
        id: this.ourEvent.id,
        timestampBegin: this.ourEvent.timestampBegin,
        timestampEnd: this.ourEvent.timestampEnd
      };
      const { workgroupId } = this.$route.params;
      console.log(workgroupId, newEvent, this.event);
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
        this.checkDate();
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
        this.ourEvent.timestampBegin.setHours(h, m);
        this.checkDate();
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
        this.checkDate();
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
        this.ourEvent.timestampEnd.setHours(h, m);
        this.checkDate();
        this.changeDate();
      }
    },
    workgroupMembers() {
      const { workgroupId } = this.$route.params;
      return this.workgroups.find(wg => wg.id === parseInt(workgroupId))
        .members;
    },
    isEditable() {
      if (this.event.owner == this.currentUser.id) return true;
      for (let i = 0; i < this.event.members.length; i++)
        if (this.event.members[i].id == this.currentUser.id) return true;
      return false;
    },
    todayDate() {
      return calendarUtils.dateToDateType(new Date());
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
  min-width: 500px;
  min-height: 300px;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
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
  color: rgb(211, 76, 76);
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
