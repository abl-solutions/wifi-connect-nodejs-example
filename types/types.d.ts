declare global {
  namespace Express {
    export interface Request {
      auth?: {
        scp?: string[];
      };
    }
  }
}

export {};
