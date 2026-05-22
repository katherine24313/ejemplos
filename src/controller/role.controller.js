import roleModel from "../models/role.model.js";

export const createRole = async (req, res) => {
    try {
        await roleModel.sync();
        const dataRole=req.body;
        const createRole = await roleMoel.create({
            role_name: dataRole.role_name,
            role_descriptions: dataRole.role_description,

        });

        res.status(201).json({
            ok:true,
            status: 201,
            message: "Create Role :)",
            id: createRole.role_id,

        });
    }
    catch (error) {
        return res.status(500).json({
        message: "Something went wrong in the request",
        status:500,
        });
    }
};