import express from "express";
import morganMiddleware from "./middlewares/morgan.middleware.js";
import { errorHandler } from "./middlewares/globalError.middleware.js";
import cors from "cors";

const app = express();

app.use(morganMiddleware);


const corsOptions = {
  origin: function (origin, callback) {
    const whitelistedOrigins = [
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ];
    if (whitelistedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS "));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization" ],

};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // -> This line responds to the options sent by the browser during preflight

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));



// Routes
import storyRouter from "./routes/story.routes.js";
import userRouter from "./routes/user.routes.js";



app.use("/api/v1/users", userRouter);
app.use("/api/v1/stories", storyRouter);


app.use(errorHandler);
export { app };
