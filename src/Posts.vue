<template>
	<div>
		<Nav />
		<b-container>
			<b-row class="justify-content-center mt-5">
				<b-col md="6">
					<div v-if="loading">
						Loading...
					</div>
					<table class="table">
						<tbody>
							<tr v-for="post in posts" v-bind:key="post.id">
								<td style="width: 30%">{{post.date.split(" ")[0]}}</td>
								<td><router-link :to="'/post/' + post.id">{{post.title}}</router-link></td>
							</tr>
						</tbody>
					</table>
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
	const sortByKey = (array, key) => {
		return array.sort(function(a, b) {
			var x = a[key]; var y = b[key];
			return -1 * ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	}
	export default {
		data: () => {
			return {
				posts: null,
				loading: true,
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
					this.posts = sortByKey(response.posts, "date");
				}
			})
			.finally(() => {
				this.loading = false;
			});
		}
	}
</script>