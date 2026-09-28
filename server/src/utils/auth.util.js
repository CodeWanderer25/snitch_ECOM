import jwt from "jsonwebtoken";
import config from "../config/config.js";

const createAccessToken = ({ userId, role }) => {
    const accessToken = jwt.sign(
        { userId, role },
        config.ACCESS_TOKEN,
        { expiresIn: "45m" }
    );

    return accessToken;
};

const createRefreshToken = ({ userId, role }) => {
    const refreshToken = jwt.sign(
        { userId, role },
        config.REFRESH_TOKEN,
        { expiresIn: "7d" }
    );

    return refreshToken;
};

const readRefreshToken = (refreshToken) => {
    return  jwt.verify(refreshToken , config.REFRESH_TOKEN)
    
}

const readAccessToken = (accessToken) => {
    return jwt.verify(accessToken , config.ACCESS_TOKEN)
}


export  {createAccessToken , createRefreshToken , readRefreshToken , readAccessToken};
