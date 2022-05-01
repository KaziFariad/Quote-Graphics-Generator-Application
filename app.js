import 'dotenv/config';
import handleStorage from './storage.js';
import { getQuote } from './quote.js';
import { getImageLink, saveImage } from './image.js';

const id = handleStorage(process.env.CURRENT_VALUE);
const quote = await getQuote(process.env.QUOTES_DB, id);
const imageLink = await getImageLink(process.env.API_KEY, id);
const outputPath = `./images/image${id}.png`;
saveImage(imageLink, outputPath);

// const editImage = () => {};
