import { sign } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const TokenGen = user => {
  const accessToken = sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "35m" }
  );
  const refreshToken = sign(
    { count: user.count, userId: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { refreshToken, accessToken };
};

export default TokenGen;
