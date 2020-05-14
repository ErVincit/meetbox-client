import Vue from "vue";
import VueRouter from "vue-router";

import Homepage from "@/views/homepage/Homepage";
import Login from "@/views/login/Login";
import Signup from "@/views/signup/Signup";
import Activity from "@/views/activity/Activity";
import Calendar from "@/views/calendar/Calendar";
import Drive from "@/views/drive/Drive";
import NotFound from "@/views/not-found/NotFound";
import Tutorial from "@/views/tutorial/Tutorial";

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
    path: "/tutorial",
    name: "tutorial",
    component: Tutorial
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
  },
  {
    path: "/:workgroupId/drive*",
    name: "drive-subfolder",
    component: Drive
  },
  { path: "*", name: "notfound", component: NotFound }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
