// @ts-ignore
const User = require('../models/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { REFRESH_KEY, ACCESS_KEY } = process.env;

class AuthService {

    async registerUser(req, res) {
        const { email, password, firstname,lastname } = req.body;
        try {

            const checkEmailExists= await User.find({email:email});
            if(checkEmailExists) return res.status(400).json("Email has exists");

            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);

            const result =await User.create({
                firstname: firstname,
                lastname:lastname,
                email: email,
                password: hashed,

            })
            return result;

        } catch (error) {
            throw error;
        }
    }

    async genAccessToken(user){
        return jwt.sign({
            id: user.id,
            admin: user.admin,
        }, ACCESS_KEY, { expiresIn: "3h" });
    }
    async genRefreshToken(user){
        return jwt.sign({
            id: user.id,
            admin: user.admin,
        }, REFRESH_KEY, { expiresIn: "365d" });
    }

    async loginUser(req, res) {
        try {
            const findUser = await User.findOne({ email: req.body.email });
            if (!findUser) {
                res.status(401).json({ error: "Wrong email" });
            }
            const comparePassword = await bcrypt.compare(req.body.password, findUser.password);
            if (!comparePassword) {
                return res.status(401).json({ error: "Wrong password" });
            }
            const { password, refreshToken, ...others } = findUser._doc;
            if (findUser && comparePassword) {
                const genAccessToken =await this.genAccessToken(findUser);
                const genRefreshToken =await this.genRefreshToken(findUser);

                res.cookie("accessToken", genAccessToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                })
                await User.findByIdAndUpdate({ _id: findUser.id }, { refreshToken: genRefreshToken });
                return { ...others };
            }
        } catch (error) {
            throw error;
        }
    }


    async refreshAccessToken(req, res) {
        const { id } = req.body;
        const findUser = await User.findById(id);
        if (!findUser) {
            return res.status(404).json("Not found User");
        }
        
        const getRefreshTokenInDB = findUser.refreshToken;
    
        try {
            jwt.verify(getRefreshTokenInDB, REFRESH_KEY);


            const newAccessToken =await this.genAccessToken(findUser);
            const newRefreshToken =await this.genRefreshToken(findUser);
    
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
    
            await User.findByIdAndUpdate({ _id: findUser.id }, { refreshToken: newRefreshToken });
    
            res.status(200).json({accessToken:newAccessToken});
        } catch (error) {
            res.status(403).json("Invalid refreshToken");
        }
    }

    async logoutUser(req, res) {
        res.clearCookie("accessToken");
        res.status(200).json("Logout successful");
    }
    


}

module.exports = new AuthService();
