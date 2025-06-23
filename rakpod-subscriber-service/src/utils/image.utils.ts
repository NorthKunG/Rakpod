import { Response } from 'express';
import { join } from 'path';
import { existsSync, createReadStream } from 'fs';

export const downloadImage = (name: string, res: Response) => {
  const imagePath = join(__dirname, '../../assets/images/', name);

  console.log(imagePath)
  if (!existsSync(imagePath)) {
    return res.status(404).send('Image not found');
  }

  res.setHeader('Content-Disposition', `attachment; filename="${name}"`);
  const fileStream = createReadStream(imagePath);
  fileStream.pipe(res);
};