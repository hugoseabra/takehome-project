import {State} from "../../types";
import {User} from "../../domain";
import {Filesystem} from "../filesystem";

export class UserRepository {
  protected filePath: string = "recipients.json";
  constructor(protected persistence: Filesystem, protected state: State) {
  }

  public save(user: User): void {
    this.state.users.push(user.toDTO());
    this.persistence.save(this.filePath, this.state);
  }
}
