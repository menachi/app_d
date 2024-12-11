import { NextFunction, Request, Response } from 'express';
import userModel from '../models/user_model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req: Request, res: Response) => {
    try {
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            email: req.body.email,
            password: hashedPassword
        });
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send("wrong email or password");
    }
};

const login = async (req: Request, res: Response) => {
    try {
        //verify user & password
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).send("wrong email or password");
            return;
        }
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            res.status(400).send("wrong email or password");
            return;
        }

        if (!process.env.TOKEN_SECRET) {
            res.status(400).send("Server Error");
            return;
        }
        //generate token
        const token = jwt.sign({ _id: user._id },
            process.env.TOKEN_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRE });

        res.status(200).send({ token: token, _id: user._id });
    } catch (err) {
        res.status(400).send("wrong email or password");
    }

};

type Payload = {
    _id: string;
}
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    const token = authorization && authorization.split(" ")[1];
    if (!token) {
        res.status(401).send("Access Denied");
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(400).send("Server Error");
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
        if (err) {
            res.status(401).send("Access Denied");
            return;
        }
        const userId = (payload as Payload)._id;
        req.params.userId = userId;
        next();
    });
};

export default { register, login };