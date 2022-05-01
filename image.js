import { createClient } from 'pexels';
import { createWriteStream } from 'fs';
import axios from 'axios';
import * as stream from 'stream';
import { promisify } from 'util';
import Jimp from 'jimp';

export const getImageLink = async (key, id) => {
	const client = createClient(key);
	const query = 'Nature';
	const page = id;
	const orientation = 'portrait';

	const photos = await client.photos.search({
		orientation,
		page,
		per_page: 1,
		query,
	});

	const imageLink = photos.photos[0].src[orientation];
	return imageLink;
};

const finished = promisify(stream.finished);

export const saveImage = async (imageURL, outputLocationPath) => {
	const writer = createWriteStream(outputLocationPath);
	return axios({
		method: 'get',
		url: imageURL,
		responseType: 'stream',
	}).then((response) => {
		response.data.pipe(writer);
		return finished(writer);
	});
};

export const editImage = async (filePath, text) => {
	console.log('editing image in', filePath);
	const image = await Jimp.read(filePath);
	image.resize(1080, Jimp.AUTO);
	const font = await Jimp.loadFont('./fonts/BebasNeue.fnt');
	const [x, y] = [0, 0];
	const content = text;
  const [maxWidth, maxHeight] = [700, 700];
  
	const filePathTempPos = filePath.indexOf('.', 1);
	const newFilePath =
		filePath.slice(0, filePathTempPos) +
		'updated' +
		filePath.slice(filePathTempPos);
	image.print(
		font,
		x,
		y,
		{
			text: content,
			alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
			alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
		},
		maxWidth,
		maxHeight
	);
	image.write(newFilePath);
};
