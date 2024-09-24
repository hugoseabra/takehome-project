import express from "express";
import {mockService} from "./infra/wrappers/mockService/server";
import {State} from "./types";
import {initialConfiguration} from "./utils";
import {QuotaService, UserService} from "./application";
import {CreateUserDTO} from "./schemas";
import {
  BadFormatException,
  ForbiddenException,
  NotFoundException,
  ServiceException,
  UnauthorizedException
} from "./application/exceptions";
import {authentication, ratePerDay, ratePerMinute} from "./middleware";
import {MockWrapper, MockWrapperException} from "./infra/wrappers/mockWrappers";
import {addQuotaCounter} from "./middleware/quota";

// Welcome to your express server. We'll be adding some methods over here to design a robust API system in place!
const app = express();
app.use(express.json());
const port = 8080;

// NOTE: We'll be using this state variable to store the recipients. This is a simple in-memory store.
const state: State = initialConfiguration();

// A mock service that is used to simulate a real service integration.
const service = mockService;

const userService = new UserService(state)
const quotaService = new QuotaService(state)

app.get("/", (req, res) => {
  res.send("Good luck 💥!");
});

// ********************
// User Routes
// ***

/**
 * Get all users
 */
app.get("/api/users", async (req, res) => {
  res.json(userService.all());
});

/**
 * Get user by ID
 */
app.get("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = userService.get(id, true)
    res.json(user);
  } catch (error) {
    if (error instanceof ServiceException) {
      res.status(404).json({error: error, message: error.message})
      return;
    }
    throw error
  }
});

/**
 * Create a new user
 */
app.post("/api/users", async (req, res) => {
  try {
    const data = userService.buildDTO(req.body as CreateUserDTO);
    const existingUser = userService.get_by_email(data.email);
    if (existingUser) {
      res.status(400).json({message: `User with e-mail '${data.email}' already exists`})
      return;
    }
    const user = userService.create(data)
    res.json(user);
  } catch (error) {
    switch (true) {
      case error instanceof NotFoundException:
        res.status(404).json({error: error, message: error.message})
        break;
      case error instanceof UnauthorizedException:
        res.status(401).json({error: error, message: error.message})
        break;
      case error instanceof ForbiddenException:
        res.status(403).json({error: error, message: error.message})
        break;
      case error instanceof BadFormatException:
        res.status(422).json({error: error, message: error.message})
        break;
      case error instanceof ServiceException:
        res.status(400).json({error: error, message: error.message})
        break;
      default:
        throw error
    }
  }
});

// ********************
// Resource Routes
// ***

// Get all recipients
app.get("/api/recipients", async (req, res) => {
  res.json(state.recipients);
});

// Submit a recipient for processing
// TODO(SHIP): Implement the submit endpoint
app.post(
  "/api/submit",
  authentication(userService),
  addQuotaCounter(quotaService),
  ratePerDay,
  ratePerMinute,
  async (req, res) => {
    const wrapper = new MockWrapper(service.url);

    const body = req.body;
    const id = "fakeid";

    // TODO(SHIP): Call the submit endpoint
    try {
      const jsonRes = await wrapper.send(id);
      res.json(jsonRes);
    } catch (error) {
      if (error instanceof MockWrapperException) {
        res.status(error.status).json({error: error, message: error.message})
        return;
      }
      throw error;
    }
  }
);

// **
// Running the app & ancillary service
// *

service.start();
app.listen(port, () => {
  console.log(`✅ Your API has loaded at http://localhost:${port}`);
});
