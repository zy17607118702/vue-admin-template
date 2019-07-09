// 控制高级查询区域外点击收缩
export default {
	mounted() {
		window.addEventListener('click', this.hideHighSearchContainer)
		let highSearchButtonNode = document.getElementById('high-search-button')
		if(highSearchButtonNode) {
			highSearchButtonNode.addEventListener('click', this.handleHighSearchButtonClick)
		}
		let highSearchContainerNode = document.getElementById('high-search-container')
		if(highSearchContainerNode) {
			highSearchContainerNode.addEventListener('click', event => event.stopPropagation())
		}
	},
	methods: {
		hideHighSearchContainer() {
			let node = document.getElementById('high-search-container')
			if(node && node.style.display != 'none') {
				node.style.display = 'none'
			}
		},
		handleHighSearchButtonClick(event) {
			event.stopPropagation()
			let node = document.getElementById('high-search-container')
			if(node.style.display != 'block') {
				node.style.display = 'block'
			} else {
				node.style.display = 'none'
			}
		}
	}
}