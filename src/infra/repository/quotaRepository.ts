import {State} from "../../types";
import {Quota, User} from "../../domain";
import {Filesystem} from "../filesystem";

export class QuotaRepository {
  protected filePath: string = "recipients.json";
  constructor(protected persistence: Filesystem, protected state: State) {
  }

  public save(quota: Quota): void {
    const pos = this.state.quotas.findIndex((data) => data.user_id === quota.user_id);
    if (pos === -1) {
      this.state.quotas.push(quota.toDTO());
    } else {
      this.state.quotas[pos] = quota.toDTO();
    }
    this.persistence.save(this.filePath, this.state);
  }
}
