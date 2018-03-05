import Vue from "vue";
import router from "./router";
import Toasted from "vue-toasted";
import "whatwg-fetch";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import css from "./styles.scss";
import BootstrapVue from "bootstrap-vue";
Vue.use(Toasted);
Vue.use(BootstrapVue);

// Progressive Web App support
if (process.env.NODE_ENV === "production") {
	require("./pwa");
}

// App
const app = new Vue({
	el: "#app",
	data: {
		user: null
	},
	router,
	mounted() {
		
	},
	methods: {
		updateAuth(user) {
			this.user = user;
		},
		logout() {
			
		},
		toast(text) {
			this.$toasted.show(text, {
				theme: "primary",
				position: "top-center",
				duration: 3000
			});
		}
	},
	render() {
		return <div>
			<transition name="fade" mode="out-in">
				<router-view />
			</transition>
		</div>
	}
});