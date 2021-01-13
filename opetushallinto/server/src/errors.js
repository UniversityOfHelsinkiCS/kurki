import ExtendableError from 'es6-error';

export class ApplicationError extends ExtendableError {
  constructor(message, properties, status = 500) {
    super(message);

    this.properties = properties;
    this.status = status;
  }

  toJSON() {
    return {
      message: this.message,
      properties: this.properties !== undefined ? this.properties : null,
    };
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message, properties) {
    super(message, properties, 403);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message, properties) {
    super(message, properties, 404);
  }
}

export class UserInputError extends ApplicationError {
  constructor(message, properties) {
    super(message, properties, 400);
  }
}
