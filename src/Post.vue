<template>
	<div>
		<Nav />
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/medium-editor/latest/css/medium-editor.min.css">
		<b-container>
			<b-row class="justify-content-center mt-5">
				<b-col md="7">
					<h1 class="h4 mb-4">{{post.title}}</h1>
					<div v-html="post.body"></div>
					<div v-if="loading">
						Loading...
					</div>
					<footer class="mt-5">
						<router-link class="btn btn-outline-primary mr-2" :to="'/write/' + $route.params.id">Edit</router-link>
						<b-btn @click.prevent="deletePost" variant="outline-danger">Delete</b-btn>
					</footer>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
	import Vue from "vue";
	import Nav from "./Nav.vue";
	import router from "./router";
	import constants from "./constants";
	Vue.component("Nav", Nav);
	export default {
		data: () => {
			return {
				loading: true,
				post: {}
			}
		},
		mounted() {
			if (!localStorage.token) {
				router.push("/");
			}
			fetch(constants.API_URL + "post/" + this.$route.params.id, {
				method: "GET",
				headers: new Headers({
					"Content-Type": "application/json",
					"token": localStorage.token
				})
			}).then(res => res.json())
			.catch(response => { localStorage.removeItem("token"); router.push("/"); })
			.then(response => {
				if (response.error) {
					this.$root.toast(response.error);
				} else {
					this.post = response.post;
				}
			})
			.finally(() => {
				this.loading = false;
			});
		},
		methods: {
			deletePost() {
				const confirmed = confirm("Are you sure you want to delete this post? This action is cannot be undone.");
				if (confirmed) {
					fetch(constants.API_URL + "post/" + this.$route.params.id, {
						method: "DELETE",
						headers: new Headers({
							"Content-Type": "application/json",
							"token": localStorage.token
						})
					}).then(res => res.json())
					.catch(response => { this.$root.toast("An error occurred"); })
					.then(response => {
						if (response.error) {
							this.$root.toast(response.error);
						} else {
							this.$root.toast("Deleted!");
							router.push("/read");
						}
					})
				}
			}
		}
	}
</script>