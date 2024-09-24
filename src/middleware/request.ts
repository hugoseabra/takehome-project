import { Request } from "express";
import {UserDTO} from "../domain";

export interface RequestWithUser extends Request {
  user: UserDTO;
}
