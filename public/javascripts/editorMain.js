/*
 * @author: Lcuas 
 * @date: 2016-1-16
 * @description: 
 */

/*
 * 获取本地章节信息
 * 本地存储只能存储string类型，因此需要转换为对象再使用
 */
function getLocalChapter() {
	if (localStorage.chapter) {
		var savedChapter = JSON.parse(localStorage.chapter);
		var con = savedChapter.con;

		$(".chapterAll").find("li").removeClass("active");
		for (var i = 0; i < con.length; i++) {
			var id = String(con[i].id);
			var title = con[i].title;
			var str = '<li cData=' + id +'><a href="javascript:void(0)" class="default"><i class="chapter_num">' + id + '. </i> <span class="name">' + title + '</span></a></li>';
			$(".chapterAll").append(str);
		};
	};
}

/*
 * 激活活动章节
 */
function activeAction(i) {
	$(".char_con").find("li").each(function() {
		var t = parseInt($(this).attr("cData"));
		//console.log(t, i, typeof(t), typeof(i))
		if ( i == t ) {
			$(this).addClass("active");
			return false;
		};
	})
}

$(function() {

	//初始化第一章节
	if (!localStorage.activeChapter) {
		localStorage.activeChapter = "1";
	};

	getLocalChapter();
	// 获取本地活动章节内容
	if(localStorage.activeChapter) {

		var i = localStorage.activeChapter;

		//获取内容
		if (localStorage[i]) {
			var contentAct = localStorage[i];
			console.log(contentAct);
			$(".simditor-body").html(contentAct);
		};

		i = parseInt(i);
		//console.log( i, typeof(t), typeof(i))
		//获取章节
		activeAction(i);
	}

	// 获取活动章节对应文章内容
	/*if(localStorage.content) {
		var localData = localStorage.content;
		$(".simditor-body").html(localData);
	}*/

	newChapterAdd();

	/*
	 * 当前编辑文章的章节
	 * 1、点击时设置为活动章节，并在本地存储；
	 * 2、初始化时根据本地存储打开上次活动章节
	 */
	$(".char_con").find("li").each(function() {
		//console.log($(this));
		$(this).click(function() {
			$(this).addClass("active").siblings().removeClass("active");
			// 对应章节内容操作
			var activeCpId = $(this).attr("cData");
			if (localStorage[activeCpId]) {
				var contentAct = localStorage[activeCpId];
				console.log(contentAct);
				$(".simditor-body").empty();
				$(".simditor-body").html(contentAct);
			} else {
				$(".simditor-body").empty();
			};
			localStorage.setItem("activeChapter", activeCpId);
		})
	});

	/*
	* 章节名称修改
	*/
	$(".char_con").find("li").each(function() {
		$(this).on("dblclick", function() {
			var old = $(this).find("span").html();
			$(this).find("span").html('<input type="text" class="chapter_input" value="'+ old +'">');
			var newNodeInput =  $(this).parents("div.char_con").find(".chapterAll").find("li:last-child").find("input");
			var chapterId = $(this).index() + 1;
			var localChapter = localStorage.chapter;
			saveChapter(newNodeInput, chapterId, localChapter);
		})
	})

	});

// Simditor 插件初始化
var editor = new Simditor({
	textarea: $('.editor'),
	placeholder: '',
	defaultImage: 'images/image.png',
	params: {},
	upload: false,
	tabIndent: true,
	toolbar: [  'title',  'bold',  'italic',  'underline',  'strikethrough',  'fontScale',  'color',  'ol',  'ul',  'blockquote',  'code',  'table',  'link',  'image',  'hr',  'indent',  'outdent',  'alignment'],
	toolbarFloat: true,
	toolbarFloatOffset: 0,
	toolbarHidden: false,
	pasteImage: false,
	cleanPaste: false
});

/*$(".simditor-toolbar").hover(function() {
	$(this).css("opacity", "1");
}, function() {
	$(this).css("opacity", "0.3");
})*/

/*
 * 保存活动章节的文章内容
 */
function save(content) {
	// 获取当前活动章节信息
	var activeChapterId = $(".chapterAll").find("li.active").attr("cdata");
	localStorage.setItem(activeChapterId, content);
}

// 每隔3s自动保存一次
setInterval(function(){
	var content = $(".simditor-body").html();
	save(content);
}, 3000);

/*
* 添加新章节
*/
function newChapterAdd() { 
	$(".newChapter").on("click", function() {

		// Creat chapter
		var chapterAllSize = $(".chapterAll").find('li').size();
		var chapterId = chapterAllSize + 1;
		var localChapter = localStorage.chapter;

		

		var newChapterName = '<li class="active" cData='+ chapterId +'><a href="javascript:void(0)" class="default"><i class="chapter_num">' + chapterId + '. </i> <span class="name">New chapter</span></a></li>';
		$(".chapterAll").find("li").removeClass("active");
		//$(".chapterAll").append(newChapterName);

		//新标题输入
		var inputStr = '<li class="active" cData='+ chapterId +'> <a href="javascript:void(0)" class="default"> <i class="chapter_num">' + chapterId + '. </i> <span class="name"> <input type="text" class="chapter_input" placeholder="Type new name"> </span></a></li>';
		$(this).parents('div.char_con').find(".chapterAll").append(inputStr);

		var newNodeInput =  $(this).parents("div.char_con").find(".chapterAll").find("li:last-child").find("input");
		newNodeInput.focus(); //设置新标题输入焦点

		saveChapter(newNodeInput, chapterId, localChapter);

		$(".simditor-body").empty();
		
		/*
		 * 添加新li后重新执行点击Li的each()事件
		 */
		$(".char_con").find("li").each(function() {
			//console.log($(this));
			$(this).click(function() {
				$(this).addClass("active").siblings().removeClass("active");
				// 对应章节内容操作
				var activeCpId = $(this).attr("cData");
				if (localStorage[activeCpId]) {
					var contentAct = localStorage[activeCpId];
					console.log(contentAct);
					$(".simditor-body").empty();
					$(".simditor-body").html(contentAct);
				} else {
					$(".simditor-body").empty();
				};
				localStorage.setItem("activeChapter", activeCpId);
			})
		});

		activeAction(chapterId);
		//$(this).addClass("active").siblings().removeClass("active");
		localStorage.setItem("activeChapter", chapterId);
	});
}

/*
 *导出功能
 */
 $(".export").on("click", function() {

 	var data = {};
 	data.htmlCotent = $(".simditor-body").html();
 	 //文件下载方法
	function downloadFile(fileName, content){
	    var aLink = document.createElement("a"),
	        evt = document.createEvent("HTMLEvents");

	    evt.initEvent("click");
	    aLink.download = fileName;
	    aLink.href = content;

	    aLink.dispatchEvent(evt);
	}

 	$.ajax({
		type: "POST",
		url: "/pdf",
		data: JSON.stringify(data),
		contentType: "application/json",
		success: function (data) {
			//close loading
			//layer.close(index); 
			console.log("../tmp/" + data.name + ".pdf")
			downloadFile(data.name + ".pdf", "/tmp/" + data.name + ".pdf");
		}
	})
 })



function saveChapter(e, id, l) {
	e.on("blur", function() {
		var iVal = $(this).val();
		console.log(iVal)
		if (iVal) {
			/*$(this).remove();*/
			console.log($(this).parents(".name"));
			$(this).parents(".name").html(iVal);
		} else {
			/*$(this).parents(".name").empty();*/
			$(this).parents(".name").html("新章节");
		};
		// 存储本地活动章节内容
		var chapterName = "chapter" + id;

		// 转换为json保存，获取出来再次操作时需要转换为对象
		if (l) {
			var oldChapterList = JSON.parse(localStorage.chapter);  //Saved data obj
			//console.log(oldChapterList);
			var restoreData = {
				id : id,
				title: $(".chapterAll").find("li:last-child").find(".name").text()
			};
			oldChapterList.con.push(restoreData);
			console.log(oldChapterList.con)
			localStorage.setItem('chapter', JSON.stringify(oldChapterList));
		} else {
			var data = {
				id : id,
				title: $(".chapterAll").find("li:last-child").find(".name").text()
			};
			var chapterObj = {
				con : []
			};
			chapterObj.con.push(data);
			localStorage.setItem('chapter', JSON.stringify(chapterObj));
		};
	});
}