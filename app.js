import 'dotenv/config';
import handleStorage from './storage.js';
import { getQuote } from './quote.js';
import { getImageLink, saveImage, editImage } from './image.js';
import wwebpkgs from 'whatsapp-web.js';
const { Client, LocalAuth, MessageMedia } = wwebpkgs;
import qrcpkgs from 'qrcode-terminal';
const { qrcode } = qrcpkgs;

const imageMainFn = async () => {
	const id = handleStorage('counter.json');
	const quote = await getQuote('quotesDb.json', id);
	const imageLink = await getImageLink(process.env.API_KEY, id);
	const outputPath = `./images/image${id}.png`;
	await saveImage(imageLink, outputPath);
	const savedImagePath = await editImage(
		outputPath,
		quote[0].text,
		quote[0].author
	);
	return [savedImagePath, quote];
};

const client = new Client({
	authStrategy: new LocalAuth(),
});

client.initialize();

client.on('qr', (qr) => {
	qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
	console.log('AUTHENTICATED');
});

client.on('auth_failure', (msg) => {
	// Fired if session restore was unsuccessful
	console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', async () => {
	console.log('READY');
});

client.on('message', async (msg) => {
	if (msg.body == '!pic') {
		let [path, quote] = await imageMainFn();
		msg.reply('sending a quote graphic picture...');
		let chat = await msg.getChat();
		// await new Promise((r) => setTimeout(r, 10000));
		const media = MessageMedia.fromFilePath(path);
		chat.sendMessage(media, { caption: quote[0].text });
	}
});

// client.destroy();
