// cnpm i imagemin imagemin-jpegtran imagemin-pngquant
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')

imagemin(['assets/posts/20180202/*.{jpg,png}'], 'dist', {
	plugins: [
		imageminJpegtran(),
		imageminPngquant({quality: '65-75'})
	]
}).then(files => {
	console.log(files)
	//=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
})