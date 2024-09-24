import { v4 as uuid } from 'uuid';
import Joi from "joi";
import {ValidationError} from "./exceptions";


export const RecipientSchema = Joi.object({
    id: Joi.string().uuid().required(),
    name: Joi.string().min(3).max(200).required(),
    email: Joi.string().email().required(),
    imageUrl: Joi.string().uri().required(),
    created: Joi.date().iso().required(),
    updated: Joi.date().iso().required(),
})

export interface RecipientDTO {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  created: Date;
  updated: Date;
}

export class Recipient {
  protected _props: RecipientDTO;

  private constructor(props: RecipientDTO) {
    const { error, value } = RecipientSchema.validate(props);
    if (error) {
      throw new ValidationError(`Recipient`, error.message);
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

  get imageUrl(): string {
    return this._props.imageUrl;
  }

  get created(): Date {
    return this._props.created;
  }

  get updated(): Date {
    return this._props.updated;
  }

  static create(props: Omit<RecipientDTO, "id">): Recipient {
    const data: RecipientDTO = {id: uuid(), ...props}
    return new Recipient(data);
  }

  public toDTO(): RecipientDTO {
    return this._props;
  }
}
