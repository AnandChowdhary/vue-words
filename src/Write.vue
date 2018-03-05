<template>
	<div>
		<Nav />
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/medium-editor/latest/css/medium-editor.min.css">
		<b-form @submit.prevent="publish">
			<b-form-group label="Title">
				<b-form-input type="text" v-model="title" v-bind:disabled="!show" placeholder="Enter the title for these words..." autofocus />
			</b-form-group>
			<medium-editor :text="body" v-on:edit="processEditOperation" custom-tag="div" />
			<b-button type="submit" variant="primary">
				<span v-if="show">Publish</span>
				<span v-else>Publishing...</span>
				<i class="fas fa-arrow-right ml-2"></i>
			</b-button>
		</b-form>
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
				if (this.$route.params.id) {
					fetchURL += "post/" + this.$route.params.id;
				} else {
					fetchURL += "posts";
				}
				fetch(fetchURL, {
					method: "PUT",
					body: JSON.stringify({
						title: this.title,
						body: this.body
					}),
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
						this.$root.toast("Updated!");
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