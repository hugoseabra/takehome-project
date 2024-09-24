import { faker } from "@faker-js/faker";
import {RecipientDTO, UserDTO} from "../domain";

export const createFakeRecipient = (): Omit<RecipientDTO, "id"> => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    created: faker.date.past(),
    updated: faker.date.recent(),
    imageUrl: faker.image.url({
      height: 300,
      width: 300,
    }),
  };
};

export const generateAccessToken = (): string => {
  return faker.string.alphanumeric(20);
};

export const generateFakeUser = (): Omit<UserDTO, "id"> => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    created: faker.date.past(),
    updated: faker.date.recent(),
  };
};
