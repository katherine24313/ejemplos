export const createRole = async (req, res) => {
    try{
        await roleModel.sync();
        const dataRole=req.body;
        const createRole = await roleModel.create({
            role_name: dataRole.role_name,
            role_descriptions: dataRole.role_description,
        });
        res.status(201).json({
            ok:true,
            status: 201,
            message: "Create Role :)",
            data:showRoles,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong in the request",
            status:500,
        });
    }
};



export const showRole = async (req, res) => {
    try{
        await roleModel.sync();
        const idRole = await roleModel.findOne(
            {where: {
                role_id: idRole,
            }
        });
        res.status(200).json({
            ok:true,
            status: 200,
            message: "Show Id Role :)",
            data: showIdRole,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong in the request",
            status:500,
        });
    }
};

export const updateRole = async (req, res) => {
    try{
        await roleModel.sync();
        const dataRole=req,body;
        const idRole = req,params,id;
        const updateRole = await roleModel.update({
            role_name: dataRole.role_name,
            role_description: dataRole.role_description,
        },{
            
            where: {
                role_id: idRole,
            }
        });
        res.status(200).json({
            ok:true,
            status: 200,
            message: "Update Role :)",
            data: updateRole,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong in the request",
            status:500,
        });
    }
};

  export const deleteRole = async (req, res) => {
    try{
        await roleModel.sync();
        const idRole = req,params,id;
        const deleteRole = await roleModel.destroy({
           where: {
                role_id: idRole,
            }
        });
        res.status(200).json({
            ok:true,
            status: 200,
            message: "delete Role :)",
            data: deleteRole,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong in the request",
            status:500,
        });
    }
};