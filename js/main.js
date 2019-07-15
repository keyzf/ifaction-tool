//窗口加载时触发
window.onload = function() {
	//获取画布画笔
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	ctx2 = canvas.getContext("2d");

	//加载数据
	if (Ms.get("imgsdata")) Db.load();
	//禁止文档元素拖拽
	document.ondragstart = function(event) {
		return false;
	};
	//鼠标在canvas上的事件
	canvas.onmousedown = Tz.canvasClick;
	canvas.onmouseup = Tz.stopDragging;
	canvas.onmouseout = Tz.stopDragging;
	canvas.onmousemove = Tz.dragimg;
};

//Img对象

function Img(type, src, x, y, name, locked, src2, src3,str,color,size) {
	this.type = type;

	if (type == "text") {
		main._data.count+=1;
		this.img = {
			str: str||"默认文字",
			color: color||"#000000",
			size: size||40,
			width: 160,
			height: 40,
		}
	} else {
		if (x) {
			this.src = src
		} else {
			main._data.count += 1;
			var image = new Image();
			image.src = src;
			this.img = image;
			if (type == "button") {
				this.img2 = image;
				this.img3 = image;
			}
		};
		if (src2) this.src2 = src2;
		if (src3) this.src3 = src3;
	}
	this.x = x || ft(0, canvas.width - 150);
	this.y = y || ft(0, canvas.height - 150);
	this.name = name || "name" + main._data.count;
	this.locked = locked || false;
}




//重新绘制画布

function drawimgs() {
	// 清除画布，准备绘制
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// 遍历所有图片
	for (var i = 0; i < main._data.imgs.length; i++) {
		a = main._data.imgs[i];
		if (main._data.imgs[i].type == "text") {
			ctx.textBaseline = "hanging";
			ctx.font = "" + main._data.imgs[i].img.size + "px normal";
			ctx.fillStyle = main._data.imgs[i].img.color;
			ctx.fillText(main._data.imgs[i].img.str, main._data.imgs[i].x, main._data.imgs[i].y);
			ctx.fill()
			ctx.stroke()

		} else {
			ctx.drawImage(a.img, a.x, a.y);
		}
		//如果选中则加一个矩形边框

		if (main._data.imgselected == a) {

			ctx2.strokeStyle = 　"red";
			ctx2.lineWidth = 3;
			ctx2.strokeRect(a.x, a.y, a.img.width, a.img.height);
		};
		ctx2.fill();
		ctx2.stroke();
	}
}

//上传图片素材

function uploadimgs(id, type) {
	if (type == "text") {
		var text = new Img("text");
		main._data.imgs.push(text);
		return;
	}
	var files = document.getElementById(id).files;

	function readAndPreview(file) {
		// 确保 `file.name` 符合我们要求的扩展名
		if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
			var reader = new FileReader();
			reader.addEventListener("load", function() {
				main._data.src = reader.result;
				var img = new Img(type, main._data.src);
				main._data.imgs.push(img);
			}, false);
			reader.readAsDataURL(file);
		}
	}
	if (files) {
		[].forEach.call(files, readAndPreview);
	}
	var file = document.getElementById(id);
	file.outerHTML = file.outerHTML;
}




//随机数

function ft(from, to) {
	return Math.floor(Math.random() * (to - from + 1) + from);
}


//弹出层信息

function msg(text) {
	var layer = document.createElement("div");
	layer.id = "layer";
	var style = {
		position: "absolute",
		left: "680px",
		top: "350px",
	}
	for (var i in style)
	layer.style[i] = style[i];

	if (document.getElementById("layer") == null) {
		layer.innerHTML = '<label class="layer">' + text + '</label>'
		document.body.appendChild(layer);
		setTimeout("document.body.removeChild(layer)", 800)
	}
}


//点击选中图片

function selectimg(index) {
	main._data.idindex = index;
	main._data.imgselected = main._data.imgs[index];
	document.getElementById(index).background = 'red';
}


//睡眠

function sleep(numberMillis) {
	var now = new Date();
	var exitTime = now.getTime() + numberMillis;
	while (true) {
		now = new Date();
		if (now.getTime() > exitTime) return true;
	}
}

//改变图片

function change(id, img) {

	var files = document.getElementById(id).files;

	function readAndPreview(file) {
		// 确保 `file.name` 符合我们要求的扩展名
		if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
			var reader = new FileReader();
			reader.addEventListener("load", function() {
				if (img == 3) {
					main._data.src = reader.result;
					var image1 = new Image();
					image1.src = reader.result;
					main._data.imgselected.img3 = image1;
					document.getElementById("image3").src = main._data.src;
				}
				if (img == 2) {
					main._data.src = reader.result;
					var image1 = new Image();
					image1.src = reader.result;
					main._data.imgselected.img2 = image1;
					document.getElementById("image2").src = main._data.src;
				}
				if (img == 1) {
					main._data.src = reader.result;
					var image1 = new Image();
					image1.src = reader.result;
					main._data.imgselected.img = image1;
					if (sleep(100)) drawimgs();
					document.getElementById("image").src = main._data.src;
				}

			}, false);
			reader.readAsDataURL(file);
		}
	}
	if (files) {
		[].forEach.call(files, readAndPreview);
	}
	var file = document.getElementById(id);
	file.outerHTML = file.outerHTML;
}




function showtextcolor(value) {
	var a = value;
	if (a.substr(0, 1) == "#") a = a.substring(1);
	var len = a.length;
	a = a.toLowerCase();
	b = new Array();
	c=new Array();
	for (x = 0; x < 3; x++) {
		b[0] = len == 6? a.substr(x * 2, 2) : a.substr(x * 1, 1) + a.substr(x * 1, 1);
		b[3] = "0123456789abcdef";
		b[1] = b[0].substr(0, 1);
		b[2] = b[0].substr(1, 1);
		c[0 + x] = b[3].indexOf(b[1]) * 16 + b[3].indexOf(b[2])
	}
	return 'new IColor('+c[0]+','+c[1]+','+c[2]+')'
}





/*-------------------------------- vue仓库 --------------------------------------*/
;
(function() {
	main = new Vue({
		el: '#main',
		data: {
			imgs: [],
			imgselected: "",
			src: "",
			isDragging: false,
			count: 0,
			idindex: -1,
			channge: 0,
		},
		methods: {
			//添加选中的图片
			addselected() {
				if(this.imgselected.type=='text'){
					main._data.count+=1;
					img={
						type:this.imgselected.type,
						img:{
							str:this.imgselected.img.str,
							size:this.imgselected.img.size,
							color:this.imgselected.img.color,
							width:this.imgselected.img.width,
							height:this.imgselected.img.height,
						},
						x:ft(0, canvas.width - 150),
						y:ft(0, canvas.height - 150),
						name:"name" + main._data.count,
						locked:this.imgselected.locked,
					};
					main._data.imgs.push(img);
					return;
				}
				var img = new Img(main._data.imgselected.type, main._data.imgselected.img.src);
				main._data.imgs.push(img);
			},
			//清除选中的图片
			clearselected() {
				this.idindex = -1;
				for (var i = 0; i < this.imgs.length; i++) {
					if (this.imgs[i] == this.imgselected) {
						a = i;
					}
				};
				this.imgs.splice(a, 1);
				this.imgselected = "";
				document.getElementById("image").src = "";
			}
		},
		watch: {
			imgs() {
				if (sleep(3)) drawimgs()
			}, imgselected() {
				if (this.imgselected.type == "text") {
					this.imgselected.img.height = this.imgselected.img.size;
					ctx2.font = "" + this.imgselected.img.size+ "px normal";
					this.imgselected.img.width = ctx2.measureText(this.imgselected.img.str).width;
		
				}
				drawimgs();
				document.getElementById("image").src = "";
				document.getElementById("image2").src = "";
				document.getElementById("image3").src = "";
				if (this.imgselected.type != "text") {
					if (this.imgselected) document.getElementById("image").src = this.imgselected.img.src;

					if (this.imgselected.type == "button") {
						document.getElementById("image2").src = this.imgselected.img2.src;
						document.getElementById("image3").src = this.imgselected.img3.src;
					}

				};
			}, sumxy() {
				if (this.imgselected.type == "text") {
					this.imgselected.img.height = this.imgselected.img.size;
					ctx2.font = "" + this.imgselected.img.size+ "px normal";
					this.imgselected.img.width = ctx2.measureText(this.imgselected.img.str).width;
		
				}
				drawimgs();
			},
		},
		computed: {
			sumxy() {
				if (this.imgselected.type == 'text') {
					return this.imgselected.img.color + this.imgselected.img.str+this.imgselected.x + this.imgselected.y+this.imgselected.img.size;
				}
				return this.imgselected.x + this.imgselected.y;
			},

		}
	});
})();






/*-------------------------------- 拖拽控制 --------------------------------------*/
;
(function() {

	window.Tz = {
		canvasClick: canvasClick,
		stopDragging: stopDragging,
		dragimg: dragimg,
	};

	//选中图片

	function canvasClick(e) {
		// 取得画布上被单击的点
		var clickX = e.pageX - canvas.offsetLeft;
		var clickY = e.pageY - canvas.offsetTop;
		// 上一个选中的
		b = main._data.imgselected;
		//遍历所有图片，查找下次选中的图片
		for (var i = 0; i < main._data.imgs.length; i++) {
			a = main._data.imgs[i];
			if (clickX >= a.x && clickX <= a.x + a.img.width && clickY >= a.y && clickY <= a.y + a.img.height) {
				//更新选中的图片
				main._data.imgselected = a;
				//预览
				main._data.idindex = main._data.imgs.indexOf(main._data.imgselected)

				//可拖拽
				main._data.isDragging = true;
				//结束遍历
				if (a.locked) return;
			}
		}
	}
	//停止拖拽

	function stopDragging() {
		main._data.isDragging = false;
	}

	//拖拽图片

	function dragimg(e) {
		//固定时停止拖拽
		if (main._data.imgselected.locked == true) return;
		// 判断图片是否开始拖拽
		if (main._data.isDragging == true) {
			// 判断拖拽对象是否存在
			if (main._data.imgselected != null) {
				// 取得鼠标位置
				var x = e.pageX - canvas.offsetLeft;
				var y = e.pageY - canvas.offsetTop;
				// 将图片移动到鼠标位置
				main._data.imgselected.x = x - main._data.imgselected.img.width / 2;
				main._data.imgselected.y = y - main._data.imgselected.img.height / 2;
			}
		}
	}
})();


/*----------------------------- 数据处理 ----------------------------------*/

;
(function() {

	window.Db = {
		save: save,
		load: load,
		clear: clear,
		loaddata: loaddata,
		download: downloadzip,
		downloaddata: downloaddata
	};

	//保存数据

	function save() {
		src = [];
		for (var i = 0; i < main._data.imgs.length; i++) {
			if(main._data.imgs[i].type=="text"){
				src.push(main._data.imgs[i]);
				continue;
			}
			var img = new Img(main._data.imgs[i].
			type, main._data.imgs[i].img.src, main._data.imgs[i].x, main._data.imgs[i].y, main._data.imgs[i].name, main._data.imgs[i].locked, main._data.imgs[i].type == "button" ? main._data.imgs[i].img2.src : 0, main._data.imgs[i].type == "button" ? main._data.imgs[i].img3.src : 0);
			src.push(img);
		}
		Ms.set("selected", main._data.imgs.indexOf(main._data.imgselected));
		Ms.set("imgsdata", src);
		Ms.set("count", main._data.count);
		msg("保存成功");
	}

	//读取数据

	function load() {
		imgsdata = Ms.get("imgsdata");
		src = [];
		for (var i = 0; i < imgsdata.length; i++) {
			if(imgsdata[i].type=="text"){
				continue;
			}
			var image = new Image();
			image.src = imgsdata[i].src;
			delete imgsdata[i].src;
			imgsdata[i].img = image;
			if (imgsdata[i].src2) {
				var image = new Image();
				image.src = imgsdata[i].src2;
				delete imgsdata[i].src2;
				imgsdata[i].img2 = image;
			}
			if (imgsdata[i].src3) {
				var image = new Image();
				image.src = imgsdata[i].src3;
				delete imgsdata[i].src3;
				imgsdata[i].img3 = image;
			}
		}
		main._data.imgs = imgsdata;
		if (main._data.imgs[Ms.get("selected")]) {
			main._data.imgselected = main._data.imgs[Ms.get("selected")];

		}
		main._data.idindex = Ms.get("selected");
		main._data.count = Ms.get("count");

		msg("读取成功");
	}

	//清除数据

	function clear() {
		Ms.clear("selected");
		Ms.clear("imgsdata");
		Ms.clear("count")
		msg("清除成功");
	}



	//导出文件

	function downloaddata() {
		var zip = new JSZip();
		src = [];
		for (var i = 0; i < main._data.imgs.length; i++) {
			if(main._data.imgs[i].type=="text"){
				src.push(main._data.imgs[i]);
				continue;
			}
			var img = new Img(main._data.imgs[i].type, main._data.imgs[i].img.src, main._data.imgs[i].x, main._data.imgs[i].y, main._data.imgs[i].name, main._data.imgs[i].locked, main._data.imgs[i].type == "button" ? main._data.imgs[i].img2.src : 0, main._data.imgs[i].type == "button" ? main._data.imgs[i].img3.src : 0);
			src.push(img);
		}
		data = {
			"imgsdata": /*localStorage.getItem("imgsdata")||*/
			JSON.stringify(src),
			"selected": /*localStorage.getItem("selected")||*/
			JSON.stringify(main._data.imgs.indexOf(main._data.imgselected)),
			"count": /*localStorage.getItem("count")||*/
			JSON.stringify(main._data.count),
		}
		zip.file("数据.xc", JSON.stringify(data));
		//zip.folder("nested").file("data.txt",localStorage.getItem("imgsdata"));//与上一句相同，所以是对已存在文件进行更新操作


		//保存并下载压缩包
		zip.generateAsync({
			type: "blob"
		}).then(function(blob) {
			saveAs(blob, "data.zip");
		}, function(err) { //报错处理

		});

	}

	//导入文件

	function loaddata() {
		var files = $('#fileId').prop('files');

		function readAndPreview(file) {
			// 确保 `file.name` 符合我们要求的扩展名
			if (/\.(xc)$/i.test(file.name)) {
				var files = $('#fileId').prop('files');
				if (files.length == 0) {
					return;
				} else {
					var reader = new FileReader();
					reader.readAsText(files[0], "UTF-8");

					reader.onload = function(evt) {
						data = JSON.parse(evt.target.result);
						imgsdata = JSON.parse(data.imgsdata);
						if (!imgsdata) {
							alert("出错了");
							return;
						}
						src = [];
						for (var i = 0; i < imgsdata.length; i++) {
							if(imgsdata[i].type=="text"){
								continue;
							}
							var image = new Image();
							image.src = imgsdata[i].src;
							delete imgsdata[i].src;
							imgsdata[i].img = image;
							if (imgsdata[i].src2) {
								var image = new Image();
								image.src = imgsdata[i].src2;
								delete imgsdata[i].src2;
								imgsdata[i].img2 = image;
							}
							if (imgsdata[i].src3) {
								var image = new Image();
								image.src = imgsdata[i].src3;
								delete imgsdata[i].src3;
								imgsdata[i].img3 = image;
							}
						}
						main._data.imgs = imgsdata;
						if (main._data.imgs[JSON.parse(data.selected)]) {
							main._data.imgselected = main._data.imgs[JSON.parse(data.selected)];
						}
						main._data.idindex = JSON.parse(data.selected);
						main._data.count = JSON.parse(data.count);
					}
				}
			} else {
				alert("请导入正确文件")
			}
		}
		if (files) {
			[].forEach.call(files, readAndPreview);
		}
	}




	//导出工程

	function downloadzip() {
		//创建实例，zip是对象实例
		var zip = new JSZip();
		var file_name = 'XC.zip';
		//图片数据
		var array = main._data.imgs;
		var length = array.length;
		for (var i = 0; i < array.length; i++) {
			if (array[i].type == "button") {
				length += 2;
			}
			if (array[i].type == "text") {
				length -= 1;
			}
		}
		for (let i = 0; i < array.length; i++) {

			if (array[i].type == "sprite") {
				getBase64Image(array[i], function(dataURL) {
					//对获取的图片base64数据进行处理
					var img_arr = dataURL.split(',');
					//根据base64数据在压缩包中生成png数据
					zip.file(array[i].name + '.png', img_arr[1], {
						base64: true
					});
					finish();
				}, 0);
			}
			if (array[i].type == "button") {
				getBase64Image(array[i], function(dataURL) {
					//对获取的图片base64数据进行处理
					var img_arr = dataURL.split(',');
					//根据base64数据在压缩包中生成png数据
					zip.file(array[i].name + '_0.png', img_arr[1], {
						base64: true
					});

					finish();
				}, 0);
				getBase64Image(array[i], function(dataURL) {
					//对获取的图片base64数据进行处理
					var img_arr = dataURL.split(',');
					//根据base64数据在压缩包中生成png数据
					zip.file(array[i].name + '_1.png', img_arr[1], {
						base64: true
					});
					finish();
				}, 1);
				getBase64Image(array[i], function(dataURL) {
					//对获取的图片base64数据进行处理
					var img_arr = dataURL.split(',');
					//根据base64数据在压缩包中生成png数据
					zip.file(array[i].name + '_2.png', img_arr[1], {
						base64: true
					});
					finish();
				}, 2);
			}
		}

		function len(arr) {
			var l = 0;
			for (var key in arr) {
				l++;
			}
			return l;
		}

		function finish() {
			var ziplength = len(zip.files);
			//当所有图片都已经生成打包并保存zip
			if (ziplength == length) {
				zip.file("XC.js", If.getcode())
				zip.generateAsync({
					type: "blob"
				}).then(function(content) {
					saveAs(content, file_name);
				});
			}
		}

	}


	//传入图片链接，返回base64数据

	function getBase64Image(images, callback, index) {
		var img = new Image();
		var canvas = document.createElement("canvas");
		//同等大小
		canvas.width = images.img.width;
		canvas.height = images.img.height;
		/*初始大小
		if(index == 0){
			canvas.width = images.img.width;
		canvas.height = images.img.height;}
		if(index == 1){
			canvas.width = images.img2.width;
		canvas.height = images.img2.height;}
		if(index == 2){
			canvas.width = images.img3.width;
		canvas.height = images.img3.height;}*/
		img.onload = function() {
			canvas.getContext("2d").drawImage(img, 0, 0);
			//使用canvas获取图片的base64数据
			var dataURL = canvas.toDataURL();
			//调用回调函数
			callback ? callback(dataURL) : null;

		}
		if (index == 0) img.src = images.img.src;
		if (index == 1) img.src = images.img2.src;
		if (index == 2) img.src = images.img3.src;
	}



})();


/*----------------------------- 本地存储 ----------------------------------*/
;
(function() {

	window.Ms = {
		set: set,
		get: get,
		clear: clear,
	};

	function set(key, val) {
		localStorage.setItem(key, JSON.stringify(val));
	}

	function get(key) {
		var json = localStorage.getItem(key);
		if (json) {
			return JSON.parse(json);
		}
	}

	function clear(key) {
		localStorage.removeItem(key);
	}
})();


/*----------------------------- 生成ifaction代码 ----------------------------------*/






/*----------------------------- 基础功能 ----------------------------------*/
;
(function() {
	window.If = {
		getcode: getcode,
	};

	function getcode() {
		clicked = getclicked();
		XY = getxy();
		reslist = getreslist();
		content = getcontent();
		fade = getfade();
		buttondown = getbuttondown();
		despose = getdespose();
		XC = `

		function XC() {};
		XC.Something = function() {
			if (IVal.scene instanceof SMain) {
				IVal.scene.setDialog(new XC_Something(), function(selected) {
					IVal.scene.setDialog(null, null);` + clicked + `
				});
			}
		}

		function XC_Something() {
			var _sf = this;
			//==================================== 界面坐标 ===================================

			//遮罩坐标
			var coverX = 0;
			var coverY = 0;

			//坐标`
			+ XY + `
			/* 暴露私有变量
			 */
			this.getEval = function(code) {
				return eval(code);
			};
			//==================================== 公有属性 ===================================
			this.endDo = null;
			//==================================== 私有属性 ===================================
			//游戏界面返回值
			var fail = 0;
			//遮罩
			var cover = null;
			//按钮
			var buttonScene1 = null;
			//判断预加载是否完成的开关
			var loadOver = false;
			//本界面资源列表
			var resList = [` + reslist + `];

			//预加载全部图片
			RF.CacheUIRes(resList, init);
			//==================================== 私有函数 ===================================
			/**
			 * 预加载函数
			 * @param hash
			 */

			function init(hash) {

				//背景
				cover = new ISprite(IVal.GWidth, IVal.GHeight, IColor.White());
				cover.visible = false;
				cover.x = coverX;
				cover.y = coverY;
				cover.z = 1499;

				//生成图像
				` + content + `
				//加载完毕
				loadOver = true;
				//界面出现动画
				Animation();
			}
			/**
			 * 动态显示游戏界面
			 */

			function Animation() {
				cover.opacity = 1;
				cover.visible = true;` + fade + `
			}
			//==================================== 公有函数 ===================================
			/**
			 * 本界面刷新
			 */
			this.update = function() {
				if (!loadOver) return true;
				if (IInput.isKeyDown(27)) { // 按下ESC
					_sf.dispose();
					return false;
				}` + buttondown + `

				return true;
			};
			/**
			 * 本界面释放
			 */
			this.dispose = function(selected) {
				if (_sf.endDo != null) _sf.endDo(selected);
				//释放本界面全部底板与按钮
				cover.dispose();` + despose + `
			};
		}`
		return XC;
	}



	function getclicked() {
		code = ""
		for (var i = 0; i < main._data.imgs.length; i++) {
			if (main._data.imgs[i].type == "button") {
				code = code + `
				if (selected == ` + i + `) {
					//当点击`+main._data.imgs[i].name+`时触发下面代码
					RF.ShowTips("点击了`+main._data.imgs[i].name+`")
					//你的代码
				}`
			}
		}
		return code;
	}


	function getxy() {
		code = ""
		for (var i = 0; i < main._data.imgs.length; i++) {
			if(main._data.imgs[i].type=="text"){
				code = code + `
			 var` + " " + main._data.imgs[i].name + `_X = ` + (main._data.imgs[i].x-5) + `;
			 var` + " " + main._data.imgs[i].name + `_Y = ` + main._data.imgs[i].y + `;`;
				continue;
			}
			code = code + `
			 var` + " " + main._data.imgs[i].name + `_X = ` + main._data.imgs[i].x + `;
			 var` + " " + main._data.imgs[i].name + `_Y = ` + main._data.imgs[i].y + `;`;
		}
		return code;
	}

	function getreslist() {
		code = ""

		for (var i = 0; i < main._data.imgs.length; i++) {
			if (main._data.imgs[i].type == "sprite") {
				code = code + 
				`"System/XC/`+main._data.imgs[i].name+`.png", `;
			}
			if (main._data.imgs[i].type == "button") {
				code = code + 
				`"System/XC/`+main._data.imgs[i].name+`_0.png",`;
				code = code + 
				`"System/XC/`+main._data.imgs[i].name+`_1.png", `;
				code = code + 
				`"System/XC/`+main._data.imgs[i].name+`_2.png", `;
			}
		}
		return code;
	}

	function getcontent() {
		count = 0
		code = ""
		for (var i = 0; i < main._data.imgs.length; i++) {
			if (main._data.imgs[i].type == "text"){
				code+=`
				` + main._data.imgs[i].name + ` = new ISprite(IFont.getWidth('` + main._data.imgs[i].img.str + `',` + main._data.imgs[i].img.size + `)*1.4, IFont.getHeight('` + main._data.imgs[i].img.str + `',` + main._data.imgs[i].img.size + `)*1.4, IColor.Transparent());
				` + main._data.imgs[i].name + `.x = RF.PointTranslation(_sf , ` + main._data.imgs[i].name + ` , ` + main._data.imgs[i].name + `_X , "x");
				` + main._data.imgs[i].name + `.y = RF.PointTranslation(_sf ,` + main._data.imgs[i].name + ` , ` + main._data.imgs[i].name + `_Y , "y");
				` + main._data.imgs[i].name + `.z = `+(1505+i)+`;
				` + main._data.imgs[i].name + `.drawTextQ('` + main._data.imgs[i].img.str + `',0,0,`+showtextcolor(main._data.imgs[i].img.color)+`, ` + main._data.imgs[i].img.size + `);
				`
			}
			if (main._data.imgs[i].type == "sprite") {
				code += `
				` + main._data.imgs[i].name + ` = new ISprite(hash[resList[` + count + `]]);
				` + main._data.imgs[i].name + `.visible = false;
				` + main._data.imgs[i].name + `.x = RF.PointTranslation(_sf, ` + main._data.imgs[i].name + `, ` + main._data.imgs[i].name + `_X, "x");
				` + main._data.imgs[i].name + `.y = RF.PointTranslation(_sf, ` + main._data.imgs[i].name + `, ` + main._data.imgs[i].name + `_Y, "y");
				` + main._data.imgs[i].name + `.z = `+(1505+i)+`;

				`;
				count += 1;
			}
			if (main._data.imgs[i].type == "button") {
				code += `
				` + main._data.imgs[i].name + ` = new IButton(hash[resList[` + count + `]], hash[resList[` + (count + 1) + `]]);
				` + main._data.imgs[i].name + `.visible = false;
				` + main._data.imgs[i].name + `.x = RF.PointTranslation(_sf, ` + main._data.imgs[i].name + `, ` + main._data.imgs[i].name + `_X, "x");
				` + main._data.imgs[i].name + `.y = RF.PointTranslation(_sf, ` + main._data.imgs[i].name + `, ` + main._data.imgs[i].name + `_Y, "y");
				` + main._data.imgs[i].name + `.z = `+(1505+i)+`;
				` + main._data.imgs[i].name + `.setEnableBitmap(hash[resList[`+(count+2)+`]]);
				` + main._data.imgs[i].name + `.setEnable(1);/*true为不禁用，false为禁用，可以动态监测*/
				`;
				count += 3;
			}

		}
		return code;
	}


	function getfade() {
		code = ""
		for (var i = 0; i < main._data.imgs.length; i++) {
			code = code + `
			` + main._data.imgs[i].name + `.fade(0, 1, 20);
			` + main._data.imgs[i].name + `.visible = true;`;
		}
		return code;
	}

	function getbuttondown() {
		code = ""
		for (var i = 0; i < main._data.imgs.length; i++) {

			if (main._data.imgs[i].type == "button") {

				code = code + `
				if (` + main._data.imgs[i].name + `.update()) { //按下`+main._data.imgs[i].name+`
					RV.GameSet.playEnterSE();
					_sf.dispose(` + i + `);
					return false;
				};`;
			}

		}
		return code;
	}

	function getdespose() {
		code = ""
		for (var i = 0; i < main._data.imgs.length; i++) {
			code = code + `
			` + main._data.imgs[i].name + `.dispose();`;
		}
		return code;
	}
})();