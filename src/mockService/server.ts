import express from "express";
import { rateLimit } from "express-rate-limit";

const app = express();
export const mockPort = 8888;

// Interface for Service API
interface MockServiceInterface {
  url: string;
  start: () => void;
}

// Rate limiter mock for a service
const limiter = rateLimit({
  windowMs: 30 * 1000, // 1 minute
  max: 20, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    res
      .status(429)
      .send({ message: "Too many requests, please try again later." });
  },
});

// Mock service
export const mockService: MockServiceInterface = {
  url: `http://localhost:${mockPort}`,
  start: () => {
    app.listen(mockPort, () => {
      console.log(
        `ℹ️ Mock service has started at http://localhost:${mockPort}`
      );
    });
  },
};

// Use Body parser
app.use(express.json());
app.use(limiter);

// This is a mock service that will be used to simulate a real API. All of your code can be run locally
app.get("/", (req, res) => {
  res.send("Good luck!");
});

// This is a process endpoint that will fail some requests
app.post("/process", async (req, res) => {
  console.log(req.body);
  // Get id from request
  const id = req.body.id;

  // Make sure id exists
  if (!id) {
    res.status(400).send({ message: "Id is required" });
    return;
  }

  // Return a 500 response every 1 out of 10 times in order to simulate a server error
  if (Math.random() > 0.8) {
    res.status(500).send({ message: "Internal server error, please retry" });
    return;
  }

  // 1 out of 20 times, delay the request by 10 seconds to simulate a slow server
  const slowService = Math.random() > 0.8;
  if (slowService) {
    setTimeout(() => {
      res.json({ status: "processed" });
    }, 10000);
    return;
  }

  res.json({ status: "processed" });
});
