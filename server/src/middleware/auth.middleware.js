import { readAccessToken } from "../utils/auth.util.js";

const authenticate = (req, res, next) => {
    const accessToken= req.headers.authorization?.split(" ")[1];
    console.log("auth",accessToken)

    if (!accessToken) {
        return res.status(401).json({
            message: "Access token not found",
        });
    }

    try {
        const decoded = readAccessToken(accessToken);

        req.user = decoded;
        next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token",
        });
    }
};

export default authenticate;
