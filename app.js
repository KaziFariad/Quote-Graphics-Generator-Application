import 'dotenv/config';
import handleStorage from './storage.js';
import { readFile } from 'fs';

const id = handleStorage(process.env.CURRENT_VALUE);

const getQuote = (fileName, id) => {
	readFile(fileName, 'utf8', (err, response) => {
		if (err) {
			console.error(err);
			return;
		}
		const data = JSON.parse(response);
		console.log(data.slice(id, id + 1));
	});
};

getQuote(process.env.QUOTES_DB, id);

const getImageLink = () => {};
const saveImage = () => {};
const editImage = () => {};
