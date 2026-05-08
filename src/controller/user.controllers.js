export const createUser = async (req, res) => {
    try{
        await userModel.sync();
        const dataUser=req.body;
        const createUser = await userModel.create({
            user_user: dataUser.user_user,
            user_password: dataUser.user_password,
            userStatus_fk: dataUser.userStatus_fk,
            role_fk: dataUser.role,
        });
        res.status(201).json({
            ok:true,
            status: 201,
            message: "Create User :)",
            id: createUser.user_id,
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
        const user = await userModel.findAll();
        res.status(200).json({
            ok:true,
            status: 200,
            message: "Show User :)",
            body: user,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong in the request",
            status:500,
        });
    }
};

export const showUserId = async (req,res) => {
    try {
        const idUser = await userModel.findOne({
        const dataUser = req,params,id;
        const updateUser = 
        })
    }
}


export const deleteUser = async (req, res) => {

}