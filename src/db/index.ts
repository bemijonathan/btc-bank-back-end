import chalk from "chalk";
import Mongoose from "mongoose";

export const connect = async (): Promise<void> => {
	try {
		await Mongoose.connect(
			process.env.MONGO || "mongodb://localhost:27017/adda",
			{
				useNewUrlParser: true,
			}
		);
	} catch (error) {
		console.log(chalk.redBright.bold(error));
	}
};
