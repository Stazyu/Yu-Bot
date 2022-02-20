const base64ToImageConvert = require('base64-to-image');

const base64ToImage = async (base64, path, fileNameImage, type = 'png') => {
	const optionalObj = { fileName: fileNameImage, type: type };

	const { imageType, fileName } = await base64ToImageConvert(base64, path, optionalObj); // Only synchronous using
	return path + fileName
}

module.exports = { base64ToImage }
