import fs from "fs";
import {createFakeRecipient, generateFakeUser} from "./mocks/mocker";
import {State} from "./types";
import {Recipient, User} from "./domain";

// Load existing recipients or create new ones
export const initialConfiguration = (): State => {
  const dataDir = "./src/data";
  const filePathUrl = `${dataDir}/recipients.json`;
  try {
    fs.accessSync(filePathUrl);
  } catch (err) {
    fs.mkdirSync("./src/data", { recursive: true });
    fs.writeFileSync(filePathUrl, "[]");
  }
  let save = false;

  const obj: State = JSON.parse(fs.readFileSync(filePathUrl, "utf8")) || {};

  // Try to extract recipients
  if (!obj.recipients) {
    const items = new Array(2000).fill(0).map(() => createFakeRecipient());
    obj.recipients = items.map((item) => Recipient.create(item).toDTO());
    save = true;
  }

  if (!obj.users) {
    save = true;
    const user = User.create(generateFakeUser());
    user.generateToken()
    obj.users = [user.toDTO()];
    console.log("User created: ", user.toDTO());
  }

  const endState: State = {
    recipients: obj.recipients,
    users: obj.users,
  };

  if (save) {
    fs.writeFileSync(filePathUrl, JSON.stringify({ ...obj }), "utf8");
  }

  return obj;
};
