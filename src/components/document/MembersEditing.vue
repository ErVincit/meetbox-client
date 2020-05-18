<template>
  <NeuContainer class="members-edit px-5 py-4" disableHover>
    <div>
      <p class="col-auto highlight m-0 pb-2 pr-3 text-nowrap">Membri:</p>
      <Member
        v-for="member in docFullMembers"
        :key="member.id"
        :member="member"
        @remove="removeMember"
      />
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
          :members="
            workgroupMembers.filter(m => document.members.includes(m.id))
          "
          @select-user="addMember"
        />
      </div>
    </div>
  </NeuContainer>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import Member from "@/components/task/Member";
import BigAddButton from "@/components/section/BigAddButton";
import UserDropdown from "@/components/task/UserDropdown";

import { mapGetters, mapActions } from "vuex";
export default {
  name: "MembersEditing",
  components: { NeuContainer, Member, BigAddButton, UserDropdown },
  props: {
    document: {
      creationdate: Date,
      folder: String,
      id: Number,
      isFolder: Boolean,
      isNote: Boolean,
      members: Array,
      name: String,
      owner: Number,
      path: String,
      size: Number,
      task: Number,
      workgroup: Number
    }
  },
  computed: {
    ...mapGetters(["workgroups"]),
    workgroupMembers() {
      const { workgroupId } = this.$route.params;
      const members = this.workgroups.find(
        wg => wg.id === parseInt(workgroupId)
      ).members;
      return members;
    },
    docFullMembers() {
      return this.workgroupMembers.filter(m =>
        this.document.members.includes(m.id)
      );
    }
  },
  methods: {
    ...mapActions(["editMembers"]),
    async addMember(member) {
      const { workgroupId } = this.$route.params;
      this.document.members.push(member.id);
      await this.editMembers({
        workgroupId,
        documentId: this.document.id,
        editObject: { members: this.document.members }
      });
    },
    async removeMember(member) {
      const { workgroupId } = this.$route.params;
      const members = this.document.members.filter(id => id !== member.id);
      this.document.members = members;
      await this.editMembers({
        workgroupId,
        documentId: this.document.id,
        editObject: { members: this.document.members }
      });
    }
  }
};
</script>

<style>
.members-edit {
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
</style>
