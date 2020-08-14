import chalk from "chalk";
import Mongoose from "mongoose";

let db;

export const connect = async (): Promise<void> => {
	try {
		db = await Mongoose.connect("mongodb://localhost:27017/adda", {
			useNewUrlParser: true,
		});
	} catch (error) {
		console.log(chalk.redBright.bold(error));
	}
};
