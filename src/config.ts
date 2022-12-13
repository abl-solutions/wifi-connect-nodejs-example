export const appConfig = {
  oidc: {
    issuer: process.env.OIDC_ISSUER as string,
    jwksUrl: process.env.OIDC_JWKS_URL as string,
    audience: process.env.OIDC_AUDIENCE as string,
    scopes: (process.env.OIDC_SCOPES as string).split(/\s+/),
  },
  server: {
    port: Number(process.env.PORT) || 8080,
  },
};
