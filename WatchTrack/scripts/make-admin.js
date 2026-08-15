import mongoose from "mongoose";
import config from "../config/config.js";
import User from "../server/models/user.model.js";

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error("Usage: npm run make-admin -- user@example.com");
  process.exit(1);
}

try {
  await mongoose.connect(config.mongoUri);
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { role: "admin", updated: Date.now() } },
    { new: true }
  );

  if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exitCode = 1;
  } else {
    console.log(`${user.email} is now an admin.`);
  }
} catch (error) {
  console.error(`Could not promote user: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
