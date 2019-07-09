<template>
	<div class="transfer-panel">
		<div class="transfer-block">
			<div class="transfer-block-head">
				未选
			</div>
			<ul class="transfer-block-body">
				<li v-for="(item, index) in noSelectData" :key="index" @click="handleNoSelectItme(item, index)">
					{{item.code}} - {{item.label}}
				</li>
			</ul>
		</div>
		<div class="transfer-center">
			<div @click="allRight">全部右移<i class="el-icon-arrow-right el-icon--right" /></div>
			<div @click="allLeft"><i class="el-icon-arrow-left el-icon--right" />全部左移</div>
		</div>
		<div class="transfer-block">
			<div class="transfer-block-head">
				已选
			</div>
			<ul class="transfer-block-body">
				<li v-for="(item, index) in transferRight" :key="index" @click="handleSelectedItme(item, index)">
					{{item.code}} - {{item.label}}
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default {
		name: "transfer",
		props:{
			transferData: {
				type: Array,
				default: []
			},
			transferVal: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				transferLeft: JSON.parse(JSON.stringify(this.transferData)),
				transferRight: JSON.parse(JSON.stringify(this.transferVal)),
			}
		},
		watch: {
			transferData(){
				this.transferLeft = JSON.parse(JSON.stringify(this.transferData))
			},
			
			transferVal(){
				this.transferRight = JSON.parse(JSON.stringify(this.transferVal))
				
			}
		},
		computed: {
			noSelectData(){
				this.transferRight.forEach(item => {
					let ind = this.transferLeft.findIndex(column => column.id === item.id )
					if(ind > -1){
						this.transferLeft.splice(ind, 1)
					}
				})
				return this.transferLeft
			}
		},
		methods: {
			handleNoSelectItme(item, index) {
				//未选区域点击事件 将数据添加到右侧
				this.transferLeft.splice(index, 1)
				this.transferRight.push(item)
				this.syncTransfer()
			},
			handleSelectedItme(item, index) {
				//已选区域点击事件 将数据添加到左侧
				this.transferRight.splice(index, 1)
				this.transferLeft.push(item)
				this.syncTransfer()
			},
			allRight(){
				//全部右移
				this.transferLeft.forEach(item => {
					this.transferRight.push(item)
				})
				this.transferLeft = []
				this.syncTransfer()
			},
			allLeft(){
				//全部左移
				this.transferRight.forEach(item => {
					this.transferLeft.push(item)
				})
				this.transferRight = []
				this.syncTransfer()
			},
			syncTransfer(){
				this.$emit('syncTransfer', this.transferLeft, this.transferRight);
			}
		},
		created(){
		}
	}
</script>

<style lang="scss" scoped>
	.transfer-panel {
		width: 80%;
		min-width: 600px;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		&>div {
			height: 300px;
		}
		.transfer-block {
			border: 1px solid #ddd;
			width: 35%;
			min-width: 200px;
			height: 100%;
			.transfer-block-head {
				height: 40px;
				line-height: 40px;
				background: #f5f7fa;
				margin: 0;
				border-bottom: 1px solid #ebeef5;
				box-sizing: border-box;
				color: #000;
				text-align: center;
			}
			.transfer-block-body {
				list-style: none;
				width: 100%;
				box-sizing: border-box;
				padding: 0;
				height: 260px;
				overflow-x: hidden;
				overflow-y: auto;
				
				li {
					cursor: pointer;
					height: 30px;
					width: 100%;
					line-height: 30px;
					box-sizing: border-box;
					padding-left: 15px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
		.transfer-center {
			width: 130px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			div {
				line-height: 1;
				white-space: nowrap;
				cursor: pointer;
				background: #fff;
				border: 1px solid #dcdfe6;
				color: #606266;
				-webkit-appearance: none;
				text-align: center;
				box-sizing: border-box;
				outline: none;
				margin: 10px;
				transition: .1s;
				padding: 12px 20px;
				font-size: 14px;
				border-radius: 4px;
			}
		}
	}
</style>