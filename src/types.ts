import {RecipientDTO, UserDTO, QuotaDTO} from "./domain";

export interface State {
  recipients: RecipientDTO[];
  users: UserDTO[];
  quotas: QuotaDTO[];
}
