import Jimp from 'jimp';

export const analyzeColour = (hex) => {
	if (hex.indexOf('#') === 0) {
		hex = hex.slice(1);
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error('Invalid HEX color.');
	}
	var r = parseInt(hex.slice(0, 2), 16),
		g = parseInt(hex.slice(2, 4), 16),
		b = parseInt(hex.slice(4, 6), 16);

	return r * 0.299 + g * 0.587 + b * 0.114 > 186;
};

export const displayTextOnImage = (
	image,
	font,
	x,
	y,
	textToDisplay,
	maxWidth,
	maxHeight
) => {
	image.print(
		font,
		x,
		y,
		{
			text: textToDisplay,
			alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
			alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
		},
		maxWidth,
		maxHeight
	);
};
