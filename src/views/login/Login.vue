<template>
  <div class="login-container">
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
          autofocus
          autocomplete="username"
        />
        <NeuInput
          class="my-4 w-75"
          type="password"
          v-model="password"
          placeholder="Password"
          autocomplete="current-password"
        />
        <p class="my-5 my-md-2">
          Non hai un account? <router-link to="/signin">Registrati</router-link>
        </p>
        <NeuButton
          class="my-3 mt-5 w-50"
          backgroundColor="#2F80ED"
          color="white"
          :shadowRadius="2"
          :shadowBlur="6"
          >Accedi</NeuButton
        >
      </form>
    </NeuContainer>
    <Alert
      :show="showAlert"
      :message="alertMessage"
      @close="showAlert = false"
    />
    <img
      id="draw-left"
      class="d-none d-md-block"
      src="@/assets/homepage-draw-left.svg"
    />
    <img
      id="draw-right"
      class="d-none d-md-block"
      src="@/assets/homepage-draw-right.svg"
    />
  </div>
</template>

<script>
import Logo from "@/components/logo/Logo";
import NeuButton from "@/components/neu-button/NeuButton";
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuInput from "@/components/neu-button/NeuInput";
import Alert from "@/components/alert/Alert";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "Login",
  components: { Logo, NeuButton, NeuContainer, NeuInput, Alert },
  data() {
    return {
      email: "",
      password: "",
      showAlert: false,
      alertMessage: ""
    };
  },
  computed: mapGetters(["currentUser"]),
  async created() {
    if (this.currentUser) {
      this.redirect();
    } else {
      await this.validateUser();
      this.redirect();
    }
  },
  methods: {
    ...mapActions(["validateUser"]),
    onSubmit() {
      const { email, password } = this;
      if (email && password) {
        fetch(`${process.env.VUE_APP_SERVER_ADDRESS}/api/login`, {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        }).then(async value => {
          if (value.status === 401) {
            this.alertMessage =
              "Autenticazione fallita. Email e/o password non sono corretti";
            this.showAlert = true;
          } else {
            const message = await value.json();
            if (message.data) {
              this.$store.commit("setCurrentUser", message.data);
              this.redirect();
            }
          }
        });
      }
    },
    redirect() {
      const lastWorkgroupId = "17"; // localStorage.getItem("lastWorkgroupId");
      this.$router.push("/" + lastWorkgroupId + "/drive");
    }
  }
};
</script>

<style scoped>
.login-container > .neu-container {
  position: absolute;
  min-width: 200px;
  width: 40%;
  max-width: 600px;
  min-height: 500px;
  height: 50%;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
@media (max-width: 992px) {
  .login-container > .neu-container {
    width: 50%;
    top: 50%;
  }
}
@media (max-width: 768px) {
  .login-container > .neu-container {
    max-width: unset;
    width: 100%;
    height: 100%;
  }
  .login-container > .neu-container .logo {
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
  position: fixed;
  top: 0;
  left: 0;
  max-height: 100%;
}

#draw-right {
  position: fixed;
  top: 0;
  right: 0;
  max-height: 100%;
}
</style>
