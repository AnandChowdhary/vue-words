<template>
	<div>
		<Nav />
		<p>{{post.title}}</p>
		<div v-html="post.body"></div>
		<footer>
			<router-link class="btn btn-outline-primary" :to="'/write/' + $route.params.id">Edit</router-link>
			<b-btn @click.prevent="deletePost" variant="outline-danger">Delete</b-btn>
		</footer>
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
			.catch(response => { this.$root.toast("An error occurred"); })
			.then(response => {
				if (response.error) {
					this.$root.toast(response.error);
				} else {
					this.post = response.post;
				}
			})
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