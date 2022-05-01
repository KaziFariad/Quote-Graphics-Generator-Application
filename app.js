import 'dotenv/config';
import handleStorage from './storage.js';
import { getQuote } from './quote.js';
import { getImageLink } from './image.js';

const id = handleStorage(process.env.CURRENT_VALUE);
const quote = await getQuote(process.env.QUOTES_DB, id);
getImageLink();

// const saveImage = () => {};
// const editImage = () => {};
