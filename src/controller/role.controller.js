import roleModel from "../models/role.model.js";

export const createRole = async (req, res) => {
    try {
        await roleModel.sync();
        const dataRole = req.body;

        const created = await roleModel.create({
            role_name: dataRole.role_name,
            role_description: dataRole.role_description
        });

        return res.status(201).json({
            ok: true,
            status: 201,
            message: "Create Role :)",
            id: created.role_id
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

export const showRole = async (req, res) => {
    try {
        await roleModel.sync();
        const roles = await roleModel.findAll();

        return res.status(200).json({
            ok: true,
            status: 200,
            message: "Show Role :)",
            body: roles
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

export const showIdRole = async (req, res) => {
    try {
        await roleModel.sync();
        const role = await roleModel.findByPk(req.params.id);

        return res.status(200).json({
            ok: true,
            status: 200,
            message: "show Role id :)",
            body: role
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

export const updateRole = async (req, res) => {
    try {
        await roleModel.sync();
        const dataRole = req.body;

        await roleModel.update(
            {
                role_name: dataRole.role_name,
                role_description: dataRole.role_description
            },
            {
                where: {
                    role_id: req.params.id
                }
            }
        );

        return res.status(200).json({
            ok: true,
            status: 200,
            message: "Update Role :)"
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

export const deleteRole = async (req, res) => {
    try {
        await roleModel.sync();

        await roleModel.destroy({
            where: {
                role_id: req.params.id
            }
        });

        return res.status(200).json({
            ok: true,
            status: 200,
            message: "delete Role :)"
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

const RoleController = {
    createRole,
    showRole,
    showIdRole,
    updateRole,
    deleteRole
};

export default RoleController;