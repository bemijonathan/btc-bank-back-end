import { IRouter, Router } from "express";
import { authenticate } from "../../utils/auth";
import transactionsController from "./transactions.controller";
import transactionController from "./transactions.controller";

const transactionsRoute: IRouter = Router();

transactionsRoute.route("/").get(authenticate, transactionController.getMany);
transactionsRoute
	.route("/:id")
	.post(authenticate, transactionsController.createOne)
	.patch()
	.get();
