<template>
  <div>
    <div class="signup-container">
      <NeuContainer class="p-4" disableHover>
        <form
          class="container-fluid h-100 d-flex flex-column align-items-center"
          @submit.prevent="onSubmit"
        >
          <Logo class="flex-grow-1 my-5 my-md-0 d-flex align-items-center" />
          <NeuInput
            class="my-4 w-75"
            type="email"
            v-model="email"
            placeholder="Email"
            autocomplete="email"
          />
          <NeuInput
            class="my-4 w-75"
            type="text"
            v-model="firstname"
            placeholder="Nome"
            autocomplete="given-name"
          />
          <NeuInput
            class="my-4 w-75"
            type="text"
            v-model="lastname"
            placeholder="Cognome"
            autocomplete="family-name"
          />
          <NeuInput
            class="my-4 w-75"
            type="password"
            v-model="password"
            placeholder="Password"
            autocomplete="new-password"
          />
          <NeuInput
            class="my-4 w-75"
            type="password"
            v-model="confermaPassword"
            placeholder="Conferma password"
            autocomplete="new-password"
          />
          <p>
            Hai già un account?
            <router-link to="/Login">Accedi</router-link>
          </p>
          <NeuButton
            class="my-3 mt-5 w-50"
            backgroundColor="#2F80ED"
            color="white"
            :shadowRadius="2"
            :shadowBlur="6"
            >Registrati</NeuButton
          >
        </form>
      </NeuContainer>
      <Alert
        v-if="alertShowed"
        :message="alertMessage"
        @close="alertShowed = false"
        :type="alertType"
      />
    </div>
    <RedirectWindow v-if="showRedirectWindow" ref="redirect-window" />
    <img id="draw-left" src="@/assets/homepage-draw-left.svg" />
    <img id="draw-right" src="@/assets/homepage-draw-right.svg" />
  </div>
</template>

<script>
import Alert from "@/components/alert/Alert";
import Logo from "@/components/logo/Logo";
import NeuButton from "@/components/neu-button/NeuButton";
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuInput from "@/components/neu-button/NeuInput";
import RedirectWindow from "@/components/signup/RedirectWindow";

import { mapActions } from "vuex";

export default {
  name: "Signup",
  components: {
    Logo,
    NeuButton,
    NeuContainer,
    NeuInput,
    RedirectWindow,
    Alert
  },
  data() {
    return {
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      confermaPassword: "",
      showRedirectWindow: false,
      alertShowed: false,
      alertType: "",
      alertMessage: ""
    };
  },
  async created() {
    if (this.currentUser) await this.redirect();
    else {
      const validated = await this.validateUser();
      if (validated) await this.redirect();
    }
  },
  methods: {
    ...mapActions(["validateUser", "signupUser", "fetchWorkgroups"]),
    async onSubmit() {
      const { email, firstname, lastname, password, confermaPassword } = this;
      if (email && firstname && lastname && password && confermaPassword) {
        if (password == confermaPassword) {
          this.showAlert("info", "Registrazione in corso...");
          const registered = await this.signupUser({
            email,
            firstname,
            lastname,
            password
          });
          if (registered) {
            this.alertShowed = false;
            this.showRedirectWindow = true;
          } else this.showAlert("danger", "Registrazione fallita. Riprovare");
        }
      }
    },
    async redirect() {
      this.showAlert(
        "success",
        "Autenticazione completata. Rindirizzamento in corso..."
      );
      await this.fetchWorkgroups();
      if (this.workgroups.length === 0) this.$router.push("/tutorial");
      else this.$router.push("/" + this.workgroups[0].id + "/drive");
    },
    showAlert(type, message) {
      this.alertType = type;
      this.alertMessage = message;
      this.alertShowed = true;
    }
  }
};
</script>

<style scoped>
.signup-container > .neu-container {
  position: absolute;
  min-width: 200px;
  width: 40%;
  max-width: 600px;
  min-height: 500px;
  max-height: 80%;
  max-height: 650px;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
@media (max-width: 992px) {
  .signup-container > .neu-container {
    width: 50%;
    top: 50%;
  }
}
@media (max-width: 768px) {
  .signup-container > .neu-container {
    max-width: unset;
    max-height: unset;
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .signup-container > .neu-container .logo {
    flex-grow: unset !important;
  }
}

#button_container {
  width: 50%;
}

#logo {
  margin: 0 auto;
}

.input {
  margin: auto;
}

.input-container {
  margin: auto;
}

#draw-left {
  position: absolute;
  top: 0;
  left: 0;
  max-height: 100%;
}

#draw-right {
  position: absolute;
  top: 0;
  right: 0;
  max-height: 100%;
}
</style>
