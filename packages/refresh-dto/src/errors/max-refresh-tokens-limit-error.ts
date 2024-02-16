export class MaxRefreshTokensLimitError extends Error {
  constructor() {
    super('Maximum limit of issued refresh tokens is reached');
  }

  code = 'MAX_REFRESH_TOKENS_LIMIT_ERROR';
}
