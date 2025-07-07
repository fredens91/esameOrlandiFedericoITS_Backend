import { badRequestHandler } from "./bad-request";
import { customHandler } from "./custom-error";
import { dotenvHandler } from "./dotenv";
import { entityAlradyExistHandler } from "./entity-altady-exist";
import { genericHandler } from "./generic";
import { notFoundHandler } from "./not-found";
import { notFoundUserHandler } from "./not-found-user";
import { validationErrorHandler } from "./validation";

export const errorHandlers = [
  notFoundHandler,
  entityAlradyExistHandler,
  validationErrorHandler,
  notFoundUserHandler,
  customHandler,
  dotenvHandler,
  badRequestHandler,
  genericHandler,
];
