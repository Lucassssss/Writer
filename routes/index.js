var express = require('express');
var pdf = require('phantomjs-pdf');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/pdf', function (req, res, next) {
	var obj = {};
	console.log('body: ' + JSON.stringify(req.body));
	var timestamp1 = Date.parse(new Date());

	// 生成PDF配置
	var html = req.body.htmlCotent; //获取html内容
	var options = {
		"html": "<body class='main_con'>" + html + '</body>',
		"css": "http://7xt7c8.com1.z0.glb.clouddn.com/forPdf.css?attname=&e=1486962628&token=gfASKI_MPRCqW1TyqjDNIGZx68aSytml48OTlCIS:hnSGd0WkMRFFNoG6CzDkFagRUSg",
		"js": "",
		"runnings": "",
		"deleteOnAction": true
	}
	// 转换
	pdf.convert(options, function (result) {
		result.toBuffer(function (returnedBuffer) {});
		var stream = result.toStream();
		var tmpPath = result.getTmpPath();
		result.toFile("/Users/apple/Desktop/" + timestamp1 + ".pdf", function () {
			res.send({
				name: timestamp1
			});
		});
	});
	
	
	
});

module.exports = router;
