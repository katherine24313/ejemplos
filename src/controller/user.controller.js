import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import userModel from "../models/user.model.js";

export const createUser = async (req, res) => {
    try {
        await userModel.sync();
        const dataUser = req.body;

        if (!dataUser?.user_user || !dataUser?.user_password) {
            return res.status(400).json({
                ok: false,
                status: 400,
                message: "user_user y user_password son obligatorios"
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const passwordHash = await bcryptjs.hash(dataUser.user_password, salt);

        const createUser = await userModel.create({
            user_user: dataUser.user_user,
            user_password: passwordHash,
            userStatus_fk: dataUser.userStatus_fk,
            role_fk: dataUser.role_fk,
        });

        const token = jwt.sign({ email: createUser.user_user }, process.env.JWK_SECRET, {
            expiresIn: "1h"
        });

        return res.status(201).json({
            ok: true,
            status: 201,
            message: "Create User :)",
            id: createUser.user_id,
            token
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            status: 500,
            message: "Something went wrong in the request",
            error: error.message
        });
    }
};

export const showUser = async (req, res) => {
    try {
        await userModel.sync();
        const users = await userModel.findAll();

        return res.status(200).json({
            ok: true,
            status: 200,
            message: "Show User :)",
            body: users
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            status: 500,
            message: "Something went wrong in the request",
            error: error.message
        });
    }
};

export const showUserId = async (req, res) => {
    try {
        const idUser = req.params.id;
        const user = await userModel.findOne({
            where: {
                user_id: idUser
            }
        });

        return res.status(200).json({
            ok: true,
            status: 200,
            message: "show User id :)",
            body: user
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            status: 500,
            message: "Something went wrong in the request",
            error: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        await userModel.sync();
        const idUser = req.params.id;
        const dataUser = req.body;

        const payload = {
            user_user: dataUser.user_user,
            userStatus_fk: dataUser.userStatus_fk,
            role_fk: dataUser.role_fk
        };

        if (dataUser.user_password) {
            const salt = await bcryptjs.genSalt(10);
            payload.user_password = await bcryptjs.hash(dataUser.user_password, salt);
        }

        await userModel.update(payload, {
            where: {
                user_id: idUser
            }
        });

        return res.status(200).json({
            ok: true,
            status: 200,
            message: "Update User :)"
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            status: 500,
            message: "Something went wrong in the request",
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await userModel.sync();
        const idUser = req.params.id;

        await userModel.destroy({
            where: {
                user_id: idUser
            }
        });

        return res.status(200).json({
            ok: true,
            status: 200,
            message: "delete User :)"
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            status: 500,
            message: "Something went wrong in the request",
            error: error.message
        });
    }
};

export const createUserfk = async (req, res) => {
    try {
        await userModel.sync();
        const createUser = await userModel.create({
            user_user: faker.internet.email(),
            user_password: faker.internet.password(),
            userStatus_fk: 1,
            role_fk: 1
        });

        return res.status(201).json({
            ok: true,
            status: 201,
            message: "Create User :)",
            id: createUser.user_id
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            status: 500,
            message: "Something went wrong in the request",
            error: error.message
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        await userModel.sync();
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                status: 400,
                error: "Misssing required fileds: email password"
            });
        }

        const user = await userModel.findOne({
            where: {
                user_user: email
            }
        });

        if (!user) {
            return res.status(400).json({
                ok: false,
                status: 400,
                error: "User not found"
            });
        }

        const isMatch = await bcryptjs.compare(password, user.user_password);

        if (!isMatch) {
            return res.status(400).json({
                ok: false,
                status: 400,
                error: "Invalid credetials"
            });
        }

        const token = jwt.sign({ email: user.user_user }, process.env.JWK_SECRET, {
            expiresIn: "1h"
        });

        return res.status(200).json({
            ok: true,
            status: 200,
            message: "Login Api:)",
            id: user.user_id,
            token
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            status: 500,
            message: "Something went wrong in the request",
            error: error.message
        });
    }
};

const UserController = {
    createUser,
    showUser,
    showUserId,
    updateUser,
    deleteUser,
    loginUser
};

export default UserController;