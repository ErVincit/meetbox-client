<template>
  <nav
    class="navbar col-auto flex-column align-items-center justify-content-start h-100 d-none d-lg-flex flex-nowrap pb-3"
    :class="{ 'd-flex position-absolute mobile-opened': open }"
    style="max-width: 300px"
  >
    <NeuContainer class="w-100" disableHover>
      <ul class="navbar-nav">
        <router-link
          :to="{
            name: 'drive',
            params: { workgroupId: $route.params.workgroupId }
          }"
        >
          <li
            class="my-2 px-2 d-flex align-items-center"
            v-tooltip:right="'Documenti'"
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="25" cy="25" r="24.5" stroke="#787878" />
              <path
                d="M17.5 12.5C16.125 12.5 15.0125 13.625 15.0125 15L15 35C15 36.375 16.1125 37.5 17.4875 37.5H32.5C33.875 37.5 35 36.375 35 35V20L27.5 12.5H17.5ZM26.25 21.25V14.375L33.125 21.25H26.25Z"
                fill="#787878"
              />
            </svg>
            <span v-if="!compressed" class="px-2">Documenti</span>
          </li>
        </router-link>
        <router-link
          :to="{
            name: 'activity',
            params: $route.params
          }"
        >
          <li
            class="my-2 px-2 d-flex align-items-center"
            v-tooltip:right="'Attività'"
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="25" cy="25" r="24.5" stroke="#787878" />
              <path
                d="M33.8639 27.625H15.1322C14.2704 27.625 13.5346 27.3198 12.9249 26.7095C12.3151 26.0991 12.0103 25.3626 12.0103 24.5C12.0103 23.6374 12.3151 22.9009 12.9249 22.2905C13.5346 21.6802 14.2704 21.375 15.1322 21.375H33.8639C34.7257 21.375 35.4615 21.6802 36.0712 22.2905C36.681 22.9009 36.9859 23.6374 36.9859 24.5C36.9859 25.3626 36.681 26.0991 36.0712 26.7095C35.4615 27.3198 34.7257 27.625 33.8639 27.625ZM33.8639 22.9375H22.1566C21.9452 22.9375 21.7623 23.0148 21.6078 23.1694C21.4533 23.3241 21.3761 23.5072 21.3761 23.7188V25.2812C21.3761 25.4928 21.4533 25.6759 21.6078 25.8306C21.7623 25.9852 21.9452 26.0625 22.1566 26.0625H33.8639C34.2867 26.0625 34.6525 25.9119 34.9615 25.6108C35.2704 25.3097 35.4249 24.9435 35.4249 24.5122C35.4249 24.0809 35.2704 23.7106 34.9615 23.4014C34.6525 23.0921 34.2867 22.9375 33.8639 22.9375ZM33.8639 18.25H15.1322C14.2704 18.25 13.5346 17.9448 12.9249 17.3345C12.3151 16.7241 12.0103 15.9876 12.0103 15.125C12.0103 14.2624 12.3151 13.5259 12.9249 12.9155C13.5346 12.3052 14.2704 12 15.1322 12H33.8639C34.7257 12 35.4615 12.3052 36.0712 12.9155C36.681 13.5259 36.9859 14.2624 36.9859 15.125C36.9859 15.9876 36.681 16.7241 36.0712 17.3345C35.4615 17.9448 34.7257 18.25 33.8639 18.25ZM33.8639 13.5625H31.5224C31.3111 13.5625 31.1281 13.6398 30.9737 13.7944C30.8192 13.9491 30.742 14.1322 30.742 14.3438V15.9062C30.742 16.1341 30.8192 16.3213 30.9737 16.4678C31.1281 16.6143 31.3111 16.6875 31.5224 16.6875H33.8639C34.2867 16.6875 34.6525 16.5369 34.9615 16.2358C35.2704 15.9347 35.4249 15.5685 35.4249 15.1372C35.4249 14.7059 35.2704 14.3356 34.9615 14.0264C34.6525 13.7171 34.2867 13.5625 33.8639 13.5625ZM15.1322 30.75H33.8639C34.7257 30.75 35.4615 31.0552 36.0712 31.6655C36.681 32.2759 36.9859 33.0124 36.9859 33.875C36.9859 34.7376 36.681 35.4741 36.0712 36.0845C35.4615 36.6948 34.7257 37 33.8639 37H15.1322C14.2704 37 13.5346 36.6948 12.9249 36.0845C12.3151 35.4741 12.0103 34.7376 12.0103 33.875C12.0103 33.0124 12.3151 32.2759 12.9249 31.6655C13.5346 31.0552 14.2704 30.75 15.1322 30.75ZM26.059 34.6562C26.059 34.8678 26.1363 35.0509 26.2907 35.2056C26.4452 35.3602 26.6281 35.4375 26.8395 35.4375H33.8639C34.2867 35.4375 34.6525 35.2869 34.9615 34.9858C35.2704 34.6847 35.4249 34.3185 35.4249 33.8872C35.4249 33.4559 35.2704 33.0856 34.9615 32.7764C34.6525 32.4671 34.2867 32.3125 33.8639 32.3125H26.8395C26.6281 32.3125 26.4452 32.3898 26.2907 32.5444C26.1363 32.6991 26.059 32.8822 26.059 33.0938V34.6562Z"
                fill="#787878"
              />
            </svg>
            <span v-if="!compressed" class="px-2">Attività</span>
          </li>
        </router-link>
        <router-link
          :to="{
            name: 'calendar',
            params: $route.params
          }"
        >
          <li
            class="my-2 px-2 d-flex align-items-center"
            v-tooltip:right="'Calendario'"
          >
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="25" cy="25" r="24.5" stroke="#787878" />
              <path
                d="M12 15.125C12 14.2962 12.3292 13.5013 12.9153 12.9153C13.5013 12.3292 14.2962 12 15.125 12H33.875C34.7038 12 35.4987 12.3292 36.0847 12.9153C36.6708 13.5013 37 14.2962 37 15.125H12Z"
                fill="#787878"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 16.6875H37V33.875C37 34.7038 36.6708 35.4987 36.0847 36.0847C35.4987 36.6708 34.7038 37 33.875 37H15.125C14.2962 37 13.5013 36.6708 12.9153 36.0847C12.3292 35.4987 12 34.7038 12 33.875V16.6875ZM22.1562 22.9375C22.5707 22.9375 22.9681 22.7729 23.2611 22.4799C23.5541 22.1868 23.7188 21.7894 23.7188 21.375C23.7188 20.9606 23.5541 20.5632 23.2611 20.2701C22.9681 19.9771 22.5707 19.8125 22.1562 19.8125C21.7418 19.8125 21.3444 19.9771 21.0514 20.2701C20.7584 20.5632 20.5938 20.9606 20.5938 21.375C20.5938 21.7894 20.7584 22.1868 21.0514 22.4799C21.3444 22.7729 21.7418 22.9375 22.1562 22.9375ZM28.4062 21.375C28.4062 21.7894 28.2416 22.1868 27.9486 22.4799C27.6556 22.7729 27.2582 22.9375 26.8438 22.9375C26.4293 22.9375 26.0319 22.7729 25.7389 22.4799C25.4459 22.1868 25.2812 21.7894 25.2812 21.375C25.2812 20.9606 25.4459 20.5632 25.7389 20.2701C26.0319 19.9771 26.4293 19.8125 26.8438 19.8125C27.2582 19.8125 27.6556 19.9771 27.9486 20.2701C28.2416 20.5632 28.4062 20.9606 28.4062 21.375ZM31.5312 22.9375C31.9457 22.9375 32.3431 22.7729 32.6361 22.4799C32.9291 22.1868 33.0938 21.7894 33.0938 21.375C33.0938 20.9606 32.9291 20.5632 32.6361 20.2701C32.3431 19.9771 31.9457 19.8125 31.5312 19.8125C31.1168 19.8125 30.7194 19.9771 30.4264 20.2701C30.1334 20.5632 29.9688 20.9606 29.9688 21.375C29.9688 21.7894 30.1334 22.1868 30.4264 22.4799C30.7194 22.7729 31.1168 22.9375 31.5312 22.9375ZM19.0312 26.0625C19.0312 26.4769 18.8666 26.8743 18.5736 27.1674C18.2806 27.4604 17.8832 27.625 17.4688 27.625C17.0543 27.625 16.6569 27.4604 16.3639 27.1674C16.0709 26.8743 15.9062 26.4769 15.9062 26.0625C15.9062 25.6481 16.0709 25.2507 16.3639 24.9576C16.6569 24.6646 17.0543 24.5 17.4688 24.5C17.8832 24.5 18.2806 24.6646 18.5736 24.9576C18.8666 25.2507 19.0312 25.6481 19.0312 26.0625ZM22.1562 27.625C22.5707 27.625 22.9681 27.4604 23.2611 27.1674C23.5541 26.8743 23.7188 26.4769 23.7188 26.0625C23.7188 25.6481 23.5541 25.2507 23.2611 24.9576C22.9681 24.6646 22.5707 24.5 22.1562 24.5C21.7418 24.5 21.3444 24.6646 21.0514 24.9576C20.7584 25.2507 20.5938 25.6481 20.5938 26.0625C20.5938 26.4769 20.7584 26.8743 21.0514 27.1674C21.3444 27.4604 21.7418 27.625 22.1562 27.625ZM28.4062 26.0625C28.4062 26.4769 28.2416 26.8743 27.9486 27.1674C27.6556 27.4604 27.2582 27.625 26.8438 27.625C26.4293 27.625 26.0319 27.4604 25.7389 27.1674C25.4459 26.8743 25.2812 26.4769 25.2812 26.0625C25.2812 25.6481 25.4459 25.2507 25.7389 24.9576C26.0319 24.6646 26.4293 24.5 26.8438 24.5C27.2582 24.5 27.6556 24.6646 27.9486 24.9576C28.2416 25.2507 28.4062 25.6481 28.4062 26.0625ZM31.5312 27.625C31.9457 27.625 32.3431 27.4604 32.6361 27.1674C32.9291 26.8743 33.0938 26.4769 33.0938 26.0625C33.0938 25.6481 32.9291 25.2507 32.6361 24.9576C32.3431 24.6646 31.9457 24.5 31.5312 24.5C31.1168 24.5 30.7194 24.6646 30.4264 24.9576C30.1334 25.2507 29.9688 25.6481 29.9688 26.0625C29.9688 26.4769 30.1334 26.8743 30.4264 27.1674C30.7194 27.4604 31.1168 27.625 31.5312 27.625ZM19.0312 30.75C19.0312 31.1644 18.8666 31.5618 18.5736 31.8549C18.2806 32.1479 17.8832 32.3125 17.4688 32.3125C17.0543 32.3125 16.6569 32.1479 16.3639 31.8549C16.0709 31.5618 15.9062 31.1644 15.9062 30.75C15.9062 30.3356 16.0709 29.9382 16.3639 29.6451C16.6569 29.3521 17.0543 29.1875 17.4688 29.1875C17.8832 29.1875 18.2806 29.3521 18.5736 29.6451C18.8666 29.9382 19.0312 30.3356 19.0312 30.75ZM22.1562 32.3125C22.5707 32.3125 22.9681 32.1479 23.2611 31.8549C23.5541 31.5618 23.7188 31.1644 23.7188 30.75C23.7188 30.3356 23.5541 29.9382 23.2611 29.6451C22.9681 29.3521 22.5707 29.1875 22.1562 29.1875C21.7418 29.1875 21.3444 29.3521 21.0514 29.6451C20.7584 29.9382 20.5938 30.3356 20.5938 30.75C20.5938 31.1644 20.7584 31.5618 21.0514 31.8549C21.3444 32.1479 21.7418 32.3125 22.1562 32.3125ZM28.4062 30.75C28.4062 31.1644 28.2416 31.5618 27.9486 31.8549C27.6556 32.1479 27.2582 32.3125 26.8438 32.3125C26.4293 32.3125 26.0319 32.1479 25.7389 31.8549C25.4459 31.5618 25.2812 31.1644 25.2812 30.75C25.2812 30.3356 25.4459 29.9382 25.7389 29.6451C26.0319 29.3521 26.4293 29.1875 26.8438 29.1875C27.2582 29.1875 27.6556 29.3521 27.9486 29.6451C28.2416 29.9382 28.4062 30.3356 28.4062 30.75Z"
                fill="#787878"
              /></svg
            ><span v-if="!compressed" class="px-2">Calendario</span>
          </li>
        </router-link>
      </ul>
    </NeuContainer>

    <NeuContainer
      class="mt-3 w-100"
      style="overflow-y: auto; overflow-x: hidden"
      disableHover
    >
      <ul class="navbar-nav w-100">
        <li v-if="!workgroups"><Loading show hideMessage /></li>
        <li
          class="mt-2 px-2 d-flex align-items-center workgroup"
          v-else
          :class="{ selected: currentWorkgroup.id === workgroup.id }"
          v-for="workgroup in workgroups"
          :key="workgroup.id"
          v-tooltip:right="workgroup.name"
          @click="
            $router.push({
              name: 'drive',
              params: { workgroupId: workgroup.id }
            })
          "
        >
          <img class="rounded-circle" :src="workgroup.image" />
          <span v-if="!compressed" class="px-2 text-truncate">{{
            workgroup.name
          }}</span>
        </li>
        <li
          class="my-2 px-2 d-flex align-items-center add-workgroup"
          @click="addingWorkgroup = true"
          style="position: relative"
        >
          <div class="w-100" v-tooltip:right="'Crea nuovo'">
            <svg
              width="50"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="25"
                cy="25"
                r="24"
                stroke="#787878"
                stroke-width="2"
                stroke-dasharray="5 5"
              />
              <path
                d="M25 15V24.75M25 34.5V24.75M25 24.75H15H34.5"
                stroke="#787878"
                stroke-width="2"
              />
            </svg>
            <span v-if="!compressed" class="px-2">Crea nuovo</span>
          </div>
          <NewWorkgroup
            v-if="addingWorkgroup"
            class="p-2"
            @exit="addingWorkgroup = false"
          />
        </li>
      </ul>
    </NeuContainer>

    <NeuButton
      class="mt-3 p-2 w-100 expand-btn"
      style="height: auto"
      @click="toggleExpand"
      v-tooltip:right="compressed ? 'Espandi' : 'Comprimi'"
    >
      <svg
        style="padding: 5px"
        :class="{ rotate: compressed }"
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M37.667 41H41L41 7.67H37.667L37.667 22.6685L14.0527 22.6685L23.2184 13.5027L20.8687 11.1363L7.67 24.335L20.8687 37.5337L23.2184 35.1672L14.0527 26.0015L37.667 26.0015V41Z"
          fill="#787878"
        />
      </svg>

      <span v-if="!compressed" class="mx-3" style="font-size: 16px">
        Comprimi
      </span>
    </NeuButton>
  </nav>
</template>

<script>
import NeuContainer from "@/components/neu-button/NeuContainer";
import NeuButton from "@/components/neu-button/NeuButton";
import NewWorkgroup from "./NewWorkgroup";
import Loading from "@/components/loading/Loading";

import { mapActions, mapGetters } from "vuex";

export default {
  name: "LeftNavBar",
  props: { open: { type: Boolean, default: false } },
  components: { NeuContainer, NeuButton, NewWorkgroup, Loading },
  methods: {
    ...mapActions(["fetchWorkgroups"]),
    toggleExpand() {
      this.compressed = !this.compressed;
      this.$emit("expand-change");
      localStorage.setItem("navbar-compressed", this.compressed);
    },
    redirect() {
      if (this.workgroups.length === 0) this.$router.push("/tutorial");
      else this.$router.push("/" + this.workgroups[0].id + "/drive");
    }
  },
  computed: {
    ...mapGetters(["workgroups"]),
    currentWorkgroup() {
      const { workgroupId } = this.$route.params;
      if (this.workgroups) {
        const workgroup = this.workgroups.find(
          wg => wg.id === parseInt(workgroupId)
        );
        if (workgroup) return workgroup;
        else this.redirect();
      }
      return null;
    }
  },
  mounted() {
    this.fetchWorkgroups();
  },
  data() {
    const storeValue = localStorage.getItem("navbar-compressed");
    return {
      compressed: storeValue ? storeValue === "true" : false,
      addingWorkgroup: false
    };
  }
};
</script>

<style>
.mobile-opened {
  z-index: 1000;
}

.tooltip {
  position: fixed;
}

.navbar {
  transition: all 500ms;
}
.navbar a {
  text-decoration: none;
  color: var(--text-color-bg);
}
.navbar-nav li {
  border-radius: 10px;
  cursor: pointer;
}
.navbar-nav li span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.navbar a.router-link-exact-active li,
.navbar-nav li:hover {
  color: var(--primary);
}
.navbar a.router-link-exact-active svg circle,
.navbar-nav li:hover svg circle {
  fill: var(--primary);
  stroke: var(--text-color-primary);
}
.navbar a.router-link-exact-active path,
.navbar-nav li:hover svg path {
  fill: var(--text-color-primary);
}

.workgroup {
  height: 60px;
  border-radius: 10px;
}
.workgroup img {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
.workgroup.selected,
.workgroup:hover {
  background-color: var(--primary);
  color: var(--text-color-primary) !important;
}

.expand-btn button {
  text-align: left;
}
.expand-btn button:hover {
  color: var(--primary);
}
.expand-btn .rotate {
  transform: rotate(180deg);
}

.add-workgroup:hover svg circle {
  fill: none !important;
  stroke: var(--primary) !important;
}
.add-workgroup:hover svg path {
  stroke: var(--primary) !important;
}
</style>
