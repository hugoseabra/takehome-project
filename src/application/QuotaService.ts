import {Quota, QuotaDTO, UserDTO} from "../domain";
import {State} from "../types";
import {ValidationError} from "../domain/exceptions";
import {CreateUserDTO} from "../schemas";
import {NotFoundException, BadFormatException, UnauthorizedException} from "./exceptions";
import {UserRepository} from "../infra/repository/userRepository";
import {Filesystem} from "../infra/filesystem";
import {QuotaRepository} from "../infra/repository";


export class QuotaService {
  protected repository: QuotaRepository

  constructor(protected state: State) {
    const filesystem = new Filesystem("./src/data");
    this.repository = new QuotaRepository(filesystem, state)
  }

  /**
   * Returns all users
   */
  public get_by_user(user_id: string): QuotaDTO | undefined {
    const quota = this.state.quotas.filter(data => data.user_id == user_id);
    return quota ? Quota.reconstitute(quota[0]).toDTO() : undefined;
  }

  public getOrCreate(user_id: string): QuotaDTO {
    const quota = this.get_by_user(user_id);
    if (quota) {
      return quota;
    }

    const newQuota = Quota.create({user_id: user_id});
    this.repository.save(newQuota);
    return newQuota.toDTO();
  }

  public increment(quota: QuotaDTO): void {
    const instance = Quota.reconstitute(quota);
    instance.used += 1;
    this.repository.save(instance);

    if (instance.isReached()) {
      throw new UnauthorizedException("Quota", "Quota reached");
    }
  }
}
