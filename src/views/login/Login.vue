<template>
  <div>
    <div class="login_container">
      <NeuContainer class="p-4" disableHover>
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
            type="password"
            v-model="password"
            placeholder="Password"
          />
          <p>Non hai un account? <span>Vaffanculo!</span></p>
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
    </div>
    <img id="draw-left" src="@/assets/homepage-draw-left.svg" />
    <img id="draw-right" src="@/assets/homepage-draw-right.svg" />
  </div>
</template>

<script>
import Store from "@/store/index";
import Logo from "@/components/logo/Logo";
import NeuButton from "@/components/neu-button/NeuButton";
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuInput from "@/components/neu-button/NeuInput";

export default {
  name: "Login",
  components: { Logo, NeuButton, NeuContainer, NeuInput },
  data() {
    return { email: "", password: "" };
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
      const { email, password } = this;
      if (email && password) {
        fetch(`${process.env.VUE_APP_SERVER_ADDRESS}/api/login`, {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        }).then(async value => {
          const message = await value.json();
          if (message.data) {
            Store.commit("usersInformation", message.data);
            this.$router.push("/17/drive");
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.login_container {
  position: absolute;
  height: 70%;
  width: 30%;

  top: 50%;
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
