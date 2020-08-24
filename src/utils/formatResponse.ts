import chalk from "chalk";
import { Response } from "express";

export class FormatResponse {
	sendResponse<T>(res: Response, status: number, data: T): Response {
		return res.status(status).send({
			status: true,
			data: data,
		});
	}
	serialize<T>(data: T): T {
		if (Array.isArray(data)) {
			for (const d of data as any[]) {
				delete d.password;
				delete d.email;
				d.id = d._id;
				delete d._id;
				console.log(d);
			}
			return data;
		} else {
			const d = JSON.parse(JSON.stringify(data));
			delete d.password;
			delete d.email;
			return d;
		}
	}
}
