<template>
	<section class="app-main">
		<transition name="fade" mode="out-in">
			<keep-alive :include="cachedViews">
				<router-view :key="key" />
			</keep-alive>
		</transition>
	</section>
</template>

<script>
	export default {
		name: 'AppMain',
		computed: {
			cachedViews() {
				return this.$store.state.tagsView.cachedViews
			},
			key() {
				return this.$route.fullPath
			}
		}
	}
</script>

<style scoped>
	.app-main {
		/*84 = navbar + tags-view = 50 +34 */
		height: calc(100% - 34px);
		position: relative;
		overflow: hidden;
	}
</style>