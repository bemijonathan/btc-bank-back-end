import { crudControllers } from "../../utils/crud";
import { CustomError } from "../../utils/error";
import { FormatResponse } from "../../utils/formatResponse";
import { transactionModel, Transactions } from "./transactions.model";
import { Request, Response } from "express";
// import usermodel, { User } from "../users/users.model";
import { logs } from "../../utils/logger";

const e = new CustomError();
const f = new FormatResponse();

class transactionController {
	static async balanceDetails(
		req: Request
	): Promise<{ confirmed: number; deposit: number; withdraw: number }> {
		let x: number = await transactionController.getBalance(req);
		let totaldeposit: number = await (
			await transactionController.getTotalDeposit(req)
		).totaldeposit;
		let totalwithdrawal: number = await (
			await transactionController.getTotalDeposit(req)
		).totalwithdrawal;

		return { confirmed: x, deposit: totaldeposit, withdraw: totalwithdrawal };
	}
	static async getTotalDeposit(req: Request) {
		let all: Transactions[] = await transactionModel.find({
			user: req.body.authenticatedUser.id,
		});
		let totaldeposit: number = 0;
		let totalwithdrawal: number = 0;
		for (const transaction of all) {
			if (transaction.transactionsType === "DEPOSIT") {
				totaldeposit += transaction.amount;
			} else if (transaction.transactionsType === "WITHDRAWAL") {
				totalwithdrawal += transaction.amount;
			}
		}
		return { totaldeposit, totalwithdrawal };
	}
	static async getBalance(req: Request): Promise<number> {
		let all: Transactions[] = await transactionModel.find({
			user: req.body.authenticatedUser.id,
		});
		let total: number = 0;
		for (const transaction of all) {
			if (
				transaction.status === "CONFIRMED" &&
				transaction.transactionsType === "DEPOSIT"
			) {
				total += transaction.amount;
			} else if (
				transaction.status === "CONFIRMED" &&
				transaction.transactionsType === "WITHDRAWAL"
			) {
				total -= transaction.amount;
			}
		}
		return total;
	}
	async getMany(req: Request, res: Response) {
		try {
			const t = await crudControllers(transactionModel).getMany();
			f.sendResponse(res, 200, t);
		} catch (error) {
			e.unprocessedEntity(res);
		}
	}
	async createWithdrawal(req: Request, res: Response) {
		const balance: number = await transactionController.getBalance(req);
		if (req.body.amount > balance || balance === 0) {
			return e.unprocessedEntity(res, "insufficient coins");
		} else {
			try {
				const t = await transactionModel.create({
					...req.body,
					transactionsType: "WITHDRAWAL",
					user: req.body.authenticatedUser.id,
				});
				t ? f.sendResponse(res, 200, t) : e.unprocessedEntity(res);
			} catch (error) {
				logs.error(error);
				e.unprocessedEntity(res, error);
			}
		}
	}
	async createOne(req: Request, res: Response) {
		try {
			const transaction: Transactions = await transactionModel.create({
				...req.body,
				user: req.params.id,
			});

			// const user: User | null = await usermodel.findOne({
			// 	id: req.body.id,
			// });

			// user.transactions.push(transaction._id);

			f.sendResponse(res, 200, transaction);
		} catch (error) {
			logs.error(error);
			e.clientError(res, error);
		}
	}
	async UpdateOne(req: Request, res: Response): Promise<void> {
		try {
			let transaction = await transactionModel.updateOne(
				{ _id: req.params.id },
				{ ...req.body },
				{ new: true }
			);
			if (transaction) {
				f.sendResponse(res, 200, { transaction, updated: true });
			} else {
				e.notfound(res, "record not found");
			}
		} catch (error) {
			logs.error(error);
			e.unprocessedEntity(res);
		}
	}
	async DestroyOne(req: Request, res: Response): Promise<void> {
		try {
			const done = await crudControllers(transactionModel).removeOne(req);
			logs.success(done);
			if (done.deletedCount) {
				f.sendResponse(res, 204, "deleted");
			} else {
				f.sendResponse(res, 404, "record not found");
			}
		} catch (error) {
			console.log(error);
			e.unprocessedEntity(error);
		}
	}

	async getUserTransaction(req: Request, res: Response) {
		try {
			const data = await transactionModel
				.find({ user: req.body.authenticatedUser.id })
				.populate("user");
			// .select("name email admin _id");

			f.sendResponse(res, 200, data);
		} catch (error) {
			logs.error(error);
			e.clientError(res, error);
		}
	}
}

export default new transactionController();
