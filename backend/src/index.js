import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    server.on("error", (err) => {
      console.error("Server runtime error:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("Startup failed:", error);
    process.exit(1);
  }
};

startServer();
