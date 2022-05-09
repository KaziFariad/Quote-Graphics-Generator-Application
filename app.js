import 'dotenv/config';
import handleStorage from './storage.js';
import { getQuote } from './quote.js';
import { getImageLink, saveImage, editImage } from './image.js';

for (let i = 0; i < 10; i++) {
  const id = handleStorage('counter.json');
  const quote = await getQuote('quotesDb.json', id);
  const imageLink = await getImageLink(process.env.API_KEY, id);
  const outputPath = `./images/image${id}.png`;
  await saveImage(imageLink, outputPath);
  await editImage(outputPath, quote[0].text, quote[0].author);
}
