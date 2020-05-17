<template>
  <NeuContainer class="workgroup-settings p-2" disableHover>
    <div style="position: relative">
      <p class=" mb-0 highlight" style="line-height: 30px; font-size: 1.5rem">
        Impostazioni gruppo di lavoro
      </p>
      <button type="button" class="close" aria-label="Close" @click.stop="exit">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <hr class="my-1" />
    <div class="mt-3">
      <p class="col m-0">Immagine:</p>
      <div class="d-flex align-items-center px-2 mt-1">
        <img
          class="rounded-circle"
          :src="currentWorkgroup.image"
          width="50"
          height="50"
        />
        <NeuInput
          class="col px-0 mx-2"
          v-model="currentWorkgroup.image"
          placeholder="URL immagine"
          @blur="changeWorkgroup"
        />
      </div>
    </div>
    <div class="mt-3">
      <p class="col m-0">Nome:</p>
      <div class="d-flex align-items-center px-2 mt-1">
        <NeuInput
          class="col px-0 mx-2"
          v-model="currentWorkgroup.name"
          placeholder="es. Mio workgroup"
          @blur="changeWorkgroup"
        />
      </div>
    </div>
    <div class="mt-3">
      <p class="col m-0">Membri:</p>
      <div class="d-flex flex-column px-2 mt-1">
        <div style="max-height: 200px; overflow-y: auto">
          <Member
            v-for="member of members"
            :key="member.id"
            :member="member"
            @remove="removeMember"
          />
        </div>
        <div class="dropdown">
          <BigAddButton
            class="w-100 mt-2"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Aggiungi un membro
          </BigAddButton>
          <NeuContainer
            class="p-2 w-100 my-2 dropdown-menu search-box"
            style="border: none"
            disableHover
          >
            <NeuInput
              class="col pl-0 pr-2"
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
        </div>
      </div>
    </div>
    <div class="mt-3 d-flex justify-content-center">
      <button
        class="mx-4 mt-5 mb-2 delete-btn rounded-pill"
        @click="removeWorkgroup"
      >
        ⚠ Elimina workgroup ⚠
      </button>
    </div>
    <Alert
      :type="alertType"
      v-if="alertShowed"
      :message="alertMessage"
      :timeout="alertTimeout"
      @close="alertShowed = false"
    />
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuInput from "@/components/neu-button/NeuInput";
import Member from "@/components/task/Member";
import BigAddButton from "@/components/section/BigAddButton";
import Alert from "@/components/alert/Alert";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "WorkgroupSettings",
  components: { NeuContainer, Alert, NeuInput, Member, BigAddButton },
  data() {
    return {
      alertShowed: false,
      alertMessage: "",
      alertTimeout: null,
      alertType: "",
      searchMembers: [],
      memberEmail: ""
    };
  },
  computed: {
    ...mapGetters(["workgroups"]),
    currentWorkgroup() {
      const { workgroupId } = this.$route.params;
      if (this.workgroups)
        return this.workgroups.find(wg => wg.id === parseInt(workgroupId));
      return null;
    },
    members() {
      return this.currentWorkgroup.members;
    }
  },
  methods: {
    ...mapActions([
      "deleteWorkgroup",
      "addMember",
      "deleteMember",
      "editWorkgroup"
    ]),
    exit() {
      this.$emit("exit");
    },
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
    async selectMember(member) {
      this.showAlert(
        "info",
        "Aggiunta di " + member.firstname + " in corso..."
      );
      const { workgroupId } = this.$route.params;
      await this.addMember({
        workgroupId: parseInt(workgroupId),
        memberId: member.id
      });
      this.showAlert(
        "success",
        member.firstname + " ora fa parte del gruppo di lavoro 😊"
      );
      setTimeout(() => (this.alertShowed = false), 3000);
    },
    async removeMember(member) {
      this.showAlert("info", "Salutando " + member.firstname + "...👋");
      const { workgroupId } = this.$route.params;
      await this.deleteMember({
        workgroupId: parseInt(workgroupId),
        memberId: member.id
      });
      this.showAlert(
        "success",
        member.firstname + " ora non fa più parte del gruppo di lavoro 😟"
      );
      setTimeout(() => (this.alertShowed = false), 3000);
    },
    async changeWorkgroup() {
      const { workgroupId } = this.$route.params;
      await this.editWorkgroup({
        workgroupId,
        editObject: {
          name: this.currentWorkgroup.name,
          image: this.currentWorkgroup.image
        }
      });
    },
    async removeWorkgroup() {
      if (this.workgroups.length === 1) {
        this.showAlert(
          "danger",
          "Non puoi eliminare il tuo ultimo gruppo di lavoro"
        );
        setTimeout(() => (this.alertShowed = false), 3000);
        return;
      }
      this.showAlert("info", "Eliminazione in corso...");
      const { workgroupId } = this.$route.params;
      await this.deleteWorkgroup(workgroupId);
      const workgroup = this.workgroups[0];
      this.exit();
      this.$router.push(`/${workgroup.id}/drive`);
    },
    showAlert(type, message, timeout) {
      this.alertType = type;
      this.alertMessage = message;
      this.alertTimeout = timeout;
      this.alertShowed = true;
    }
  }
};
</script>

<style scoped>
.workgroup-settings {
  position: fixed;
  min-width: 400px;
  width: 40%;
  z-index: 1000;
  cursor: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@media (max-width: 500px) {
  .workgroup-settings {
    min-width: unset;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
}

.workgroup-settings .search-box .member:first {
  margin-top: 8px;
}
.workgroup-settings .search-box .member:last-child {
  margin-bottom: 8px;
}
.workgroup-settings .search-box .member:hover {
  background-color: var(--primary);
  color: var(--text-color-primary);
  cursor: pointer;
}

.workgroup-settings .close {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
  color: var(--text-color-bg);
}
.workgroup-settings .close:hover {
  color: var(--danger);
}

.workgroup-settings .delete-btn {
  border: none;
  background-color: var(--danger);
  color: var(--text-color-primary);
  height: 40px;
  font-size: 1.2rem;
  width: 300px;
  outline: none;
}
</style>
