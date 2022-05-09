import { createClient } from 'pexels';
import { createWriteStream } from 'fs';
import * as stream from 'stream';
import { promisify } from 'util';
import Jimp from 'jimp';
import axios from 'axios';
import { analyzeColour } from './utils.js';

let prominentColour;

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

  prominentColour = photos.photos[0].avg_color;
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

export const editImage = async (filePath, quote, author) => {
  console.log('editing image in', filePath);
  const image = await Jimp.read(filePath);
  image.resize(1080, Jimp.AUTO);
  const lightfont = await Jimp.loadFont('./fonts/BebasNeue.fnt');
  const darkFont = await Jimp.loadFont('./fonts/BebasNeueDark.fnt');
  const lightFontForAuthorName = await Jimp.loadFont(
    './fonts/BebasNeueNameLight.fnt'
  );
  const darkFontForAuthorName = await Jimp.loadFont(
    './fonts/BebasNeueNameDark.fnt'
  );
  let font, fontInverse, mode, authorNameFont, authorNameFontInverse;

  if (analyzeColour(prominentColour)) {
    font = darkFont;
    fontInverse = lightfont;
    mode = 'brighten';
    authorNameFont = darkFontForAuthorName;
    authorNameFontInverse = lightFontForAuthorName;
  } else {
    font = lightfont;
    fontInverse = darkFont;
    mode = 'darken';
    authorNameFont = lightFontForAuthorName;
    authorNameFontInverse = darkFontForAuthorName;
  }
  const [x, y] = [200, 200];
  const [maxWidth, maxHeight] = [700, 1000];
  const offsetForShadow = 3;
  const offsetForAuthorName = 400;
  const filePathTempPos = filePath.indexOf('.', 1);
  const newFilePath =
    filePath.slice(0, filePathTempPos) +
    'updated' +
    filePath.slice(filePathTempPos);
  image.color([{ apply: mode, params: [10] }]);
  image.print(
    fontInverse,
    x,
    y,
    {
      text: quote,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    maxWidth,
    maxHeight,
    (err, image, { a, b }) => {
      image.print(
        font,
        x - offsetForShadow,
        y - offsetForShadow,
        {
          text: quote,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        },
        maxWidth,
        maxHeight
      );
    }
  );
  image.print(
    authorNameFontInverse,
    x,
    maxHeight - offsetForAuthorName,
    {
      text: '-- ' + author,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    maxWidth,
    maxHeight,
    (err, image, { a, b }) => {
      image.print(
        authorNameFont,
        x - offsetForShadow,
        maxHeight - offsetForAuthorName - offsetForShadow,
        {
          text: '-- ' + author,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
        },
        maxWidth,
        maxHeight
      );
    }
  );

  image.write(newFilePath);
};
