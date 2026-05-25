import UserStatus from "../models/userStatus.model.js";

export const createUserStatus = async (req, res) => {
    try {
        await UserStatus.sync();
        const data = req.body;

        const created = await UserStatus.create({
            userStatus_name: data.userStatus_name,
            userStatus_description: data.userStatus_description
        });

        return res.status(201).json({
            ok: true,
            status: 201,
            message: "Create User Status :)",
            body: created
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

export const showUserStatus = async (req, res) => {
    try {
        await UserStatus.sync();
        const statuses = await UserStatus.findAll();

        return res.status(200).json({
            ok: true,
            status: 200,
            message: "Show User Status :)",
            body: statuses
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

export const showIdUserStatus = async (req, res) => {
    try {
        await UserStatus.sync();
        const userStatus = await UserStatus.findByPk(req.params.id);

        return res.status(200).json({
            ok: true,
            status: 200,
            message: "show User Status id :)",
            body: userStatus
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

export const updateUserStatus = async (req, res) => {
    try {
        await UserStatus.sync();
        const data = req.body;

        await UserStatus.update(
            {
                userStatus_name: data.userStatus_name,
                userStatus_description: data.userStatus_description
            },
            {
                where: {
                    userStatus_id: req.params.id
                }
            }
        );

        return res.status(200).json({
            ok: true,
            status: 200,
            message: "Update User Status :)"
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

export const deleteUserStatus = async (req, res) => {
    try {
        await UserStatus.sync();

        await UserStatus.destroy({
            where: {
                userStatus_id: req.params.id
            }
        });

        return res.status(200).json({
            ok: true,
            status: 200,
            message: "delete User Status :)"
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

const UserStatusController = {
    createUserStatus,
    showUserStatus,
    showIdUserStatus,
    updateUserStatus,
    deleteUserStatus
};

export default UserStatusController;