import User from "../models/User.js"
import { generateToken } from "../utils/generateToken.js"
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    const { name, email, password, role } = req.body
    // console.table({ name, email, password, role })
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ message: "User exists" })

    const hashed = await bcrypt.hash(password, 10)

    const user = await User.create({
        name,
        email,
        password: hashed,
        role
    })

    res.status(200).json({
        success: true,
        message: "Registration Successfull",
        // data:{
        // _id: user._id,
        // token: generateToken(user._id)
        // }
    })
}



export const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status({ message: "Invalid credentials" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

    res.status(200).json({
        success: true,
        message: "Login Successfull",
        data: {
            _id: user._id,
            name: user.name,
            role: user.role,
            token: generateToken(user._id)
        }
    })
}


