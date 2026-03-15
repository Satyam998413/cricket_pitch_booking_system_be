import jwt from "jsonwebtoken";
import { config } from "../../config/config.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/responseHandler.js";
import { refreshTokenStore } from "./sessionHandler.js";
import { MongoDBStatus } from "../../config/db/mongodb.config.js";

export const generateTokens = asyncHandler("generateTokens", async (user) => {
  const payload = { role: user.role };
  const accessToken = jwt.sign(payload, config.secrets.accessToken, {
    expiresIn: config.secrets.expiryAccessToken,
  });
  const refreshToken = jwt.sign(payload, config.secrets.refreshToken, {
    expiresIn: config.secrets.expiryRefreshToken,
  });
  refreshTokenStore.set(accessToken, { refreshToken: refreshToken });
  return ApiResponse({ accessToken, refreshToken });
});

const validateAccessToken = asyncHandler(
  "validateAccessToken",
  async (token) => {
    let tokenDetails = jwt.verify(token, config.secrets.accessToken);
    return ApiResponse(tokenDetails);
  }
);

const validateRefreshToken = asyncHandler(
  "validateRefreshToken",
  async (token) => {
    let tokenDetails = jwt.verify(token, config.secrets.refreshToken);
    return ApiResponse(tokenDetails);
  }
);

export const validateToken = async (req, res, next) => {
  try {
    if (
      req.url.includes("login")
    ) {
      return next();
    }
    let authorization = req.headers.authorization;
    let payload = {};
    if (!authorization || Object.keys(authorization).length === 0) {
      return res.status(401).json({ error: 'Unauthorized', message:'Token is required'  })
    }
    if (authorization.startsWith("Bearer")) {
      authorization = authorization.split("Bearer ")[1];
    }
     // Expiry Access Token then get refresh Token and regenerate access token after save and return accessToken and data by Error code 401
     let refreshTokenData = await refreshTokenStore.get(authorization);
     if (!refreshTokenData) {
       // No Token Exist or unauthorized
       return res.status(401).json({ error: 'Unauthorized', message:'Token expired or invalid'})
    }
    if (req.url.includes("logout")) {
      refreshTokenStore.destroy(authorization);
      return res.send(ApiResponse(null,"Logout successfully...!"));
    }

    let resultVerifyAccessToken = await validateAccessToken(authorization);
    if (resultVerifyAccessToken.success) {
      req.user = resultVerifyAccessToken.data;
      if (!MongoDBStatus.isConnected) {
        return res.status(700).json({
          message: "Internal Server Error. Failed to connect database.",
          error: "Database Connection Failures",
        });
      }
      if (!req.url.includes("generate-access-token")) {
        return next();
      }
    }
    if (!req.url.includes("generate-access-token")) {
      // here expired token then call regenerate api call
      return res.status(402).json({
        message: "Token Expired , regenerate access token...!",
        error: "TokenExpired",
      });
    }
    //  if call auth/generate-access-token then generate new token
    let resultVerifyRefreshToken = await validateRefreshToken(
      refreshTokenData.refreshToken
    );
    if (!resultVerifyRefreshToken.success) {
      // if expire refresh token
      await refreshTokenStore.destroy(authorization);
      return res.status(403).json({ error: 'Forbidden', message: "Refresh token expired, please log in again." })
    }
    delete resultVerifyRefreshToken.data.iat
    delete resultVerifyRefreshToken.data.exp
    // generate new token
    let newAccessToken = jwt.sign(resultVerifyRefreshToken.data, config.secrets.accessToken, {
      expiresIn: config.secrets.expiryAccessToken,
    });
    await refreshTokenStore.destroy(authorization);
    await refreshTokenStore.set(newAccessToken, refreshTokenData);
    return res.send({ token: newAccessToken });
  } catch (e) {
    return res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong' })
  }
};

setInterval(async () => {
  let sessionsData = await refreshTokenStore.getAll();
  let sessions = Object.keys(sessionsData);
  sessions.map(async (session) => {
    let resultValidation = await validateRefreshToken(
      sessionsData[session].refreshToken
    );
    if (!resultValidation.success) {
      console.log("Enter Destroy");
      await refreshTokenStore.destroy(session);
    }
  });
}, 1*60*60*1000);//1 hr check session expiry
