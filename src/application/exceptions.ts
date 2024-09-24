export class ServiceException extends Error {
  constructor(public alias: string, message: string) {
    super(message)
  }
}


export class NotFoundException extends ServiceException {

}

export class BadFormatException extends ServiceException {

}

export class UnauthorizedException extends ServiceException {

}

export class ForbiddenException extends ServiceException {

}
