<template>
  <NeuContainer class="event-inspector w-50 px-5 py-4" disableHover>
    <h3 class="hightlight font-weight-bold my-2" @click="showArea">
      {{ event.title }}
    </h3>
    <!-- <NeuTextarea
      :invisible="false"
      :value="event.title"
      :placeholder="'Titolo'"
      ref="titleArea"
    /> -->
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
              <input type="date" ref="begin_date" @change="dateTimeChange" />
              <input type="time" ref="begin_time" @change="dateTimeChange" />
            </div>
          </div>
          <div class="d-flex">
            <div class="d-flex flex-column justify-content-center w-25">
              <p class="hightlight p-0 m-0 col-sm-4">Fine</p>
            </div>
            <div class="datetime_calendar">
              <input type="date" ref="end_date" @change="dateTimeChange" />
              <input type="time" ref="end_time" @change="dateTimeChange" />
            </div>
          </div>
        </div>
        <p class="hightlight mt-4">Descrizione:</p>
        <NeuTextarea
          :value="event.description"
          :placeholder="'Aggiungi qui la tua descrizione!'"
        />
      </div>
      <div class="p-5">
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
          <span class="ml-auto mr-2" @click.stop="removeMember(index)"
            >&times;</span
          >
        </li>
        <BigAddButton>Aggiungi un nuovo membro</BigAddButton>
      </div>
    </div>
  </NeuContainer>
</template>

<script>
import { mapActions } from "vuex";
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuTextarea from "@/components/neu-button/NeuTextarea";
import BigAddButton from "@/components/section/BigAddButton";
import Avatar from "@/components/avatar/Avatar";

import calendarUtils from "@/views/calendar/calendar_utils";

export default {
  name: "EventInspector",
  components: { NeuContainer, BigAddButton, Avatar, NeuTextarea },
  props: {
    event: {
      id: Number,
      title: String,
      description: String,
      timestampBegin: Date,
      timestampEnd: Date,
      members: Array,
      owner: String
    }
  },
  data() {
    return {
      titleArea: true
    };
  },
  mounted() {
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
  },
  methods: {
    removeMember(index) {
      this.event.members.splice(index, 1);
    },
    showArea() {
      // console.log(this.$refs.titleArea);
      // this.$refs.titleArea.style.visibility = "visible";
      this.titleArea = false;
    },
    async dateTimeChange() {
      console.log("EVENT---", this.event);
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

      if (newEndDate < newBeginDate) return;
      const newEvent = {
        id: this.event.id,
        timestampBegin: newBeginDate,
        timestampEnd: newEndDate
      };
      const { workgroupId } = this.$route.params;
      await this.$store.dispatch("editEvent", {
        workgroupId,
        event: newEvent,
        oldEvent: this.event
      });
    }
  },
  computed: {
    ...mapActions(["editEvent"])
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
</style>
