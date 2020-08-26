import { Socket } from "dgram";
import cron from "node-cron";
import { bonusModel } from "./models/bonus/bonus.model";
// import { Bonus, bonusModel } from "./models/bonus/bonus.model";
import { UserController } from "./models/users/users.controller";
import usermodel from "./models/users/users.model";

// once a user is created a bonus account is created
// at the end of every day a certian bonus is added to your account
// depending on the amount you have left
//
// on withdrawal subtract first from the bonus before the actual money

let t = new UserController();

export const cronJob = () =>
	cron.schedule("0 0 12 */2 * ? *", async () => {
		let allUsers = [];
		const docs: any = await bonusModel.find({}).populate("user").lean().exec();
		for (const doc of docs) {
			let total = await UserController.getBalance(doc.user._id);
			allUsers.push(doc);

			let percent =
				total > 0.5 ? total * 0.01 : total > 1.5 ? total * 0.02 : total;
			console.log(total + doc.amount);
			await bonusModel.updateOne(
				{ user: doc.user._id },
				{ amount: percent + doc.amount },
				{ new: true }
			);
		}
		console.log(allUsers);
	});

// 0 0 12 1/1 * ? *  every one day

// 0 0 12 */2 * ? *  every two days
