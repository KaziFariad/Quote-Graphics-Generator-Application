import { readFile, writeFile } from 'fs';

readFile('./quotesDb.json', 'utf8', (err, response) => {
	if (err) {
		console.error(err);
		return;
	}
	const data = JSON.parse(response);
	console.log(data.slice(0, 3), data.slice(-2));
});
