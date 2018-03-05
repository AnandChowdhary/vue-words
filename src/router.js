import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
import Home from "./Home.vue";
import Posts from "./Posts.vue";
import Write from "./Write.vue";
import Post from "./Post.vue";
import Error404 from "./Error404.vue";
const routes = [
	{
		path: "/",
		component: Home,
		meta: {
			title: "Words"
		}
	},
	{
		path: "/read",
		component: Posts,
		meta: {
			title: "Read / Words"
		}
	},
	{
		path: "/write/:id",
		component: Write,
		meta: {
			title: "Write / Words"
		}
	},
	{
		path: "/post/:id",
		component: Post,
		meta: {
			title: "Post / Words"
		}
	},
	{
		path: "/write",
		component: Write,
		meta: {
			title: "Write / Words"
		}
	},
	{
		path: "*",
		component: Error404,
		meta: {
			title: "404 Error / Words"
		}
	},
];
const router = new VueRouter({
	routes,
	mode: "history",
	scrollBehavior(to, from, savedPosition) {
		const position = savedPosition || {
			x: 0,
			y: 0
		}
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve({ x: 0, y: 0 });
			}, 200);
		})
	}
});
router.beforeEach((to, from, next) => {
	const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
	if (nearestWithTitle) document.title = nearestWithTitle.meta.title + (nearestWithTitle.meta.title.indexOf("Words") === -1 && " · Words" || "");
	const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
	const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
	Array.from(document.querySelectorAll("[data-routerMetas]")).map(el => el.parentNode.removeChild(el));
	if(!nearestWithMeta) return next();
	nearestWithMeta.meta.metaTags.map(tagDef => {
		const tag = document.createElement("meta");
		Object.keys(tagDef).forEach(key => {
			tag.setAttribute(key, tagDef[key]);
		});
		tag.setAttribute("data-routerMetas", "");
		return tag;
	}).forEach(tag => document.head.appendChild(tag));
	next();
});

export default router;