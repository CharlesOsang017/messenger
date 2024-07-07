import asyncHanlder from "express-async-handler";
import User from "../../models/auth/userModel.js";

export const deleteUser = asyncHanlder(async(req, res)=>{
    const {id} = req.params

    // attempt to find and delete the user
    const user = await User.findByIdAndDelete(id)
    //check if user exists
    if(!user){
        res.status(404).json({message: 'User not found'})
    }
    // delete user
    res.status(200).json({message: 'User deleted successfully!!'})
})