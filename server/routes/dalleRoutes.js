import express from 'express';
import * as dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const router = express.Router();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
  
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello from DALL-E!' });
});

  
router.post('/', async (req, res) => {
    console.log('POST /api/v1/dalle called with body:', req.body);
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ message: 'Invalid prompt' });
      }
  
      console.log('Sending prompt to OpenAI:', prompt);
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      });
      console.log('OpenAI response:', response);
  
      const image = response?.data?.[0]?.b64_json ?? null;
      if (image) {
        res.status(200).json({ photo: image });
      } else {
        console.log('No image data found in response:', response);
        res.status(404).json({ message: 'No image generated' });
      }
    } catch (error) {
      console.error('Error in POST /api/v1/dalle:', error);
      res.status(500).send('Something went wrong');
    }
});



export default router;

