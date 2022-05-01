import { createClient } from 'pexels';
import { createWriteStream } from 'fs';
import axios from 'axios';
import * as stream from 'stream';
import { promisify } from 'util';

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
