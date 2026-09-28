import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs"
import {createAccessToken ,createRefreshToken, readRefreshToken} from '../utils/auth.util.js'

const registerController = async (req , res) => {
    
    const { email, name, password } = req.body;
    
    const isUserExist = await UserModel.findOne({ email })
    
    if (isUserExist) {
        return res.status(400).json({
            message: "User Already Exist",
            errors: [
                {
                    field: "email",
                    message:"User Already Exist"
                }
            ]
        })
    }



    const user = await UserModel.create({
        email,
        name,
        passwordHash:  await bcrypt.hash(password , 12)
    })

    const accessToken = createAccessToken({
        userId: user._id,
        role: user.role
    })

    const refreshToken = createRefreshToken({
        userId: user._id,
        role: user.role
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true
    });

    await UserModel.findByIdAndUpdate(user._id, {
        refreshToken
    })


    return res.status(201).json({
        message: "User Registered Successfully",
        data: {
            user: {
                email: user.email,
                name: user.name,
                id:user._id
            },
            accessToken
        }
    })
}

const loginController = async (req, res) => {
    
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email })
    
    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            errors: [
                {
                    field: "email",
                    message:"User Not Found"
                }
            ]
        })
    }   

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    
    if (!isPasswordValid) {
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    const accessToken = createAccessToken({
        userId: user._id,
        role: user.role
    })
    
    const refreshToken = createRefreshToken({
        userId: user._id,
        role: user.role
    })

    await UserModel.findByIdAndUpdate(user._id, {
        refreshToken
    })


    res.cookie("refreshToken", refreshToken, {
        httpOnly: true
    })

    return res.status(201).json({
        message: "User Logged in Successfully",
        data: {
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            },
            accessToken
        }
    })
}

const refresh = async (req, res) => {
    
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken)

    if (!refreshToken) {
        return res.status(400).json({
            message: "Invalid refresh token"
        })
    }

    try {
        const decode = readRefreshToken(refreshToken)

        const { userId, role } = decode

        const user = await UserModel.findById(userId)
        
        if (refreshToken !== user.refreshToken) {
            await UserModel.findByIdAndUpdate(user._id, {
                refreshToken: null
            })
            return res.status(400).json({
                message:"mismatched token"
            })
        }

        const accessToken = createAccessToken({
            userId: user._id,
            role: user.role
        })

        const newRefreshToken = createRefreshToken({
            userId: user._id,
            role: user.role
        })

        await UserModel.findByIdAndUpdate(user._id, {
                refreshToken:newRefreshToken
        })
        
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true
        })

        return res.status(200).json({
            message: "Token refreshed successfully",
            accessToken
        });
        
        

    } catch (error) {
        res.clearCookie("refreshToken");

        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}

const getMe = async (req, res) => {
    
    const { userId, role } = req.user;

    const user = await UserModel.findById(userId);

    return res.status(200).json({
        message: "User data fetched Successfully",
        data: {
            user: {
                email: user.email,
                name: user.name,
                id:user._id
            }
        }
    })

    
}

export  {registerController , loginController , refresh  , getMe}