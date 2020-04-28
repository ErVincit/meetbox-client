<template>
	<div>
		<h1>Login Page</h1>
		<form name="login" @submit.prevent="onSubmit">
			<div class="form-group">
				<label for="email">Email</label>
				<input class="form-control" type="email" v-model="email" name="email" required autofocus autocomplete="email" />
			</div>
			<div class="form-group">
				<label for="password">Password</label>
				<input class="form-control" type="password" v-model="password" name="password" required autocomplete="current-password" />
			</div>
			<div class="form-group">
				<button class="mt-3 container-fluid btn btn-primary">Accedi</button>
			</div>
		</form>
	</div>
</template>

<script>
export default {
	name: "Login",
	data() {
		return { email: "", password: "" };
	},
	methods: {
		onSubmit() {
			const { email, password } = this;
			console.log("Logging in as...", email, password);
			if (email && password) {
				fetch("http://localhost:8080/api/login", {
					method: "POST",
					body: JSON.stringify({ email, password }),
					headers: { "Content-Type": "application/json" },
					credentials: "include"
				}).then(async () => {
					console.log("Logged in...");
				});
			}
		}
	}
};
</script>

<style scoped>
form {
	width: 500px;
	margin: auto;
}
</style>
