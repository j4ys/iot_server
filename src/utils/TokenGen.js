import { sign } from "jsonwebtoken";
import dotenv from "dotenv";

const ACCESS_TOKEN_SECRET =
  "sdfakjsdfhksahdfkjashfdkjlahfkjahfkjashfkjahfjasdfhkjasfh";
const REFRESH_TOKEN_SECRET =
  "jaskdjfklasdfqwueroiuweoiruqoiweurqemwrbmqwebrmnqwbermqwberhh";

dotenv.config();

const TokenGen = user => {
  const accessToken = sign({ userId: user.id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "35m"
  });
  const refreshToken = sign(
    { count: user.count, userId: user.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { refreshToken, accessToken };
};

export default TokenGen;
