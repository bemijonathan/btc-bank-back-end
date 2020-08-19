import bcrypt from "bcrypt";
import chalk from "chalk";
import jwt from "jsonwebtoken";
import { logs } from "./logger";
import { NextFunction, Request, Response } from "express";
import usersModel, { User } from "../models/users/users.model";
import { CustomError } from "./error";

const e = new CustomError();

export const hashedpassword = (password: string): string => {
	const hashed = bcrypt.hashSync(password, 10);
	logs.warning(hashed);
	return hashed;
};

export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void | Response> => {
	logs.warning(req.headers.authorization);
	const tk = req?.headers?.authorization?.replace("Bearer ", "");
	if (tk) {
		const token = verifyToken(tk as string);
		if (token) {
			const userId: any = jwt.decode(tk);
			console.log(userId);
			const user: any = await usersModel.findOne({ _id: userId.id });
			if (user) {
				req.body.authenticatedUser = user;
				console.log(JSON.stringify(user.name));
				next();
			} else {
				logs.warning("user not found");
				return e.unauthenticated(res);
			}
		} else {
			return e.unauthenticated(res);
		}
	} else {
		logs.warning("no token");
		return e.unauthenticated(res);
	}
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
	if (req.body.authenticatedUser.admin) {
		next();
	} else {
		e.unauthenticated(res);
	}
};

export const validatepassword = (
	myPlaintextPassword: string,
	hash: string
): boolean => {
	return bcrypt.compareSync(myPlaintextPassword, hash);
};

export const generateToken = (id: string, admin: boolean) => {
	try {
		return jwt.sign({ id, admin }, "jona", {
			expiresIn: "24h",
		});
	} catch (error) {
		console.log(chalk.bgRedBright(error));
	}
};

export const verifyToken = (token: string): boolean => {
	try {
		if (jwt.verify(token, "jona")) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		console.log(e);
		return false;
	}
};
