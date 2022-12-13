import { RequestHandler } from 'express';
import { expressjwt, GetVerificationKey } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { appConfig } from '../config';

// Create validation of the access token from authorization header.
export function getWebhookMiddlewares(): RequestHandler[] {
  const jwtValidation = expressjwt({
    secret: jwksRsa.expressJwtSecret({
      jwksUri: appConfig.oidc.jwksUrl,
      jwksRequestsPerMinute: 5,
      rateLimit: true,
      cache: true,
    }) as GetVerificationKey,
    // Validate the audience.
    audience: appConfig.oidc.audience,
    // Validate the issuer.
    issuer: appConfig.oidc.issuer,
    algorithms: ['RS256'],
  });

  const scopeValidation: RequestHandler = (req, res, next) => {
    try {
      // Validate the scopes.
      // Scopes property may be different in your access token.
      if (!req.auth?.scp) {
        throw new Error('Access token does not include "scp" property');
      }

      const scopesSet = new Set(req.auth.scp);
      const hasRequiredScopes = appConfig.oidc.scopes.every((scope) => scopesSet.has(scope));
      if (!hasRequiredScopes) {
        throw new Error('Access token does not include required scopes');
      }

      next();
    } catch (ex) {
      console.error(ex);
      res.status(403).send(ex.message);
    }
  };

  return [jwtValidation, scopeValidation];
}