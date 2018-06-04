var express 		=	require('express'),
		router			= express.Router(),
		multer			= require('multer'),
		bodyParser 	= require('body-parser'),
		jimp				= require('jimp'),
		cloudinary	= require('cloudinary'),
		app					= express(),
		storage			= multer.diskStorage(
			{
				destination: function(req, res, callback) {
					callback(null, __dirname + '\\public\\tmp\\')
				},
				filename: function (req, file, callback) {
					callback(null, file.originalname);
				}
			}),
		upload 			= multer({storage:storage}).single('image');//,
		// limits			= multer.limits({
		// 								fieldNameSize : 50,
		// 								fieldSize : 512,
		// 								fields : 5,
		// 								fileSize : 1024,
		// 								files : 1,
		// 								parts : 10,
		// 								headerPairs : 1000
		// 							});
cloudinary.config({ 
  cloud_name: 'hmbv4mbj5', 
  api_key: '377132912383558', 
  api_secret: 'yC4AVG0Sx4gKoIUZwghWHSYRKLU' 
});

var logo = new jimp('public/tmp/loop_watermark.png', function (err, img) {
	err ? console.log('logo err' + err) : console.log('logo created and ready for use');
	return img.opacity(0.3);
});
// router = '/'
router.get('/', function (req, res) {
	res.render('index');
});
app.use('/',router);

// router = '/canvas'
router.get('/canvas', function (req, res) {
	res.render('canvas');
});
app.use('/canvas',router);

// router = '/api'
router.post('/upload', function (req, res) {
	upload(req, res, function(err) {
		err ? console.log(err) :
			console.log(req.file);
			res.redirect('/api/watermark/'+req.file.originalname);
	})
});
router.get('/watermark/:filename', (req, res)=>{
	var filename = req.params.filename;
	console.log(filename);
	jimp.read(__dirname + '/public/tmp/' + filename)
			.then((image)=>{
				image.clone()
					.contain(805,jimp.AUTO)
					.resize(805,jimp.AUTO)
					.crop(0,0,805,450)
					.composite(logo, 25, 20)
					.write(__dirname + '/public/tmp/slider-01.jpg', (err, success)=>{ err ? console.log(err) : console.log('image resized and saved successfully\n'+success)});
			})
			.then(()=>{ res.redirect('/'); })
			.catch((err)=>{
				console.log(err);
			});
})
app.use('/api',router);

// app parameters
app.set('views',__dirname + '/client/views');
app.set('view engine','ejs');
app.use('/public', express.static(__dirname + '/public'))
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/ngClient', express.static(__dirname + '/client/js'))

// declarations and setup commands
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() { console.log('app started at port ' + app.get('port')); });
// exports = module.exports = app;