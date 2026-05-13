import morgan from "morgan";
import logger from "../logger.js";

const format = ":method :url :status :res[content-length]b - :response-time ms";
//  "GET /api/users 200 452b - 12ms"

const stream = {
  write: (message) => logger.http(message.trim()),
};


const morganMiddleware = morgan(format, { stream });

export default morganMiddleware;
