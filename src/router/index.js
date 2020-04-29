import Vue from "vue";
import VueRouter from "vue-router";

import Homepage from "../views/homepage/Homepage";
import Login from "@/views/login/Login";
import Signup from "@/views/signup/Signup";
import Activity from "@/views/activity/Activity";
import Calendar from "@/views/calendar/Calendar";
import Drive from "@/views/drive/Drive";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Homepage
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup
  },
  {
    path: "/:workgroupId/activity",
    name: "activity",
    component: Activity
  },
  {
    path: "/:workgroupId/calendar",
    name: "calendar",
    component: Calendar
  },
  {
    path: "/:workgroupId/drive",
    name: "drive",
    component: Drive
  }
];

const router = new VueRouter({
  routes
});

export default router;
