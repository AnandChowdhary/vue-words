<template>
	<div>
		<ul>
			<li><router-link to="/read">Read</router-link></li>		
			<li><router-link to="/write">Write</router-link></li>		
			<li><a href="#" @click.prevent="downloadBackup">Download backup</a></li>		
			<li><a href="#" @click.prevent="logout">Logout</a></li>		
		</ul>
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
				.catch(() => { this.$root.toast("An error occurred"); })
				.then(response => {
					if (response.error) {
						this.$root.toast(response.error);
					} else {
						this.$root.toast("Downloading...");
						window.open(response.url);
					}
				})
			}
		}
	}
</script>