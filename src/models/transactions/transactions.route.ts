import { IRouter, Router } from "express";
import { authenticate, isAdmin } from "../../utils/auth";
import transactionsController from "./transactions.controller";

const transactionsRoute: IRouter = Router();

transactionsRoute
	.route("/")
	.get(authenticate, transactionsController.getUserTransaction);
transactionsRoute
	.route("/all")
	.get(authenticate, isAdmin, transactionsController.getMany);
transactionsRoute
	.route("/:id")
	.post(authenticate, isAdmin, transactionsController.createOne)
	.patch(authenticate, isAdmin, transactionsController.UpdateOne)
	.delete(authenticate, isAdmin, transactionsController.DestroyOne);

export default transactionsRoute;
