import { IRouter, Router } from "express";
import { isAdmin, authenticate } from "../../utils/auth";
import { UserController } from "./users.controller";

const UserRoute: IRouter = Router();
const controller = new UserController();

UserRoute.route("/")
	.get(authenticate, controller.getUserDetails)
	.post(authenticate, isAdmin, controller.createUser)
	.patch(authenticate, controller.updateUser)
	.delete(authenticate, controller.deleteUserByUser);
UserRoute.route("/all").get(authenticate, isAdmin, controller.getAll);
UserRoute.route("/:id")
	.delete(authenticate, isAdmin, controller.deleteUser)
	.get(authenticate, isAdmin, controller.getOne)
	.patch(authenticate, isAdmin, controller.updateUserByAdmin);

export default UserRoute;
