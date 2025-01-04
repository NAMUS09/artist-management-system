type HttpCode = 400 | 404 | 500 | 401 | 403 | 422 | 409 | 200 | 201 | 204;

class CustomError extends Error {
  code: HttpCode;

  constructor(message: string, code?: HttpCode) {
    super(message);
    this.code = code ?? 400;
    this.name = this.constructor.name;
  }
}

export default CustomError;
