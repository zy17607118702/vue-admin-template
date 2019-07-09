<template>
	<!--
      Author：Mohist.Yang
      Time：2019-02-28
      Describe：接收表格详细详细数据，返回表格修改后的数据
    -->
	<div class="form-panel">
		<div class="form-panel-item" v-for="(item, index) in tableColumns" :key="index" v-if='item.formShow'>

			<el-form-item :label="item.label" :title="item.label" :prop="item.model" :rules="rules[item.rules]" :key="index">
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
				<!--日期选择框-->
				<el-date-picker v-if="item.editType == 'date'" v-model="dialogTemp[item.model]" :disabled="item.ifDisabled ? addOrUrdate : false" type="datetime" value-format='yyyy-MM-dd HH:mm:ss' placeholder="选择日期"></el-date-picker>
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
			</el-form-item>
		</div>
	</div>
</template>

<script>
	import {Validate} from "@/utils/mohist"
	export default {
		name: "formPanel",
		props: {
			dialogTemp: {
				//绑定的对象值
				default: {}
			},
			tableColumns: {
				//遍历生成表单
				type: Array,
				default: []
			},
			api: {},
			formOptions: {
				default: {}
			},
			addOrUrdate: {
				type: Boolean,
				default: false
			},
			formMethod: {}
		},
		data() {
			return {
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
					integer_r: [{
						//整数校验
						required: true,
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
		watch: {
			addOrUrdate(val) {}
		},
		methods: {},
		mounted() {
		}
	};
</script>

<style lang="scss">
	.form-panel {
		display: flex;
		display: -webkit-flex;
		flex-wrap: wrap;
		align-items: center;
		.form-panel-item {
			width: 100%;
			padding: 0 8px;
			color: red;
			.transparentIcon {
				.el-icon-search {
					color: transparent;
				}
			}
			.el-form-item--mini.el-form-item {
				margin-bottom: 9px;
			}
			.el-form-item__error {
				top: 0;
				right: 0 !important;
				font-size: 0;
			}
			.el-form-item--mini .el-form-item__label {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
</style>
