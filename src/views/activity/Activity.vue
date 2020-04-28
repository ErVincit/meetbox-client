<template>
	<div class="activity container-fluid h-100 d-flex flex-column">
		<PageHeader />
		<div id="page-content" class="row flex-grow-1">
			<Recents />
			<main class="col col-lg-9">
				<p class="m-0">Attività</p>
				<hr class="mt-0 mb-2" />
				<Section />
			</main>
			<div class="col col-lg-1 d-none d-lg-block" style="background-color: red"></div>
		</div>
	</div>
</template>

<script>
import PageHeader from "@/components/page-header/PageHeader";
import Recents from "@/components/recents/Recents";

export default {
	name: "Activity",
	components: { PageHeader, Recents },
	created() {
		const { workgroupId } = this.$route.params;
		const url = `http://localhost:8080/api/workgroup/${workgroupId}/activity/section`;
		console.log(url);
		fetch(url).then(value => {
			console.log(value);
		});
	}
};
</script>

<style></style>
