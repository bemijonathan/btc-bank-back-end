import { crudControllers } from "../../utils/crud";
import { CustomError } from "../../utils/error";
import { FormatResponse } from "../../utils/formatResponse";
import { User } from "./users.model";
import Users from "./users.model";
import { Request, Response } from "express";
import chalk from "chalk";
import { logs } from "../../utils/logger";
import {
	transactionModel,
	Transactions,
} from "../transactions/transactions.model";

const response = new FormatResponse();
const errorResponse = new CustomError();

export class UserController {
	static async balanceDetails(
		req: Request
	): Promise<{ confirmed: number; deposit: number; withdraw: number }> {
		let x: number = await UserController.getBalance(req);
		let totaldeposit: number = await (await UserController.getTotalDeposit(req))
			.totaldeposit;
		let totalwithdrawal: number = await (
			await UserController.getTotalDeposit(req)
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

	async createUser(req: Request, res: Response): Promise<void> {
		try {
			const user: User = await Users.create(req.body);
			const { email, username, id } = user;
			response.sendResponse(res, 201, { email, username, id });
		} catch (error) {
			if (error.name === "MongoError" && error.code === 11000) {
				errorResponse.clientError(res, "user with credentials already exist");
			} else {
				errorResponse.clientError(res, error.message);
			}
		}
	}
	async getUserDetails(req: Request, res: Response) {
		try {
			const transactions = await transactionModel.find({
				user: req.body.authenticatedUser.id,
			});
			const userdetails = await Users.findOne({
				_id: req.body.authenticatedUser.id,
			}).select("name email admin id");

			const balance = await UserController.balanceDetails(req);

			response.sendResponse(res, 200, {
				transactions,
				user: userdetails,
				balance,
			});
		} catch (error) {
			logs.error(error);
			errorResponse.serverError(res);
		}
	}
	async deleteUserByUser(req: Request, res: Response) {
		try {
			req.params.id = req.body.authenticatedUser.id;
			const status = await crudControllers(Users).removeOne(req);
			if (status) {
				response.sendResponse(res, 200, status);
			} else {
				errorResponse.clientError(res, "delete resource failed");
			}
		} catch (error) {
			logs.error(error);
			errorResponse.serverError(res, error);
		}
	}
	async deleteUser(req: Request, res: Response): Promise<void> {
		try {
			const status = await crudControllers(Users).removeOne(req);
			if (status) {
				response.sendResponse(res, 200, status);
			} else {
				errorResponse.clientError(res, "delete resource failed");
			}
		} catch (error) {
			logs.error(error);
			errorResponse.serverError(res, error);
		}
	}
	async getAll(req: Request, res: Response): Promise<void> {
		try {
			const user: User[] = await Users.find({ admin: false }).select(
				" username email id "
			);
			response.sendResponse(res, 200, user);
		} catch (e) {
			console.log(chalk.redBright(e));
			errorResponse.clientError(res, e);
		}
	}
	async removeOne(req: Request, res: Response): Promise<void> {
		try {
			const done = await crudControllers(Users).removeOne(req);
			const transaction = await transactionModel.deleteMany({
				user: req.params.id,
			});

			if (done.deletedCount && transaction.deletedCount) {
				response.sendResponse(res, 204, "deleted");
			} else {
				response.sendResponse(res, 404, "record not found");
			}
		} catch (e) {
			console.log(e);
			errorResponse.unprocessedEntity(e);
		}
	}
	async getOne(req: Request, res: Response): Promise<void> {
		try {
			const user: User = await crudControllers(Users).getOne(req);
			logs.warning(user);
			if (user) {
				response.sendResponse(res, 200, user);
			} else {
				errorResponse.notfound(res);
			}
		} catch (error) {
			logs.error(error);
			errorResponse.notfound(res);
		}
	}
	async updateUser(req: Request, res: Response): Promise<void> {
		console.log(req.body);
		try {
			const user: User = await Users.updateOne(
				{
					_id: req.body.authenticatedUser.id,
					...req.body,
				},
				{
					new: true,
				}
			);
			if (user) {
				response.sendResponse(res, 201, "updated");
			} else {
				errorResponse.notfound(res);
			}
		} catch (error) {
			logs.error(error);
			console.log(error);
			errorResponse.clientError(res, error);
		}
	}

	async updateUserByAdmin(req: Request, res: Response): Promise<void> {
		try {
			const user: User = await Users.updateOne(
				{
					_id: req.params.id,
					...req.body,
				},
				{ new: true }
			);
			if (user) {
				response.sendResponse(res, 201, { user, report: "updated" });
			} else {
				errorResponse.notfound(res);
			}
		} catch (error) {
			logs.error(error);
			errorResponse.clientError(res, error);
		}
	}
}
