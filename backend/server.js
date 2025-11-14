import {} from 'dotenv/config';
import app from './app.js';
import connect from './src/config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connect(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`The server is running on port ${PORT}`);
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();
