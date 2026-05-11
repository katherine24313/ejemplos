import userStatus from "../models/userStatus.model.js";
import userStatusModel from "../models/userStatus.model.js";

export const createUserStatus = async  (req, res) => {
    try {
        await userStatusModel.sync();
        const dataUserStatus = req.body;
        const createUser = await userStatusModel.create({
            userStatus_name: dataUserStatus.userStatus_name,
            userStatus_description: dataUserStatus.userStatus_description,

        });
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Create User Status:)",
            id: createUserStatus.userStatus_id,

        });
    } catch (error) {
        return res.status(500).json({
            message: "Someting weng wrong in the request",
            status: 500,     
       });
    }
};

export const ShowUserStatus = async  (req, res) => {
    try {
        const users = await userStatusModel.findAll();
        res.status(200).json({
            ok: true,
            status: 200,
            message: "Show User Status:)",
            body: users,

        });
    } catch (error) {
        return res.status(500).json({
            message: "Someting weng wrong in the request",
            status: 500,     
       });
    }
};

 export const ShowIdUserStatus = async  (req, res) => {
    try {
        const idstatus = req.params.id; 
        const user = await userStatusModel.findOne({
            where: {
                userStatus_id: idstatus,
            },
        });
        res.status(200).json({
            ok: true,
            status: 200,
            message: "Show User Status Id:)",
            body: user,

        });
    } catch (error) {
        return res.status(500).json({
            message: "Someting weng wrong in the request",
            status: 500,     
       });
    }
}

 export const updateUserStatus = async  (req, res) => {
    try {
        await userStatusModel.sync();
        const idstatus = req.params.id; 
        const dataUerStatus = req.body; 
        const updateuser = await userStatusModel.update({
            userStatus_name: dataUerStatus.userStatus_name,
            userStatus_description: dataUserStatus.userStatus_description,
        }, {
            where: {
                userStatus_id: idstatus,
            },
        });
        res.status(200).json({
            ok: true,
            status: 200,
            message: "update User Status :)",
            body: updateUser,

        });
    } catch (error) {
        return res.status(500).json({
            message: "Someting weng wrong in the request",
            status: 500,     
       });
    }
}

export const daleteUserStatus = async  (req, res) => {
    try {
        await userStatusModel.sync();
        const idstatus = req.params.id; 
        const deleteUser = await userStatusModel.destroy({
            where: {
                userStatus_id: idstatus,
            },
        });
        res.status(200).json({
            ok: true,
            status: 204,
            message: "Delete User Status :)",
            body: deleteUser,

        });
    } catch (error) {
        return res.status(500).json({
            message: "Someting weng wrong in the request",
            status: 500,     
       });
    }
}