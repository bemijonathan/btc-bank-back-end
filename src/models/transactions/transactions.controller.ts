import { crudControllers } from "../../utils/crud";
import { CustomError } from "../../utils/error";
import { FormatResponse } from "../../utils/formatResponse";
import { transactionModel, Transactions } from "./transactions.model";
import { Request, Response } from "express";
import usermodel, { User } from "../users/users.model";

const e = new CustomError();
const f = new FormatResponse();

class transactionController {
	async getMany(req: Request, res: Response) {
		try {
			const t = await crudControllers(transactionModel).getMany();
			f.sendResponse(res, 200, t);
		} catch (error) {
			e.unprocessedEntity(res);
		}
	}
	async createOne(req: Request, res: Response) {
		try {
			const transaction: Transactions = await transactionModel.create({
				...req.body,
				user: req.body.authenticatedUser,
			});

			const user: any = await usermodel.findOne({
				id: req.body.authenticatedUser,
			});

			user.transactions.push(transaction._id);

			await user.save();

			f.sendResponse(res, 200, transaction);
		} catch (error) {
			e.clientError(res, e);
		}
	}
}

export default new transactionController();
