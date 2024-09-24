import { v4 as uuid } from 'uuid';
import Joi from "joi";
import {ValidationError} from "./exceptions";


export const QuotaSchema = Joi.object({
    id: Joi.string().uuid().required(),
    user_id: Joi.string().uuid().required(),
    maximum: Joi.number().max(100000).default(65).optional(),
    used: Joi.number().min(0).max(100000).default(0).optional(),
})

export interface QuotaDTO {
  id: string;
  user_id: string;
  maximum?: number;
  used?: number;
}

export class Quota {
  protected _props: QuotaDTO;

  private constructor(props: QuotaDTO) {
    const { error, value } = QuotaSchema.validate(props);
    if (error) {
      throw new ValidationError(`Quota`, error.message);
    }
    this._props = value;
  }

  get id(): string {
    return this._props.id;
  }

  get used(): number {
    return this._props.used as number;
  }

  set used(value: number) {
    this._props.used = value;
  }

  get user_id(): string {
    return this._props.user_id;
  }

  public isReached(): boolean {
    return (this._props.used as number) >= (this._props.maximum as number);
  }

  static create(props: Omit<QuotaDTO, "id">): Quota {
    const data: QuotaDTO = {id: uuid(), ...props}
    return new Quota(data);
  }

  static reconstitute(data: QuotaDTO): Quota {
    return new Quota(data);
  }

  public toDTO(): QuotaDTO {
    return this._props;
  }
}
