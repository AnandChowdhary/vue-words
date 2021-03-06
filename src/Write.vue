<template>
	<div>
		<Nav />
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/medium-editor/latest/css/medium-editor.min.css">
		<b-container>
			<b-row class="justify-content-center mt-5">
				<b-col md="7">
					<b-form @submit.prevent="publish">
						<b-form-group>
							<b-form-input type="text" v-model="title" v-bind:disabled="!show" class="heading" placeholder="Enter the title for these words..." autofocus />
						</b-form-group>
						<medium-editor :text="body" v-on:edit="processEditOperation" custom-tag="div" />
						<div class="mt-3" v-if="date">
							<b-form-input v-model="date" type="text" />
						</div>
						<b-button type="submit" variant="primary" class="mt-3">
							<span v-if="show">Publish</span>
							<span v-else>Publishing...</span>
							<i class="fas fa-arrow-right ml-2"></i>
						</b-button>
					</b-form>
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
	import Vue from "vue";
	import editor from "vue2-medium-editor";
	import router from "./router";
	import constants from "./constants";
	export default {
		data: () => {
			return {
				body: "",
				title: "",
				date: "",
				show: true
			}
		},
		components: {
			"medium-editor": editor
		},
		mounted() {
			if (this.$route.params.id) {
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
						this.title = response.post.title;
						this.date = response.post.date;
						this.body = response.post.body;
					}
				})
			}
		},
		methods: {
			publish() {
				if (!(this.title && this.body)) {
					this.$root.toast("Please write some words!");
					return;
				}
				let fetchURL = constants.API_URL;
				let postData;
				if (this.$route.params.id) {
					fetchURL += "post/" + this.$route.params.id;
					postData = {
						title: this.title,
						body: this.body,
						date: this.date,
					};
				} else {
					fetchURL += "posts";
					postData = {
						title: this.title,
						body: this.body
					};
				}
				fetch(fetchURL, {
					method: "PUT",
					body: JSON.stringify(postData),
					headers: new Headers({
						"Content-Type": "application/json",
						"token": localStorage.token
					})
				}).then(res => res.json())
				.catch(response => { localStorage.removeItem("token"); router.push("/"); })
				.then(response => {
					if (response.error) {
						if (response.error === "Unauthenticated") {
							localStorage.removeItem("token");
							router.push("/");
							this.$root.toast("Please log in! ✋");
						} else {
							this.$root.toast(response.error);
						}
					} else {
						if (this.$route.params.id) {
							this.$root.toast("Updated!");
						} else {
							this.$root.toast("Published!");
						}
						router.push("/read");
					}
				})
			},
			processEditOperation(operation) {
				this.body = operation.api.origElements.innerHTML;
			}
		}
	}
</script>

<style scoped>
	.medium-editor-element {
		outline: none;
	}
	.form-control.heading {
		font: inherit;
		color: inherit;
		padding: 0;
		outline: none;
		border: none;
		box-shadow: none;
		margin-bottom: 1rem;
		font-size: 135%;
	}
</style>