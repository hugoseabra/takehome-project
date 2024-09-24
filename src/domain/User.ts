import {v4 as uuid} from 'uuid';
import Joi from "joi";
import {faker} from "@faker-js/faker";
import {ValidationError} from "./exceptions";
import * as _ from 'radash'


export const UserSchema = Joi.object({
  id: Joi.string().uuid().required().trim(),
  name: Joi.string().min(3).max(200).required().trim(),
  email: Joi.string().email().lowercase().required().trim(),
  created: Joi.date().required(),
  updated: Joi.date().required(),
  accessToken: Joi.string().alphanum().min(20).max(20).optional()
})


export interface UserDTO {
  id: string;
  name: string;
  email: string;
  created: Date;
  updated: Date;
  accessToken?: string;
}


export class User {
  protected _props: UserDTO;

  private constructor(props: UserDTO) {
    const {error, value} = UserSchema.validate(props);
    if (error) {
      throw new ValidationError(`User`, error.message);
    }
    this._props = value;
  }

  get id(): string {
    return this._props.id;
  }

  get name(): string {
    return this._props.name;
  }

  get email(): string {
    return this._props.email;
  }

  get created(): Date {
    return this._props.created;
  }

  get updated(): Date {
    return this._props.updated;
  }

  /**
   * Check if password matches.
   * @param access_token
   */
  public authorize(access_token: string): boolean {
    return this._props.accessToken === access_token;
  }

  public generateToken(): void {
    this._props.accessToken = faker.string.alphanumeric(20);
  }

  static create(props: Omit<UserDTO, "id">): User {
    const data: UserDTO = {...props, id: uuid()}
    return new User(data);
  }

  static reconstitute(data: UserDTO): User {
    return new User(data);
  }

  public toDTO(hide_access_token: boolean = false): UserDTO {
    return hide_access_token ? _.omit(this._props, ["accessToken"]) : this._props;
  }
}
