// Rate limiter mock for a service
import {NextFunction, Request, Response} from "express";
import {QuotaService} from "../application/QuotaService";
import {UserDTO} from "../domain";
import {UnauthorizedException} from "../application/exceptions";


export const addQuotaCounter = (quotaService: QuotaService) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if ("user" in req) {
      const user = req.user as UserDTO;
      const quota = quotaService.getOrCreate(user.id);
      try {
        quotaService.increment(quota);
      } catch (e) {
        if (e instanceof UnauthorizedException) {
          res
            .status(403)
            .send({
              error: {alias: e.alias},
              message: "Quota reached, please upgrade your plan."
            });
          return;
        }
      }
    }
    return next()
  }
};
