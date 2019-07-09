<template>
	<el-dialog :title="title" ref="dialogFrom" :visible.sync="dialogVisible" width="770px" :before-close="handleClose">
		<el-form class="form-panel-dialog" ref="dataForm" v-loading="formParams.loading" element-loading-text="数据加载中..." :model="dialogTemp" :rules="rules" :disabled="formParams.formDisabled" label-position="left" label-width="100px" size="mini">
			<div class="form-panel-item" v-for="(item, index) in tableColumns" :key="index" v-if='item.formShow'>
				<el-form-item :label="item.label" :prop="item.model" :rules="rules[item.rules]" :key="index">
					<!--远程搜索下拉框-->
					<el-select v-if="item.editType == 'remoteSelect'" v-model="dialogTemp[item.model]" filterable clearable remote :remote-method="item.remoteCb" :no-match-text="item.noSelectMatch ? item.noSelectMatch(item.label) : ''" :disabled="item.ifDisabled ? addOrUrdate : false" placeholder="请选择" @change="item.selectCb ? item.selectCb($event) : ''" size="mini">
						<el-option v-for="(option, index) in formOptions[item.optionsData]" :key="index" :label="item.optionsFormat ?  option.name : `${option.code}-${option.name}`" :value="option[item.valueType] ? option[item.valueType] : option.id " />
					</el-select>
					<!--远程搜索可以多选下拉框-->
					<el-select v-if="item.editType == 'remoteSelectMultiple'" multiple v-model="dialogTemp[item.model]" filterable clearable remote :remote-method="item.remoteCb" :no-match-text="item.noSelectMatch ? item.noSelectMatch(item.label) : ''" :disabled="item.ifDisabled ? addOrUrdate : false" placeholder="请选择" @change="item.selectCb ? item.selectCb($event) : ''" size="mini">
						<el-option v-for="(option, index) in formOptions[item.optionsData]" :key="index" :label="item.optionsFormat ?  option.name : `${option.code}-${option.name}`" :value="option[item.valueType] ? option[item.valueType] : option.id " />
					</el-select>
					<!--下拉框-->
					<el-select v-if="item.editType == 'select'" v-model="dialogTemp[item.model]" clearable :disabled="item.ifDisabled ? addOrUrdate : false" placeholder="请选择" :no-match-text="item.noSelectMatch ? item.noSelectMatch(item.label) : ''" @change="item.selectCb ? item.selectCb($event) : ''" size="mini">
						<el-option v-for="(option, index) in formOptions[item.optionsData]" :key="index" :label="item.optionsFormat ?  option.name : `${option.code}-${option.name}`" :value="option[item.valueType] ? option[item.valueType] : option.id " />
					</el-select>
					<!--只读输入框-->
					<el-input v-if="item.editType == 'disabledInput'" v-model.trim="dialogTemp[item.model]" :disabled="true" placeholder="请输入" size="mini" />
					<!--输入框-->
					<el-input v-if="item.editType == 'input'" class="transparentIcon" suffix-icon="el-icon-search" v-model.trim="dialogTemp[item.model]" :disabled="item.ifDisabled ? addOrUrdate : false" placeholder="请输入" size="mini" />
					<!--带单位输入框-->
					<el-input  v-if="item.editType == 'appendinput'" v-model.trim="dialogTemp[item.model]" :disabled="item.ifDisabled ? addOrUrdate : false" placeholder="请输入" size="mini">
						<template slot="append">{{item.append}}</template>
					</el-input>
					<!--日期选择框-->
					<el-date-picker v-if="item.editType == 'date'"  v-model="dialogTemp[item.model]" :disabled="item.ifDisabled ? addOrUrdate : false" type="datetime" value-format='yyyy-MM-dd HH:mm:ss' placeholder="选择日期"></el-date-picker>
					<!--日期选择框不带时分秒-->
					<el-date-picker v-if="item.editType == 'dateNoTime'" class="transparentIcon" @change="item.selectCb ? item.selectCb($event) : ''" suffix-icon="el-icon-search" v-model="dialogTemp[item.model]" :disabled="item.ifDisabled ? addOrUrdate : false" type="date" value-format='yyyy-MM-dd' placeholder="选择日期"></el-date-picker>
					<!--已作废 不要用-->
					<el-switch v-if="item.editType == 'switch'" v-model="dialogTemp[item.model]" :disabled="item.ifDisabled ? addOrUrdate : false" />
					<!--时间选择框-->
					<el-time-picker v-if="item.editType == 'timePicker'" v-model="dialogTemp[item.model]" :disabled="item.ifDisabled ? addOrUrdate : false" value-format="HH:mm:ss" clearable />
					<!--选择框-->
					<el-checkbox v-if="item.editType == 'checkbox'" :disabled="item.ifDisabled ? addOrUrdate : false" v-model="dialogTemp[item.model]">
						{{item.label}}
					</el-checkbox>
					<!--含有change事件的选择框-->
					<el-checkbox v-if="item.editType == 'checkboxChange'" :disabled="item.ifDisabled ? addOrUrdate : false" @change="item.selectCb" v-model="dialogTemp[item.model]">
						{{item.label}}
					</el-checkbox>
					<!--上传图片-->
				</el-form-item>
			</div>
		</el-form>

		<div slot="footer" class="dialog-footer" align="center">
			<el-button v-if="formParams.status === 'create'" type="primary" @click="createData">确定</el-button>
			<el-button v-else-if="formParams.status == 'update'" type="primary" @click="updateData">确定</el-button>
			<el-button @click="handleClose">关闭</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {Validate} from "@/utils/mohist"
	export default {
		name: "formDialog",
		props: {
			formParams: {
				default: {}
			},
			tableColumns: {
				type: Array,
				default: []
			},
			dialogTemp: {
				//绑定的对象值
				default: {}
			},
			api: {},
			formOptions: {
				default: {}
			},
			addOrUrdate: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				dialogVisible: true,
				rules: {
					selectRules: [{
						//选择必填校验
						required: true,
						message: "请选择",
						trigger: "submit"
					}],
					inputRules: [{
						//输入必填校验
						required: true,
						message: "",
						trigger: "submit"
					}],
					ge0: [{
						//整数大于0 校验
						required: true,
						validator: Validate.integer,
						min: 0,
						trigger: 'submit'
					}],
					ge0_r: [{
						//整数大于0 必填校验
						required: true,
						validator: Validate.integer,
						min: 0,
						trigger: 'submit'
					}],
					integer: [{
						//整数校验
						validator: Validate.integer,
						trigger: 'submit'
					}],
					integer_20: [{
						//整数 大于0 小于 20
						validator: Validate.integer,
						min: 0,
						max: 20,
						trigger: 'submit'
					}],
					integer_100_r: [{
						//整数 大于0 小于 100
						validator: Validate.integer,
						min: 0,
						required: true,
						max: 100,
						trigger: 'submit'
					}],
					integerPm_100_r: [{
						//整数 大于-100 小于 100
						validator: Validate.integer,
						min: -100,
						required: true,
						max: 100,
						trigger: 'submit'
					}],
					rangelength_4_r: [{
						//字符串长度区间 0~4
						validator: Validate.rangelength,
						required: true,
						min: 0,
						max: 4,
						trigger: 'submit'
					}],
					rangelength_4: [{
						//字符串长度区间 0~4
						validator: Validate.rangelength,
						min: 0,
						max: 4,
						trigger: 'submit'
					}],
					rangelength_20_r: [{
						//字符串长度区间 0~20
						validator: Validate.rangelength,
						required: true,
						min: 0,
						max: 20,
						trigger: 'submit'
					}],
					rangelength_100_r: [{
						//字符串长度区间 0~100
						validator: Validate.rangelength,
						required: true,
						min: 0,
						max: 100,
						trigger: 'submit'
					}],
					rangelength_100: [{
						//字符串长度区间 0~100
						validator: Validate.rangelength,
						min: 0,
						max: 100,
						trigger: 'submit'
					}],
					rangelength_200: [{
						//字符串长度区间 0~200
						validator: Validate.rangelength,
						min: 0,
						max: 200,
						trigger: 'submit'
					}],
				}
			}
		},
		computed: {
			title() {
				if(this.formParams) {
					if("update" == this.formParams.status) {
						return "编辑"
					} else if("create" == this.formParams.status) {
						return "创建"
					} else {
						return "查看详情"
					}
				} else {
					return "查看详情"
				}
			}
		},
		methods: {
			handleClose() {
				this.$emit("input", false);
				this.dialogVisible = false;
			},
			createData() {
				//创建数据
				this.$refs["dataForm"].validate(valid => {
					if(valid) {
						this.$emit('createDialogData', false)
					} else {
						return false;
					}
				});
			},
			updateData() {
				//更新数据
				this.$refs["dataForm"].validate(valid => {
					if(valid) {
						this.$emit('updateDialogData', false)
					} else {
						return false;
					}
				});
			}

		},
	}
</script>

<style lang="scss">
	.form-panel-dialog {
		display: flex;
		display: -webkit-flex;
		flex-wrap: wrap;
		align-items: center;
		.form-panel-item {
			width: 50%;
			padding: 0 8px;
			color: red;
			.transparentIcon {
				.el-icon-search {
					color: transparent;
				}
			}
			.el-form-item--mini.el-form-item {
				margin-bottom: 9px !important;
			}
			.el-select {
				width: 100%;
			}
			.el-form-item--mini .el-form-item__label {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.el-input__inner{
				width: 250px;
			}
		}
	}
</style>
