import bcrypt from "bcryptjs";
import userModel from  "../models/user.model.js";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import { escape } from "sequelize/lib/sql-string";
 
export const createUser = async  (req, res) => {
    try {
        await userModel.sync();
        const salt =await bcrypt.genSalt(10);
        const dataUser = req.body;
        const passwordHash = await bcryptjs.hash(dataUser.user_password, salt);
        const createUser = await userModel.create({
            user_user: dataUser.user_user,
            user_password: dataUser.passwordHash,
            userStatus_fk: dataUser.userStatus_fk,
            role_fk: dataUser.role_fk,

        });
        const token = jwt.sign({email: createUser.user_user},process.env.
            JWK_SECRET, { expiresIn: '1h'}
        );
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Create User :)",
            id: createUser.user_id,
            token: token

        });
    } catch (error) {
        return res.status(500).json({
            message: "Someting weng wrong in the request",
            status: 500,     
       });
    }
};

export const showUser = async  (req, res) => {
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
            message: "Something went wrong in the request",
            status: 500,     
       });
    }
};

export const showUserId = async  (req, res) => {
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
            body:  user,

        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong in the request",
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
            },{
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
        const createUser = await userModel.create({
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

export const loginUser = async (req, re) =>{
    try{
        await userModel.sync();
        const{email, password}= req.body 

        if (!email || !password ){
            return res.status(400).json({
                error: "Misssing required fileds: email password"
            });
        }
        const user = await userModel.findOne({
            where:{
                user_user:email, 
            },
        });

        if(!user){
            return res.status(400).json({
                error: "User not found ", 
            });
        }
        

        const IsMatch = await bcryptjs.compare(password, user.user_password);

        if (!IsMatch) {
            return res.status (400).json({
                error: "Invalid credetials",
            });
        }
        const  token = jwt.sign({email:user.user_user},process.env.JWK_SECRET, {expiresIn:'1h'});

        res.status(200).json({
            ok:true,
            status: 200,
            message: "Login Api:)",
            id: user.user_id,
            token:token
        });
    }
    catch (error ) {
        return res.status(500).json({
            message: "Something went wrong in the request",
            status: 500,
        });
    }
};

const UserController = {
    createUser, showUser,showUserId, updateUser, deleteUser, loginUser
};
export default UserController;