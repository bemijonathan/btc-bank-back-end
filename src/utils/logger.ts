import chalk from "chalk";

class Logs {
	error(error: Error) {
		console.log(chalk.redBright(error), {
			time: Date.now().toLocaleString(),
		});
	}
	warning(data: any) {
		console.log(chalk.yellowBright(data), {
			time: Date.now().toLocaleString(),
		});
	}
	success(data: any) {
		console.log(chalk.greenBright(data), {
			time: Date.now().toLocaleString(),
		});
	}
}

export const logs = new Logs();
