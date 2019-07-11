//窗口加载时触发

window.onload = function() {
	//获取画布画笔
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	//加载数据
	if (Ms.get("imgsdata")) Db.load();

	//禁止文档元素拖拽
	document.ondragstart = function(event) {
		return false;
	};
	//鼠标在canvas上的事件
	canvas.onmousedown = canvasClick;
	canvas.onmouseup = stopDragging;
	canvas.onmouseout = stopDragging;
	canvas.onmousemove = dragimg;
};

//上传图片素材

function uploadimgs() {
	var files = document.querySelector('input[type=file]').files;

	function readAndPreview(file) {
		// 确保 `file.name` 符合我们要求的扩展名
		if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
			var reader = new FileReader();

			reader.addEventListener("load", function() {

				main._data.src = reader.result;
				document.getElementById("preview").src = main._data.src;
				var img = new Img(main._data.src);
				main._data.imgs.push(img);
				drawimgs();

			}, false);
			reader.readAsDataURL(file);
		}
	}
	if (files) {
		[].forEach.call(files, readAndPreview);
	}
}

//把图片对象画到画布上

function draw(a) {
	ctx.drawImage(a.img, a.x, a.y);
}

//重新绘制画布

function drawimgs() {
	// 清除画布，准备绘制
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// 遍历所有图片
	for (var i = 0; i < main._data.imgs.length; i++) {
		a = main._data.imgs[i];
		draw(a);
		//如果选中则加一个矩形边框
		if (main._data.imgselected == a) {
			ctx.strokeStyle = 　"red";
			ctx.lineWidth = 3;
			ctx.strokeRect(a.x, a.y, a.img.width, a.img.height);
		};
		ctx.fill();
		ctx.stroke();
	}
}

//查询选中的图片

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
			document.getElementById("image").src = a.img.src;
			//可拖拽
			main._data.isDragging = true;
			// 更新画布
			drawimgs();
			//结束遍历
			if (a.locked) return;
		}
	}
}

//点击选中图片

function selectimg(index) {
	main._data.idindex = index;
	main._data.imgselected = main._data.imgs[index];
	document.getElementById(index).background = 'red';
	//预览
	document.getElementById("image").src = main._data.imgselected.img.src;
	// 更新画布
	drawimgs();
}


//清除选中的图片

function clearselected() {
	if (!confirm("确定清除选中的图片吗？")) return;
	// 去除所有圆圈
	for (var i = 0; i < main._data.imgs.length; i++) {
		if (main._data.imgs[i] == main._data.imgselected) {
			a = i;
		}
	};
	main._data.imgs.splice(a, 1);
	main._data.imgselected = "";
	document.getElementById("image").src = "";
	// 更新画布
	drawimgs();
}

//添加选中的图片

function addselected() {
	var img = new Img(document.getElementById("image").src);
	main._data.imgs.push(img);
	//更新画布
	drawimgs();
}

//停止拖拽

function stopDragging() {
	main._data.isDragging = false;
}

//开始控制

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
			// 更新画布
			drawimgs();
		}
	}
}

//Img对象

function Img(src, x, y, name, locked) {
	var image = new Image();
	image.src = src;
	this.img = image;
	if (x) this.src = src;
	this.x = x || ft(0, canvas.width - image.width);
	this.y = y || ft(0, canvas.height - image.height);
	this.name = name || "button" + main._data.count;
	this.locked = locked || false;
	if (!x) main._data.count += 1;
}

//随机数

function ft(from, to) {
	return Math.floor(Math.random() * (to - from + 1) + from);
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
						var image = new Image();
						image.src = imgsdata[i].src;
						delete imgsdata[i].src;
						imgsdata[i].img = image;
					}
					main._data.imgs = imgsdata;
					if (main._data.imgs[JSON.parse(data.selected)]) {
						main._data.imgselected = main._data.imgs[JSON.parse(data.selected)];
						document.getElementById("image").src = main._data.imgselected.img.src;
					}
					main._data.idindex = JSON.parse(data.selected);
					main._data.count = JSON.parse(data.count);
					drawimgs();
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
			idindex: -1
		}
	});
})();




/*----------------------------- 打包成zip下载 ----------------------------------*/

;
(function() {

	window.Dc = {
		download: downloadzip,
		downloaddata: downloaddata
	};


//导出数据
	function downloaddata() {
		var zip = new JSZip();
		src = [];
		for (var i = 0; i < main._data.imgs.length; i++) {
			var img = new Img(main._data.imgs[i].img.src, main._data.imgs[i].x, main._data.imgs[i].y, main._data.imgs[i].name, main._data.imgs[i].locked, );
			src.push(img);
		}
		data = {
			"imgsdata": /*localStorage.getItem("imgsdata")||*/JSON.stringify(src),
			"selected": /*localStorage.getItem("selected")||*/JSON.stringify(main._data.imgs.indexOf(main._data.imgselected)),
			"count": /*localStorage.getItem("count")||*/JSON.stringify(main._data.count),
		}
		zip.file("数据.xc", JSON.stringify(data));
		//zip.folder("nested").file("data.txt",localStorage.getItem("imgsdata"));//与上一句相同，所以是对已存在文件进行更新操作


		//******保存并下载压缩包
		zip.generateAsync({
			type: "blob"
		}).then(function(blob) {
			saveAs(blob, "data.zip");
		}, function(err) { //报错处理

		});

	}



//导出工程
	function downloadzip() {
		//创建实例，zip是对象实例
		var zip = new JSZip();
		var file_name = 'XC.zip';
		//图片数据
		var array = main._data.imgs;

		var len = function(arr) {
				var l = 0;
				for (var key in arr) {
					l++;
				}
				return l;
			}
		for (let i = 0; i < array.length; i++) {
			//对每一个图片链接获取base64的数据，并使用回调函数处理
			getBase64Image(array[i], function(dataURL) {
				//对获取的图片base64数据进行处理
				var img_arr = dataURL.split(',');
				//根据base64数据在压缩包中生成png数据
				zip.file(array[i].name + '.png', img_arr[1], {
					base64: true
				});
				var ziplength = len(zip.files);
				//当所有图片都已经生成打包并保存zip
				if (ziplength == array.length) {
					zip.file("XC.js", If.getcode())
					zip.generateAsync({
						type: "blob"
					}).then(function(content) {
						saveAs(content, file_name);
					});
				}
			});
		}

	}
	//传入图片链接，返回base64数据

	function getBase64Image(images, callback) {
		var img = new Image();
		var canvas = document.createElement("canvas");
		canvas.width = images.img.width;
		canvas.height = images.img.height;
		img.onload = function() {
			canvas.getContext("2d").drawImage(img, 0, 0);
			//使用canvas获取图片的base64数据
			var dataURL = canvas.toDataURL();
			//调用回调函数
			callback ? callback(dataURL) : null;

		}
		img.src = images.img.src;
	}

})();




/*----------------------------- 本地数据处理 ----------------------------------*/

;
(function() {

	window.Db = {
		save: save,
		load: load,
		clear: clear,
	};

	//保存数据

	function save() {
		Db.clear();
		src = [];
		for (var i = 0; i < main._data.imgs.length; i++) {
			var img = new Img(main._data.imgs[i].img.src, main._data.imgs[i].x, main._data.imgs[i].y, main._data.imgs[i].name, main._data.imgs[i].locked, );
			src.push(img);
		}
		Ms.set("selected", main._data.imgs.indexOf(main._data.imgselected));
		Ms.set("imgsdata", src);
		Ms.set("count", main._data.count);
	}

	//读取数据

	function load() {
		imgsdata = Ms.get("imgsdata");
		src = [];
		for (var i = 0; i < imgsdata.length; i++) {
			var image = new Image();
			image.src = imgsdata[i].src;
			delete imgsdata[i].src;
			imgsdata[i].img = image;
		}
		main._data.imgs = imgsdata;
		if (main._data.imgs[Ms.get("selected")]) {
			main._data.imgselected = main._data.imgs[Ms.get("selected")];
			document.getElementById("image").src = main._data.imgselected.img.src;
		}
		main._data.idindex = Ms.get("selected");
		main._data.count = Ms.get("count");
		drawimgs();
	}

	//清除数据

	function clear() {
		Ms.clear("selected");
		Ms.clear("imgsdata");
		Ms.clear("count")
	}


})();;
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







;
(function() {
	window.If = {
		getcode: getcode,
	};

	function getcode() {
		codeselscted = getselected();
		XY = getxy();
		reslist = getreslist();
		button = getbutton();
		fade = getfade();
		buttondown = getbuttondown();
		despose = getdespose();
		XC = `

		function XC() {};
		XC.Something = function() {
			if (IVal.scene instanceof SMain) {
				IVal.scene.setDialog(new XC_Something(), function(selected) {
					IVal.scene.setDialog(null, null);` + codeselscted + `
				});
			}
		}

		function XC_Something() {
			var _sf = this;
			//==================================== 界面坐标 ===================================

			//黑色遮罩坐标
			var coverX = 0;
			var coverY = 0;

			//返回标题按钮坐标`
			+ XY + `
			/* 暴露私有变量
			 */
			this.getEval = function(code) {
				return eval(code);
			};
			//==================================== 公有属性 ===================================
			this.endDo = null;
			//==================================== 私有属性 ===================================
			//游戏失败界面返回值
			var fail = 0;
			//黑色遮罩
			var cover = null;
			//返回标题按钮
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

				//生成场景按钮
				` + button + `
				//加载完毕
				loadOver = true;
				//界面出现动画
				gameOverAnimation();
			}
			/**
			 * 动态显示游戏失败界面
			 */

			function gameOverAnimation() {
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



	function getselected() {
		code = ""
		for (var i = 0; i < main._data.imgs.length; i++) {
			code = code + `

			if (selected == ` + i + `) {
				//当点击`+main._data.imgs[i].name+`时触发下面代码
				RF.ShowTips("点击了`+main._data.imgs[i].name+`")
				//你的代码
			}`
		}
		return code;
	}


	function getxy() {
		code = ""
		for (var i = 0; i < main._data.imgs.length; i++) {
			code = code + `

			var` + " " + main._data.imgs[i].name + `X = ` + main._data.imgs[i].x + `;
			var` + " " + main._data.imgs[i].name + `Y = ` + main._data.imgs[i].y + `;`
		}
		return code;
	}

	function getreslist() {
		code = ""

		for (var i = 0; i < main._data.imgs.length; i++) {
			code = code + `"System/XC/`+main._data.imgs[i].name+`.png", `
		}
		return code;
	}

	function getbutton() {
		code = ""
		for (var i = 0; i < main._data.imgs.length; i++) {
			code = code + ``

			+ main._data.imgs[i].name + ` = new IButton(hash[resList[` + i + `]], hash[resList[` + i + `]]);` 
			+ main._data.imgs[i].name + `.visible = false;` 
			+ main._data.imgs[i].name + `.x = RF.PointTranslation(_sf, ` + main._data.imgs[i].name + `, ` + main._data.imgs[i].name + `X, "x");` 
			+ main._data.imgs[i].name + `.y = RF.PointTranslation(_sf, ` + main._data.imgs[i].name + `, ` + main._data.imgs[i].name + `Y, "y");` 
			+ main._data.imgs[i].name + `.z = 1505;
			`
		}
		return code;
	}


	function getfade() {
		code = ""
		for (var i = 0; i < main._data.imgs.length; i++) {
			code = code + ``

			+ main._data.imgs[i].name + `.fade(0, 1, 20);` 
			+ main._data.imgs[i].name + `.visible = true;
			`
		}
		return code;
	}

	function getbuttondown() {
		code = ""
		for (var i = 0; i < main._data.imgs.length; i++) {
			code = code + `

			if (` + main._data.imgs[i].name + `.update()) { //按下1
				RV.GameSet.playEnterSE();
				_sf.dispose(` + i + `);
				return false;
			}`
		}
		return code;
	}


	function getdespose() {
		code = ""
		for (var i = 0; i < main._data.imgs.length; i++) {
			code = code + `

			` + main._data.imgs[i].name + `.dispose();`
		}
		return code;
	}




})();









