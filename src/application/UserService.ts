import {User, UserDTO} from "../domain";
import {State} from "../types";
import {ValidationError} from "../domain/exceptions";
import {CreateUserDTO} from "../schemas";
import {NotFoundException, BadFormatException, UnauthorizedException} from "./exceptions";
import {UserRepository} from "../infra/repository/userRepository";
import {Filesystem} from "../infra/filesystem";


export class UserService {
  protected repository: UserRepository

  constructor(protected state: State) {
    const filesystem = new Filesystem("./src/data");
    this.repository = new UserRepository(filesystem, state)
  }

  /**
   * Returns all users
   */
  public all(): UserDTO[] {
    const users = this.state.users.map(data => User.reconstitute(data));
    return users.map(user => user.toDTO(true));
  }

  /**
   * Gets user by ID
   */
  public get(id: string, raise: boolean = false): UserDTO | undefined {
    const user = this.state.users.find(user => user.id === id);
    if (!user) {
      if (raise) {
        throw new NotFoundException('User',`User with ID '${id}' not found`)
      }
      return;
    }
    return User.reconstitute(user).toDTO(true);
  }

  public get_by_email(email: string, raise: boolean = false): UserDTO | undefined {
    const user = this.state.users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      if (raise) {
        throw new NotFoundException('User',`User with Email: ${email} not found`)
      }
      return;
    }
    return User.reconstitute(user).toDTO(true);
  }

  public authenticate(accessToken: string): UserDTO | undefined {
    const user = this.state.users.find(user => user.accessToken === accessToken);
    if (!user) {
        throw new UnauthorizedException('User',`Authentication failed`)
    }
    return User.reconstitute(user).toDTO(true);
  }

  public buildDTO(data: CreateUserDTO, id?: string): UserDTO {
    const {name, email} = data;
    return {
      id: id as string,
      name,
      email,
      created: new Date(),
      updated: new Date()
    }
  }

  /**
   * Creates a new user
   * @param data - User data
   * @throws ServiceException
   */
  public create(data: Omit<UserDTO, "id">): UserDTO {
    try {
      const instance = User.create(data);
      instance.generateToken();

      const savedData = instance.toDTO();
      this.repository.save(instance)
      return savedData

    } catch (error) {
      if (error instanceof ValidationError) {
        throw new BadFormatException("User", error.message)
      }
      throw error
    }
  }
}
