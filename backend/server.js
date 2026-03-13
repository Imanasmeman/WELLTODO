import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import { initializeEODCron } from './jobs/eodCron.js';
import { errorHandler } from './middleware/errorHandler.js';

const PORT = process.env.PORT || 5000;
app.use(errorHandler);
const startServer = async () => {
  try {
    await connectDB();
    initializeEODCron();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
