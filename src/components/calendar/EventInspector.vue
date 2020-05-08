<template>
  <NeuContainer class="event-inspector w-50 px-5 py-4" disableHover>
    <h3 class="hightlight font-weight-bold my-2">{{ event.title }}</h3>
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
              <input type="date" ref="begin_date" />
              <input type="time" ref="begin_time" />
            </div>
          </div>
          <div class="d-flex">
            <div class="d-flex flex-column justify-content-center w-25">
              <p class="hightlight p-0 m-0 col-sm-4">Fine</p>
            </div>
            <div class="datetime_calendar">
              <input type="date" ref="end_date" />
              <input type="time" ref="end_time" />
            </div>
          </div>
        </div>
        <p class="hightlight mt-4">Descrizione:</p>
        <p class="pl-2">{{ event.description }}</p>
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
import NeuContainer from "@/components/neu-button/NeuContainer";
// import NeuButton from "@/components/neu-button/NeuButton";
import BigAddButton from "@/components/section/BigAddButton";
import Avatar from "@/components/avatar/Avatar";

import calendarUtils from "@/views/calendar/calendar_utils";

export default {
  name: "EventInspector",
  components: { NeuContainer, BigAddButton, Avatar },
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
  mounted() {
    const tb = this.event.timestampBegin;
    const te = this.event.timestampEnd;
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
</style>
