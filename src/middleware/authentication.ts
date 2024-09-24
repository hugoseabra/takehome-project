import {NextFunction, Request, Response} from "express";
import {UserService} from "../application/UserService";
import {
  BadFormatException,
  ForbiddenException,
  NotFoundException, ServiceException,
  UnauthorizedException
} from "../application/exceptions";
import {RequestWithUser} from "./request";


export const authentication = (userService: UserService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authValue = req.headers["authorization"];
      if (!authValue) {
        throw new UnauthorizedException(
          "Auth",
          "Authentication Error - Missing Authorization Header"
        );
      }
      const [tokenKey, accessToken] = authValue.split(" ");
      if (tokenKey !== "Bearer") {
        throw new UnauthorizedException(
          "Auth",
          "Authentication Error - Invalid Token Key"
        );
      }

      const user = userService.authenticate(accessToken);
      Object.assign(req, { user: user });
      next();
    } catch (error) {
      switch (true) {
        case error instanceof NotFoundException:
          res.status(404).json({error: error, message: error.message})
          break;
        case error instanceof UnauthorizedException:
          res.status(401).json({error: error, message: error.message})
          break;
        case error instanceof ForbiddenException:
          res.status(403).json({error: error, message: error.message})
          break;
        case error instanceof BadFormatException:
          res.status(422).json({error: error, message: error.message})
          break;
        case error instanceof ServiceException:
          res.status(400).json({error: error, message: error.message})
          break;
        default:
          throw error
      }
    }
  };
};
