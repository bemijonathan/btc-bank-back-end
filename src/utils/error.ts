import { Response } from "express";

export class CustomError {
	notfound(res: Response, data?: any): Response {
		return res.status(404).send({
			status: false,
			error: data ? data : "not found",
		});
	}
	serverError(res: Response, data?: any): Response {
		return res.status(400).send({
			status: false,
			error: data ? data : "internal server error",
		});
	}
	unprocessedEntity(res: Response, data?: any): Response {
		return res.status(422).send({
			status: false,
			error: data ? data : "unprocessed entity",
		});
	}
	clientError(res: Response, data: any): Response {
		return res.status(400).send({
			status: false,
			error: data ? data : "Bad Request",
		});
	}
	unauthenticated(res: Response, data?: any): Response {
		return res.status(401).send({
			status: false,
			error: "user is unauthenticated",
		});
	}
}
