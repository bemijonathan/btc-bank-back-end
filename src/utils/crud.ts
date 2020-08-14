import { Request, Response } from "express";
import { Model } from "mongoose";
import { logs } from "./logger";

export const getOne = <T>(model: T) => async (req: Request): Promise<T> => {
	try {
		const doc: T = await (model as any).findOne({ _id: req.params.id });
		return doc;
	} catch (e) {
		logs.error(e);
		throw new Error(e);
	}
};

export const getMany = <T>(model: T) => async (req?: Request): Promise<T[]> => {
	try {
		const t = await (model as any).find({});
		return t;
	} catch (e) {
		logs.error(e);
		throw new Error(e);
	}
};

export const createOne = <T>(model: T) => async (req: Request): Promise<T> => {
	try {
		const user = await (model as any).create({ ...req.body });
		return user;
	} catch (e) {
		logs.error(e);
		throw new Error(e);
	}
};

export const updateOne = <T>(model: T) => async (
	req: Request
): Promise<T | void> => {
	try {
		return await (model as any).updateOne(
			{
				_id: req.params.id,
			},
			req.body,
			{ new: true }
		);
	} catch (e) {
		throw new Error(e);
	}
};

//  to be edited
export const removeOne = <T>(model: T) => async (req: Request) => {
	try {
		const removed = await (model as any).deleteOne({ _id: req.params.id });
		return removed;
	} catch (e) {
		logs.error(e);
		throw new Error(e);
	}
};

export const crudControllers = (model: any) => ({
	removeOne: removeOne(model),
	updateOne: updateOne(model),
	getMany: getMany(model),
	getOne: getOne(model),
	createOne: createOne(model),
});

// let b: string | number = 10;
