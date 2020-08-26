import mongoose, { Document } from "mongoose";
// import {}

export interface Bonus extends Document {
	user: string;
	amount: number;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

const bonusSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "user",
			required: true,
		},
		amount: {
			type: Number,
			default: 0,
			min: 0,
		},
	},
	{
		timestamps: true,
	}
);

// bonusSchema.static("total",)

export const bonusModel = mongoose.model<Bonus>("bonus", bonusSchema);

// once a user is created a bonus account is created
// at the end of every day a certian bonus is added to your account
// depending on the amount you have left
//
// on withdrawal subtract first from the bonus before the actual money
