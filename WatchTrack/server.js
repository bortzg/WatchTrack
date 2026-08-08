import config from "./config/config.js";
import app from "./server/express.js";
import mongoose from "mongoose";
mongoose.Promise = global.Promise;

async function startServer() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);

    app.listen(config.port, () => {
      console.info("Server started on port %s.", config.port);
    });
  } catch (error) {
    console.error("Unable to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
