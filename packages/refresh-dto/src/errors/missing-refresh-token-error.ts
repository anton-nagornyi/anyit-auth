export class MissingRefreshTokenError extends Error {
  constructor() {
    super('Refresh token is missing');
  }

  code = 'MISSING_REFRESH_TOKEN';
}
