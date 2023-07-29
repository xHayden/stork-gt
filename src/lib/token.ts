import { jwtVerify, jwtDecrypt, SignJWT } from 'jose';

export const verifyJWT = async <T>(token: string): Promise<T> => {
    try {
      return (
        await jwtVerify(
          token,
          new TextEncoder().encode(process.env.JWT_AUTH_SECRET)
        )
      ).payload as T;
    } catch (error) {
      console.log(error);
      throw new Error("Your token has expired.");
    }
  };
  

export const signJWT = async (
    payload: { sub: string },
    options: { exp: string }
  ) => {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_AUTH_SECRET);
      const alg = "HS256";
      return new SignJWT(payload)
        .setProtectedHeader({ alg })
        .setExpirationTime(options.exp)
        .setIssuedAt()
        .setSubject(payload.sub)
        .sign(secret);
    } catch (error) {
      throw error;
    }
  };
  