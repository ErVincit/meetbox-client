import Vue from "vue";
import VueRouter from "vue-router";

import Homepage from "../views/homepage/Homepage";
import Login from "@/views/login/Login";
import Signup from "@/views/signup/Signup";
import Activity from "@/views/activity/Activity";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Homepage",
		component: Homepage
	},
	{
		path: "/login",
		name: "Login",
		component: Login
	},
	{
		path: "/signup",
		name: "Signup",
		component: Signup
	},
	{
		path: "/:workgroupId/activity",
		component: Activity
	}
];

const router = new VueRouter({
	routes
});

export default router;
