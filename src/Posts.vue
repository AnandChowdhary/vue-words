<template>
	<div>
		<Nav />
		<p>Posts</p>
		<ul>
			<li v-for="post in posts" v-bind:key="post.id">
				<router-link :to="'/post/' + post.id">
					{{post.title}} &middot; {{post.date.split(" ")[0]}}
				</router-link>
			</li>
		</ul>
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
				posts: null
			}
		},
		mounted() {
			if (!localStorage.token) {
				router.push("/");
			}
			fetch(constants.API_URL + "posts", {
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
					this.posts = response.posts;
				}
			})
		}
	}
</script>