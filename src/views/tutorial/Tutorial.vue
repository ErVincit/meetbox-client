<template>
  <Loading class="w-100 h-100 justify-content-center" v-if="loading" show />
  <div v-else class="tutorial d-flex overflow-auto h-100">
    <img
      id="draw-left"
      class="d-none d-md-block"
      src="@/assets/homepage-draw-left.svg"
    />
    <div class="col d-flex flex-column align-items-center">
      <div class="w-75 py-5" style="min-width: 300px">
        <h1 class="w-100 text-center">
          Benvenuto in <span>MeetBox</span>, {{ currentUser.firstname }}!
        </h1>
        <h3 class="mb-5 text-center">Crea il tuo primo gruppo di lavoro 🧑‍🤝‍🧑</h3>
        <div class="pt-3 pb-3 w-100">
          <h4 class="col mb-4 highlight text-left" style="font-weight: 600">
            <span style="font-size: 30px">1)</span> Scegli un nome...
          </h4>
          <div class="d-flex align-items-center px-2 mt-1 w-100">
            <NeuInput
              v-model="name"
              class="mx-4 col"
              placeholder="es. Gruppo di MeetBox"
            />
          </div>
        </div>
        <div class="py-3 pb-3 w-100">
          <h4 class="col mb-4 highlight text-left" style="font-weight: 600">
            <span style="font-size: 30px">2)</span> Scegli un immagine...
          </h4>
          <div class="row align-items-center justify-content-center px-2 mt-1">
            <div class="col-12 col-md-auto row justify-content-center py-2 m-0">
              <img
                class="rounded-circle"
                :src="imageURL"
                width="100"
                height="100"
              />
            </div>
            <NeuInput
              class="mx-4 col"
              v-model="image"
              placeholder="es. https://meetbox.com/esempio.png"
            />
          </div>
        </div>
        <div class="py-3 pb-3 w-100">
          <h4 class="col mb-4 highlight text-left" style="font-weight: 600">
            <span style="font-size: 30px">3)</span> Aggiungi subito dei
            membri...
          </h4>
          <div
            class="d-flex flex-column justify-content-center px-2 mt-1 pt-5 position-relative"
          >
            <NeuContainer
              class="search-box d-flex flex-column w-100 position-absolute"
              style="top: 0; z-index: 1000"
              :disabled="!searchMembers || searchMembers.length === 0"
              disableHover
            >
              <NeuInput
                class="col"
                v-model="memberEmail"
                @input="search"
                placeholder="Ricerca membro per email"
              />
              <Member
                class="mx-2 mt-1 rounded-pill"
                v-for="member in searchMembers"
                :key="member.id"
                :member="member"
                @click="selectMember(member)"
                dontClose
              />
            </NeuContainer>
            <Member
              class="mx-2 mt-2"
              v-for="(member, index) in selectedMembers"
              :key="member.id"
              :member="member"
              @remove="selectedMembers.splice(index, 1)"
            />
          </div>
        </div>
        <NeuButton
          class="col mx-auto mt-5 mt-3 w-50"
          color="var(--primary)"
          style="height: 50px;"
          @click="newWorkgroup"
        >
          Conferma
        </NeuButton>
      </div>
    </div>
    <Alert
      v-if="alertShowed"
      :message="alertMessage"
      @close="alertShowed = false"
      :type="alertType"
    />
    <img
      id="draw-right"
      class="d-none d-md-block"
      src="@/assets/homepage-draw-right.svg"
    />
  </div>
</template>

<script>
import Loading from "@/components/loading/Loading";
import NeuInput from "@/components/neu-button/NeuInput";
import NeuButton from "@/components/neu-button/NeuButton";
import NeuContainer from "@/components/neu-button/NeuContainer";
import Member from "@/components/task/Member";
import Alert from "@/components/alert/Alert";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "Tutorial",
  components: { Loading, NeuInput, NeuButton, Member, NeuContainer, Alert },
  data() {
    return {
      loading: true,
      image: "",
      name: "",
      memberEmail: "",
      searchMembers: [],
      selectedMembers: [],
      alertShowed: false,
      alertMessage: "",
      alertType: ""
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
    imageURL() {
      if (this.image.trim().length === 0) return require("@/assets/logo.svg");
      return this.image;
    }
  },
  methods: {
    ...mapActions(["validateUser", "createWorkgroup", "addMember"]),
    async search(value) {
      value = value.trim();
      if (value.length === 0) {
        this.searchMembers = [];
        return;
      }
      const url = `${process.env.VUE_APP_SERVER_ADDRESS}/api/search`;
      const response = await fetch(url, {
        credentials: "include",
        body: JSON.stringify({ value }),
        headers: { "Content-Type": "application/json" },
        method: "POST"
      });
      const json = await response.json();
      if (json.error) console.error(json);
      else this.searchMembers = json.data;
    },
    async newWorkgroup() {
      const { name, image } = this;
      this.showAlert("info", "Creazione gruppo di lavoro in corso...");
      const workgroup = await this.createWorkgroup({ name, image });
      this.showAlert("info", "Aggiungendo membri...");
      let count = 0;
      for (const member of this.selectedMembers) {
        this.showAlert(
          "info",
          "Aggiungendo membri..." + count + "/" + this.selectedMembers.length
        );
        await this.addMember({
          workgroupId: workgroup.id,
          memberId: member.id
        });
        count++;
      }
      this.alertShowed = false;
      this.$router.push(`/${workgroup.id}/drive`);
    },
    selectMember(member) {
      this.selectedMembers.unshift(member);
      this.memberEmail = "";
      this.searchMembers = [];
    },
    showAlert(type, message) {
      this.alertType = type;
      this.alertMessage = message;
      this.alertShowed = true;
    }
  },
  async mounted() {
    if (!this.currentUser) {
      const validated = await this.validateUser();
      if (!validated) this.$router.push("/login");
    }
    this.loading = false;
  }
};
</script>

<style>
h1 {
  color: var(--text-color-primary);
}
h3 {
  color: var(--text-color-bg);
}
h1 > span {
  font-family: Open Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 48px;
  line-height: 65px;
  letter-spacing: -0.055em;

  color: var(--primary);
}

.tutorial .neu-input input {
  height: 40px;
}
.tutorial img {
  object-fit: cover;
}
.tutorial .search-box .member:first {
  margin-top: 8px;
}
.tutorial .search-box .member:last-child {
  margin-bottom: 8px;
}
.tutorial .search-box .member:hover {
  background-color: var(--primary);
  color: var(--text-color-primary);
  cursor: pointer;
}

#draw-left {
  max-width: 10%;
  height: 100%;
  object-fit: cover;
  object-position: right;
  width: auto;
}

#draw-right {
  max-width: 10%;
  height: 100%;
  object-fit: cover;
  object-position: left;
  width: auto;
}
</style>
