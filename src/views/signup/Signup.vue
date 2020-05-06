<template>
  <div>
    <div class="signup_container">
      <neuContainer class="p-4" disableHover>
        <form
          class="container-fluid d-flex flex-column align-items-center"
          @submit.prevent="onSubmit"
        >
          <Logo class="my-5" />
          <NeuInput
            class="my-4 w-75"
            type="text"
            v-model="email"
            placeholder="Email"
          />
          <NeuInput
            class="my-4 w-75"
            type="text"
            v-model="firstname"
            placeholder="Nome"
          />
          <NeuInput
            class="my-4 w-75"
            type="text"
            v-model="lastname"
            placeholder="Cognome"
          />
          <NeuInput
            class="my-4 w-75"
            type="password"
            v-model="password"
            placeholder="Password"
          />
          <NeuInput
            class="my-4 w-75"
            type="password"
            v-model="confermaPassword"
            placeholder="Conferma password"
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
      </neuContainer>
    </div>
    <RedirectWindow v-if="showRedirectWindow" ref="redirect-window" />
    <img id="draw-left" src="@/assets/homepage-draw-left.svg" />
    <img id="draw-right" src="@/assets/homepage-draw-right.svg" />
  </div>
</template>

<script>
//import Store from "@/store/index";
import Logo from "@/components/logo/Logo";
import NeuButton from "@/components/neu-button/NeuButton";
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuInput from "@/components/neu-button/NeuInput";
import RedirectWindow from "@/components/signup/RedirectWindow";

export default {
  name: "Signup",
  components: { Logo, NeuButton, NeuContainer, NeuInput, RedirectWindow },
  data() {
    return {
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      confermaPassword: "",
      showRedirectWindow: false
    };
  },
  created() {
    fetch(`${process.env.VUE_APP_SERVER_ADDRESS}/api/login/validate`, {
      method: "GET",
      credentials: "include"
    }).then(value => {
      if (value.status === 200) this.$router.push("/17/drive");
    });
  },
  methods: {
    onSubmit() {
      const { email, firstname, lastname, password, confermaPassword } = this;
      if (email && firstname && lastname && password && confermaPassword) {
        if (password == confermaPassword) {
          fetch(
            `${process.env.VUE_APP_SERVER_ADDRESS}/api/login/registration`,
            {
              method: "POST",
              body: JSON.stringify({
                email,
                firstName: firstname,
                lastName: lastname,
                password
              }),
              headers: { "Content-Type": "application/json" }
            }
          ).then(async value => {
            if (value.status == 200) {
              this.ShowWindow();
            }
          });
        }
      }
    },
    ShowWindow() {
      this.showRedirectWindow = true;
    }
  }
};
</script>

<style scoped>
.signup_container {
  position: absolute;
  height: 70%;
  width: 50%;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
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
}

#draw-right {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
