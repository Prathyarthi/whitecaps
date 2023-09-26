import app from './app.js';
import { config } from 'dotenv';
config();
import connectToDB from './config/dbConfig.js';
import cloudinary from 'cloudinary';

const PORT = process.env.PORT || 8000

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

app.listen(PORT, async () => {
    await connectToDB();
    console.log(`App listening on port ${PORT}`)
});