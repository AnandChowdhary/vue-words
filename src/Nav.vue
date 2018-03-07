<template>
	<div class="text-center">
		<h1 class="text-center h3 mb-2 mt-5">Words</h1>
		<b-nav class="justify-content-center mb-5">
			<b-nav-item><router-link to="/read">Read</router-link></b-nav-item>
			<b-nav-item><router-link to="/write">Write</router-link></b-nav-item>
			<b-nav-item><a href="#" @click.prevent="downloadBackup">Backup</a></b-nav-item>
			<b-nav-item><a href="#" @click.prevent="logout">Logout</a></b-nav-item>
		</b-nav>
	</div>
</template>

<script>
	import router from "./router";
	import constants from "./constants";
	export default {
		methods: {
			logout() {
				localStorage.removeItem("token");
				this.$root.toast("Bye bye!");
				router.push("/");
			},
			downloadBackup() {
				fetch(constants.API_URL + "backup", {
					method: "GET",
					headers: new Headers({
						"Content-Type": "application/json",
						"token": localStorage.token
					})
				}).then(res => res.json())
				.catch(() => {
					this.$root.toast("An error occurred in creating a backup 😨");
				})
				.then(response => {
					if (response.error) {
						this.$root.toast(response.error);
					} else {
						this.$root.toast("Downloading... 👍");
						window.open(response.url);
					}
				})
			}
		}
	}
</script>