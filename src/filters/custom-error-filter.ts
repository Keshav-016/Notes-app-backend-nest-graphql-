import { GraphQLError } from 'graphql';

class CustomError extends GraphQLError {
  message: string;
  extensions: { code: string };
  constructor(code: string, message: string) {
    super(message);
    this.message = message;
    this.extensions = {
      code: code,
    };
  }
}
export default CustomError;
