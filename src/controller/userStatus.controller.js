import userStatusModal from "../models/userStatus.model.js";

export const createUserStatus = async (req, res) => {
    try {
        await userStatusModal.sync();
        const dataUserStatus = req.body;
        const creatUser = await userStatusModal.create({
        userS
        }
        )
    }
}