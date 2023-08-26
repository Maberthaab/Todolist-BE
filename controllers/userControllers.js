const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// const Sequelize = require("sequelize");

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ["id", "username"],
        });
        res.status(200).json({
            success: true,
            message: "List All Users",
            data: users,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.Register = async (req, res) => {
    const { username, password} = req.body;



    if (emailExisted) {
        return failedJson(res, "This email address already exists");
    }
    const salt = 10;
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        let user = await User.create({
            username: username,
            password: hashPassword,
            
        });

        user = JSON.parse(JSON.stringify(user));

        return res.status(200).json({
            success: true,
            message: "Register Successfully",
        });
    } catch (error) {
        console.log(error);
    }
};

exports.Login = async (req, res) => {
    try {
        let user = await User.findOne({
            where: {
                username: req.body.username,
            },
        });

        user = JSON.parse(JSON.stringify(user));

        if (!user)
            return res
                .status(400)
                .json({ success: false, message: "username or Password didn't match" });
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match)
            return res
                .status(400)
                .json({ success: false, message: "Wrong Password" });

        //token generation
        let refreshTokens = [];

        const userId = user.id;
        const email = user.username;
      

        const tokenParams = { userId, username };

        const accessToken = jwt.sign(tokenParams, "access", {
            expiresIn: "1d",
        });
        const refreshToken = jwt.sign(tokenParams, "refresh", {
            expiresIn: "183d",
        });
        refreshTokens.push(refreshToken);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        const data = {
            userId,
            username,
            accessToken,
            refreshToken,
        };

        return res.status(201).json({
            success: true,
            message: "Login Successfully",
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false, message: "Login Failed" });
    }
};

exports.Logout = async (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) return res.sendStatus(204);

    res.clearCookie("refreshToken");
    return res
        .status(200)
        .json({ success: true, message: "Logout Successfully" });
};


exports.registerAdmin = async (req, res) => {
    const { email, password } = req.body;
    const tokenUser = req.user

    // validasi tidak bisa melakukan operasi ini
    if (tokenUser.role === "member" || tokenUser.role === "admin") {
        return res.status(200).json({
            success: false,
            message: "hanya superadmin yang boleh add user baru dengan role admin",

        });
    }

    const emailExisted = await User.findOne({
        where: {
            email: email,
        },
    });

    if (emailExisted) {
        return failedJson(res, "This email address already exists");
    }
    const salt = 10;
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        let user = await User.create({
            email: email,
            password: hashPassword,
            role: "admin",
        });

        user = JSON.parse(JSON.stringify(user));

        return res.status(200).json({
            success: true,
            message: "Register Successfully",
        });
    } catch (error) {
        console.log(error);
    }
}
// Coded By Hafidh
