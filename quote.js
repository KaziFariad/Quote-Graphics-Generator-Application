import { promises } from 'fs';
const { readFile } = promises;

export const getQuote = async (fileName, id) => {
	try {
		const response = await readFile(fileName, 'utf8');
		const data = JSON.parse(response);
		const quote = data.slice(id, id + 1);
		return quote;
	} catch (e) {
		console.error(e);
	}
};
