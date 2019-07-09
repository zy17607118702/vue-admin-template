/*
 * 工具
 */
export const Util = {
	SubStr(str, len) {
		//截取日期前10位
		if(str) {
			return len ? String(str).substring(0, len) : String(str).substring(0, 10);
		} else {
			return str;
		}
	},

	GetMonth(value) {
		if(value) {
			var that = this;
			var firstDate = new Date(value); //第一天
			firstDate.setDate(1);
			var endDate = new Date(firstDate); //最后一天
			endDate.setMonth(firstDate.getMonth() + 1);
			endDate.setDate(0);
			return [that.DateFormat(firstDate, "yyyy-MM-dd 00:00:00"), that.DateFormat(endDate, "yyyy-MM-dd 23:59:59")]
		} else {
			return [];
		}
	},

	DateFormat(value, fmt) {
		//整理日期格式
		var theDate = new Date(value);
		if(theDate && theDate != 'Invalid Date') {
			var o = {
				"M+": theDate.getMonth() + 1, //月份
				"d+": theDate.getDate(), //日
				"h+": theDate.getHours(), //小时
				"m+": theDate.getMinutes(), //分
				"s+": theDate.getSeconds(), //秒
				"q+": Math.floor((theDate.getMonth() + 3) / 3), //季度
				"S": theDate.getMilliseconds() //毫秒
			};
			if(/(y+)/.test(fmt))
				fmt = fmt.replace(RegExp.$1, (theDate.getFullYear() + "").substr(4 - RegExp.$1.length));
			for(var k in o)
				if(new RegExp("(" + k + ")").test(fmt))
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		} else {
			return null;
		}
	},

	SubStrHour(str) {
		//截取日期时分
		if(str) {
			return String(str).substring(11, 16);
		} else {
			return "";
		}
	}
}

/*
 * 验证
 */
import { Message } from 'element-ui'
export const Validate = {
	rangelength(rule, value, callback) {
		//设置一个长度范围[min,max]
		if(value) {
			if(Number.isInteger(Number(rule.min)) && Number.isInteger(Number(rule.max))) {
				//如果最大值和最小值同时存在
				if(String(value).length >= rule.min && String(value).length <= rule.max) {
					return callback();
				} else {
					Message({
						message: rule.message ? rule.message : `值的长度范围只能是[${rule.min}~${rule.max}]`,
						type: "warning"
					});
					return callback(new Error(rule.message ? rule.message : `值的长度范围只能是[${rule.min}~${rule.max}]`));
				}
			} else if(Number.isInteger(Number(rule.min))) {
				//如果只存在最小值
				if(String(value).length >= rule.min) {
					return callback();
				} else {
					Message({
						message: rule.message ? rule.message : `值的长度不能小于${rule.min}`,
						type: "warning"
					});
					return callback(new Error(rule.message ? rule.message : `值的长度不能小于${rule.min}`));
				}
			} else if(Number.isInteger(Number(rule.max))) {
				//如果只存在最大值
				if(String(value).length <= rule.max) {
					return callback();
				} else {
					Message({
						message: rule.message ? rule.message : `值的长度不能大于${rule.max}`,
						type: "warning"
					});
					return callback(new Error(rule.message ? rule.message : `值的长度不能大于${rule.max}`));
				}
			} else {
				callback();
			}
		} else {
			if(rule.required) {
				return callback(new Error("请输入"));
			} else {
				return callback();
			}
		}
	},
	email(rule, value, callback) {
		//验证电子邮箱格式
	},
	range(rule, value, callback) {
		//设置值的大小范围
		if(value) {
			if(value >= rule.min && value <= rule.max) {
				callback();
			} else {
				Message({
					message: rule.message ? rule.message : `值的范围只能是[${rule.min}~${rule.max}]`,
					type: "warning"
				});
				return callback(new Error(rule.message ? rule.message : `值的范围只能是[${rule.min}~${rule.max}]`));
			}
		} else {
			if(rule.required) {
				return callback(new Error("请输入"));
			} else {
				return callback();
			}
		}
	},
	integer(rule, value, callback) {
		//验证整数
		if(Number.isInteger(Number(value))) {
			if(Number.isInteger(Number(rule.min)) && Number.isInteger(Number(rule.max))) {
				//如果最大值和最小值同时存在
				if(Number(value) >= Number(rule.min) && Number(value) <= Number(rule.max)) {
					return callback();
				} else {
					Message({
						message: rule.message ? rule.message : `整数的范围只能是[${rule.min}~${rule.max}]`,
						type: "warning"
					});
					return callback(new Error(rule.message ? rule.message : `整数的范围只能是[${rule.min}~${rule.max}]`));
				}
			} else if(Number.isInteger(Number(rule.min))) {
				//如果只存在最小值
				if(Number(value) >= Number(rule.min)) {
					return callback();
				} else {
					Message({
						message: rule.message ? rule.message : `整数不能小于${rule.min}`,
						type: "warning"
					});
					return callback(new Error(rule.message ? rule.message : `整数不能小于${rule.min}`));
				}
			} else if(Number.isInteger(Number(rule.max))) {
				//如果只存在最大值
				if(Number(value) <= Number(rule.max)) {
					return callback();
				} else {
					Message({
						message: rule.message ? rule.message : `整数不能大于${rule.max}`,
						type: "warning"
					});
					return callback(new Error(rule.message ? rule.message : `整数不能大于${rule.max}`));
				}
			} else {
				callback();
			}
		} else {
			if(rule.required) {
				Message({
					message: rule.message ? rule.message : `只能输入整数`,
					type: "warning"
				});
				return callback(new Error(rule.message ? rule.message : `只能输入整数`));
			} else {
				return callback();
			}
		}

	},
	minlength(rule, value, callback) {
		//设置最小长度
		// console.log(rule, value.length)
	},
	maxlength(rule, value, callback) {
		//设置最大长度
	},
	url(rule, value, callback) {
		//验证URL格式
	},
	date(rule, value, callback) {
		//验证日期格式（类似30/30/2008的格式，不验证日期准确性只验证格式）
	},
	dateISO(rule, value, callback) {
		//验证ISO类型的日期格式
	},
	dateDE(rule, value, callback) {
		//验证德式的日期格式（29041994或112006）
	},
	number(rule, value, callback) {
		//验证十进制数字（包括小数的）
	},
	creditcard(rule, value, callback) {
		//验证信用卡号
	},
	accept(rule, value, callback) {
		//验证相同后缀名的字符串
	},
	equalTo(rule, value, callback) {
		//验证两个输入框的内容是否相同
	},
	phoneUS(rule, value, callback) {
		//验证美式的电话号码
	},
}
/*
 * LocalStorage 操作封装
 */
export const LocalStorage = {
	SetLocalStorage(key, value) {
		//设置本地存储
		var curtime = new Date().getTime(); // 获取当前时间 ，转换成JSON字符串序列
		var valueDate = JSON.stringify({
			val: value,
			timer: curtime
		});
		try {
			localStorage.setItem(key, valueDate);
			return true;
		} catch(e) {
			// 兼容性写法
			function isQuotaExceeded(e) {
				var quotaExceeded = false;
				if(e) {
					if(e.code) {
						switch(e.code) {
							case 22:
								quotaExceeded = true;
								break;
							case 1014: // Firefox
								if(e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
									quotaExceeded = true;
								}
								break;
						}
					} else if(e.number === -2147024882) { // IE8
						quotaExceeded = true;
					}
				}
				return quotaExceeded;
			}

			if(isQuotaExceeded(e)) {
				console.log("Error: 本地存储超过限制");
				return false;
			} else {
				console.log("Error: 保存到本地存储失败");
			}
		}
	},

	GetLocalStorage(key, exp) {
		//获取本地存储
		if(localStorage.getItem(key)) {
			// 获取本地存储的值
			var vals = localStorage.getItem(key);
			// 将字符串转换成JSON对象
			var dataObj = JSON.parse(vals);
			if(exp && new Date().getTime() - dataObj.timer > exp) {
				console.log("存储已过期");
				localStorage.removeItem(key);
				return null;
			} else {
				return dataObj.val;
			}
		} else {
			return null;
		}

	},

	RemoveLocalStorage(key) {
		localStorage.removeItem(key)
	}
}