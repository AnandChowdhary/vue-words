<template>
	<b-container>
		<b-row class="justify-content-center mt-5">
			<b-col md="4">
				<h1 class="text-center h3 mb-5">Words</h1>
				<b-form @submit.prevent="login">
					<b-form-group label="Password">
						<b-form-input type="password" v-model="password" v-bind:disabled="!show" placeholder="Enter your password" autofocus />
						<b-button type="submit" variant="primary" class="mt-3">
							<span v-if="show">Login</span>
							<span v-else>Logging in...</span>
							<i class="fas fa-arrow-right ml-2"></i>
						</b-button>
					</b-form-group>
				</b-form>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
	import router from "./router";
	import constants from "./constants";
	export default {
		data: () => {
			return {
				password: "",
				show: true
			}
		},
		mounted() {
			if (localStorage.token) {
				router.push("/read");
			}
		},
		methods: {
			login() {
				if (!this.password) {
					this.$root.toast("Please enter a password ✋");
					return;
				}
				this.show = false;
				fetch(constants.API_URL, {
					method: "POST",
					body: JSON.stringify({
						password: this.password
					}), 
					headers: new Headers({
						"Content-Type": "application/json"
					})
				}).then(res => res.json())
				.catch(response => { localStorage.removeItem("token"); router.push("/"); })
				.then(response => {
					if (response.error) {
						this.$root.toast(response.error);
					} else {
						if (response.token) {
							localStorage.setItem("token", response.token);
							this.$root.toast("Welcome back! 👍");
							router.push("/read");
						} else {
							this.$root.toast("An error occurred");
						}
					}
				})
				.finally(() => {
					this.show = true;
					this.password = "";
				});
			}
		}
	}
</script>