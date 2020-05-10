<template>
  <NeuContainer class="event-inspector w-50 px-5 py-4" disableHover>
    <div class="d-flex space-between justify-content-between mx-2 p-2">
      <h3
        v-if="!isEditable"
        class="hightlight font-weight-bold my-2"
        @click="showArea"
      >
        {{ ourEvent.title }}
      </h3>
      <NeuInput
        v-if="isEditable"
        :placeholder="'Titolo'"
        v-model="ourEvent.title"
        @blur="setTitle"
      />
      <div class="ggg"></div>
      <NeuButton
        v-if="isEditable && newEventCreation"
        @click.stop="createEvent"
      >
        Conferma
      </NeuButton>
    </div>
    <div class="d-flex">
      <div class="w-75">
        <div class="p-2">
          <div class="d-flex">
            <div class="d-flex flex-column justify-content-center w-25">
              <p class="hightlight p-0 m-0 col-sm-4">
                Inizio
              </p>
            </div>
            <div class="datetime_calendar">
              <input
                type="date"
                ref="begin_date"
                @change="dateTimeChange"
                :disabled="!isEditable"
              />
              <input
                type="time"
                ref="begin_time"
                @change="dateTimeChange"
                :disabled="!isEditable"
              />
            </div>
          </div>
          <div class="d-flex">
            <div class="d-flex flex-column justify-content-center w-25">
              <p class="hightlight p-0 m-0 col-sm-4">Fine</p>
            </div>
            <div class="datetime_calendar">
              <input
                type="date"
                ref="end_date"
                @change="dateTimeChange"
                :disabled="!isEditable"
              />
              <input
                type="time"
                ref="end_time"
                @change="dateTimeChange"
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
      <div class="p-5">
        <p class="hightlight">🧑‍🤝‍🧑 Assegnato:</p>
        <li
          v-for="(member, index) in ourEvent.members"
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
        <BigAddButton
          class="col mt-2"
          v-if="isEditable"
          @click="showUserDropdown = true"
          >Aggiungi un nuovo membro</BigAddButton
        >
        <UserDropdown
          v-if="showUserDropdown"
          :users="workgroupMembers"
          :members="ourEvent.members"
          @select-user="addMember"
          @hide="showUserDropdown = false"
        />
      </div>
    </div>
    <div
      v-if="error"
      class="alert  alert-warning alert-dismissible fade show"
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
      titleArea: true,
      showUserDropdown: false,
      ourOldEvent: this.event,
      newEventCreation: false,
      ourEvent: {
        id: 0,
        title: "",
        timestampBegin: new Date(),
        timestampEnd: new Date(),
        description: "",
        members: [],
        owner: ""
      },
      error: false,
      errorText: ""
    };
  },
  mounted() {
    if (!this.event) {
      this.newEventCreation = true;
    } else {
      this.ourEvent = this.event;
      var tb = this.event.timestampBegin;
      var te = this.event.timestampEnd;
      if (this.event.originalBegin && this.event.originalEnd) {
        tb = this.event.originalBegin;
        te = this.event.originalEnd;
      }
      if (tb) {
        this.$refs.begin_date.value = calendarUtils.dateToDateType(tb);
        this.$refs.begin_time.value = calendarUtils.dateToTimeType(tb);
      }
      if (te) {
        this.$refs.end_date.value = calendarUtils.dateToDateType(te);
        this.$refs.end_time.value = calendarUtils.dateToTimeType(te);
      }
    }
  },
  methods: {
    ...mapActions(["editEvent", "addEvent"]),
    async addMember(member) {
      if (this.newEventCreation) {
        this.ourEvent.members = [...this.ourEvent.members, member];
      } else {
        const { workgroupId } = this.$route.params;
        const newEvent = {
          id: this.event.id,
          members: [...this.ourEvent.members, member].map(m => m.id)
        };
        await this.editEvent({
          workgroupId,
          event: newEvent,
          oldEvent: this.ourEvent
        });
        this.ourEvent.members.push(member);
        this.showDropdown = false;
      }
    },
    async setTitle() {
      if (!this.newEventCreation) {
        const { workgroupId } = this.$route.params;
        const newEvent = {
          id: this.ourEvent.id,
          title: this.ourEvent.title
        };
        await this.editEvent({
          workgroupId,
          event: newEvent,
          oldEvent: {
            description: this.ourOldEvent.description,
            hasNext: this.ourOldEvent.hasNext,
            hasPrevious: this.ourOldEvent.hasPrevious,
            id: this.ourOldEvent.id,
            members: this.ourOldEvent.members,
            originalBegin: new Date(this.ourOldEvent.originalBegin),
            originalEnd: new Date(this.ourOldEvent.originalEnd),
            timestampBegin: new Date(this.ourOldEvent.timestampBegin),
            timestampEnd: new Date(this.ourOldEvent.timestampEnd),
            title: this.ourOldEvent.title,
            workgroup: this.ourOldEvent.workgroup
          }
        });
      }
    },
    async setDescription() {
      if (!this.newEventCreation) {
        const { workgroupId } = this.$route.params;
        const newEvent = {
          id: this.ourEvent.id,
          description: this.ourEvent.description
        };
        await this.editEvent({
          workgroupId,
          event: newEvent,
          oldEvent: {
            description: this.ourOldEvent.description,
            hasNext: this.ourOldEvent.hasNext,
            hasPrevious: this.ourOldEvent.hasPrevious,
            id: this.ourOldEvent.id,
            members: this.ourOldEvent.members,
            originalBegin: new Date(this.ourOldEvent.originalBegin),
            originalEnd: new Date(this.ourOldEvent.originalEnd),
            timestampBegin: new Date(this.ourOldEvent.timestampBegin),
            timestampEnd: new Date(this.ourOldEvent.timestampEnd),
            title: this.ourOldEvent.title,
            workgroup: this.ourOldEvent.workgroup
          }
        });
      }
    },
    async removeMember(index) {
      if (this.newEventCreation) {
        this.ourEvent.members.splice(index, 1);
      } else {
        this.ourEvent.members.splice(index, 1);
        const { workgroupId } = this.$route.params;
        const newEvent = {
          id: this.ourEvent.id,
          members: this.ourEvent.members.map(m => m.id)
        };
        await this.editEvent({
          workgroupId,
          event: newEvent,
          oldEvent: this.ourOldEvent
        });
      }
    },
    async createEvent() {
      if (this.ourEvent.title == "") {
        this.errorText = "Devi impostare un titolo all'evento";
        this.error = true;
        return;
      } else if (this.$refs.begin_date.value == "") {
        this.errorText = "Devi impostare una data di inizio";
        this.error = true;
        return;
      } else if (this.$refs.end_date.value == "") {
        this.errorText = "Devi impostare una data di fine";
        this.error = true;
        return;
      }

      const { workgroupId } = this.$route.params;
      const newEvent = {
        title: this.ourEvent.title,
        description: this.ourEvent.description,
        timestampBegin: new Date(this.ourEvent.timestampBegin),
        timestampEnd: new Date(this.ourEvent.timestampEnd)
      };
      // console.log("NEW:", newEvent);
      await this.addEvent({ workgroupId, event: newEvent });
      this.$emit("hideEventInspector");
      this.cleanEvent();
    },
    showArea() {
      this.titleArea = false;
    },
    cleanEvent() {
      this.ourEvent = {
        id: 0,
        title: "",
        timestampBegin: new Date(),
        timestampEnd: new Date(),
        description: "",
        members: [],
        owner: ""
      };
    },
    async dateTimeChange() {
      if (this.newEventCreation) {
        if (
          this.$refs.begin_date.value != "" &&
          calendarUtils.dateToDateType(this.ourEvent.timestampBegin) !=
            this.$refs.begin_date.value
        ) {
          const h = this.ourEvent.timestampBegin.getHours();
          const m = this.ourEvent.timestampBegin.getMinutes();
          const c = this.$refs.begin_date.value;
          this.ourEvent.timestampBegin = new Date(c);
          this.ourEvent.timestampBegin.setHours(h, m);
          this.$refs.begin_time.value = calendarUtils.dateToTimeType(
            this.ourEvent.timestampBegin
          );
        }
        if (
          this.$refs.begin_time.value != "" &&
          this.$refs.begin_time.value !=
            calendarUtils.dateToTimeType(this.ourEvent.timestampBegin)
        ) {
          const splitEnd = this.$refs.begin_time.value.split(":");
          const hEnd = Number.parseInt(splitEnd[0]);
          const mEnd = Number.parseInt(splitEnd[1]);
          this.ourEvent.timestampBegin.setHours(hEnd, mEnd);
          this.$refs.begin_date.value = calendarUtils.dateToDateType(
            this.ourEvent.timestampBegin
          );
        }
        if (
          this.$refs.end_date.value != "" &&
          calendarUtils.dateToDateType(this.ourEvent.timestampEnd) !=
            this.$refs.end_date.value
        ) {
          const h = this.ourEvent.timestampEnd.getHours();
          const m = this.ourEvent.timestampEnd.getMinutes();
          this.ourEvent.timestampEnd = new Date(this.$refs.end_date.value);
          this.ourEvent.timestampEnd.setHours(h, m);
          this.$refs.end_time.value = calendarUtils.dateToTimeType(
            this.ourEvent.timestampEnd
          );
        }
        if (
          this.$refs.end_time.value != "" &&
          this.$refs.end_time.value !=
            calendarUtils.dateToTimeType(this.ourEvent.timestampEnd)
        ) {
          const splitEnd = this.$refs.end_time.value.split(":");
          const hEnd = Number.parseInt(splitEnd[0]);
          const mEnd = Number.parseInt(splitEnd[1]);
          this.ourEvent.timestampEnd.setHours(hEnd, mEnd);
          this.$refs.end_date.value = calendarUtils.dateToDateType(
            this.ourEvent.timestampEnd
          );
        }
        if (
          this.$refs.begin_date.value != "" &&
          this.$refs.end_date.value != "" &&
          this.ourEvent.timestampBegin > this.ourEvent.timestampEnd
        ) {
          const hx = this.ourEvent.timestampEnd.getHours();
          const mx = this.ourEvent.timestampEnd.getMinutes();
          this.ourEvent.timestampEnd = new Date(this.ourEvent.timestampBegin);
          this.ourEvent.timestampEnd.setDate(
            this.ourEvent.timestampEnd.getDate() + 1
          );
          this.ourEvent.timestampEnd.setHours(hx, mx);
          this.$refs.begin_date.value = calendarUtils.dateToDateType(
            this.ourEvent.timestampBegin
          );
          this.$refs.begin_time.value = calendarUtils.dateToTimeType(
            this.ourEvent.timestampBegin
          );
          this.$refs.end_date.value = calendarUtils.dateToDateType(
            this.ourEvent.timestampEnd
          );
          this.$refs.end_time.value = calendarUtils.dateToTimeType(
            this.ourEvent.timestampEnd
          );
        }
      } else {
        const newBeginDate = new Date(this.$refs.begin_date.value);
        const split = this.$refs.begin_time.value.split(":");
        const h = Number.parseInt(split[0]);
        const m = Number.parseInt(split[1]);
        newBeginDate.setHours(h, m);

        const newEndDate = new Date(this.$refs.end_date.value);
        const splitEnd = this.$refs.end_time.value.split(":");
        const hEnd = Number.parseInt(splitEnd[0]);
        const mEnd = Number.parseInt(splitEnd[1]);
        newEndDate.setHours(hEnd, mEnd);

        if (newEndDate < newBeginDate) {
          var tb = this.ourEvent.timestampBegin;
          var te = this.ourEvent.timestampEnd;
          if (this.ourEvent.originalBegin && this.ourEvent.originalEnd) {
            tb = this.ourEvent.originalBegin;
            te = this.ourEvent.originalEnd;
          }
          this.$refs.begin_date.value = calendarUtils.dateToDateType(tb);
          this.$refs.begin_time.value = calendarUtils.dateToTimeType(tb);
          this.$refs.end_date.value = calendarUtils.dateToDateType(te);
          this.$refs.end_time.value = calendarUtils.dateToTimeType(te);
        }
        const newEvent = {
          id: this.ourEvent.id,
          timestampBegin: newBeginDate,
          timestampEnd: newEndDate
        };
        const { workgroupId } = this.$route.params;
        await this.$store.dispatch("editEvent", {
          workgroupId,
          event: newEvent,
          oldEvent: this.ourEvent
        });
      }
    }
  },
  computed: {
    ...mapGetters(["workgroups", "currentUser"]),
    workgroupMembers() {
      const { workgroupId } = this.$route.params;
      return this.workgroups.find(wg => wg.id === parseInt(workgroupId))
        .members;
    },
    isEditable() {
      if (!this.event) return true;
      for (let i = 0; i < this.ourEvent.members.length; i++)
        if (this.ourEvent.members[i].id == this.currentUser.id) return true;
      if (this.ourEvent.owner == this.currentUser.id) return true;
      return false;
    }
  },
  watch: {
    event: function(event) {
      if (!event) {
        this.newEventCreation = true;
        this.cleanEvent();
        this.$refs.begin_date.value = "";
        this.$refs.begin_time.value = "";
        this.$refs.end_date.value = "";
        this.$refs.end_time.value = "";
      } else {
        this.newEventCreation = false;
        this.ourEvent = event;
        var tb = event.timestampBegin;
        var te = event.timestampEnd;
        if (event.originalBegin && event.originalEnd) {
          tb = event.originalBegin;
          te = event.originalEnd;
        }
        if (tb) {
          this.$refs.begin_date.value = calendarUtils.dateToDateType(tb);
          this.$refs.begin_time.value = calendarUtils.dateToTimeType(tb);
        }
        if (te) {
          this.$refs.end_date.value = calendarUtils.dateToDateType(te);
          this.$refs.end_time.value = calendarUtils.dateToTimeType(te);
        }
      }
    },
    clean: function() {
      console.log("Cleanno");
      this.cleanEvent();
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
.event-inspector span {
  font-size: 25px;
}
.event-inspector span:hover {
  color: rgb(211, 76, 76);
  cursor: pointer;
}
.datetime_calendar {
  left: 100px;
}

input:invalid + span::after {
  content: "✖";
}

input:valid + span::after {
  content: "✓";
}
</style>
