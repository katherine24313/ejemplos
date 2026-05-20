import userModel from "../models/user.model.js";
import { faker } from "@faker-js/faker";

export const createUser = async (req, res) => {
    try {
        await userModel.sync();
        const dataUser = req.body;
        const createUser = await userModel.create({
            user_user: dataUser.user_user,
            user_password: dataUser.user_password,
            userStatus_fk: dataUser.userStatus_fk,
            role_fk: dataUser.role,

        });
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Create User :)",
            id: createUser.user_id,

        });
    } catch (error) {
        return res.status(500).json({
            message: "Someting weng wrong in the request",
            status: 500,
        });
    }
};

export const showUser = async (req, res) => {
    try {
        await userModel.sync();
        const users = await userModel.findAll();
        res.status(200).json({
            ok: true,
            status: 200,
            message: "Show User :)",
            body: users,

        });
    } catch (error) {
        return res.status(500).json({
            message: "Someting weng wrong in the request",
            status: 500,
        });
    }
};

export const showUserId = async (req, res) => {
    try {
        const idUser = req.params.id;
        const user = await userModel.findOne({
            where: {
                user_id: idUser
            },

        });
        res.status(200).json({
            ok: true,
            status: 201,
            message: "show User id :)",
            body: user,

        });
    } catch (error) {
        return res.status(500).json({
            message: "Someting weng wrong in the request",
            status: 500,
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        await userModel.sync();

        const idUser = req.params.id;
        const dataUser = req.body;
        const updateUser = await userModel.update(
            {
                user_user: dataUser.user_user,
                user_password: dataUser.user_password,
                userStatus_fk: dataUser.userStatus_fk,
                role_fk: dataUser.role_fk,
            }, {
            where: {
                user_id: idUser,
            },
        }
        );

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Update User :)",
            body: updateUser,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong in the request",
            status: 500,
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await userModel.sync();

        const idUser = req.params.id;
        const dataUser = req.body;
        const delateUser = await userModel.destroy({
            where: {
                user_id: idUser,
            },
        }
        );

        res.status(200).json({
            ok: true,
            status: 200,
            message: "delete User :)",
            body: deleteUser,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong in the request",
            status: 500,
        });
    }
};

export const createUserfk = async (req, res) => {
    try {
        await userModel.sync();
        const createUsers = req.params.id;
        const dataUser = await userModel.create({
            user_user: faker.internet.email(),
            user_password: faker.internet.password(),
            userStatus_fk: 1,
            role_fk: 1,
        });

        res.status(201).json({
            ok: true,
            status: 201,
            message: "Create User :)",
            id: createUsers.user_id
        });

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong in the request",
            status: 500,
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        await userModel.sync();

        const { email, password } = req.body;

        console.log("=== LOGIN DEBUG ===");
        console.log("Email recibido:", email);
        console.log("Password recibida:", password);

        if (!email || !password) {
            return res.status(400).json({
                error: "Missing required fields: email and password",
                status: 400,
            });
        }

        const allUsers = await userModel.findAll();
        console.log("Todos los usuarios en BD:", JSON.stringify(allUsers, null, 2));

        const user = await userModel.findOne({
            where: {
                user_user: email,
            },
        });

        console.log("Usuario encontrado:", user);
        console.log("Comparando:", email, "con los emails existentes");

        if (!user) {
            return res.status(404).json({
                error: "User not found",
                searched_email: email,
                available_emails: allUsers.map(u => u.user_user)
            });
        }

        const Ismatch = await bcryptjs.compare(password, user.user_password);

        if (!IsNatch) {
            return res.status(400).json({
                error: "Invalid credentials",
            });
        }

        const token = jwt.sign({ email: user.user_user }, process.env.JWT_SECRET, { expiressIn: '1h' });

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Login Api :)",
            id: user_id,
            token: token
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong in the request",
            status: 500,
        });
    }
};

export default UserController;