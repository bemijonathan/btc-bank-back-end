import mongoose, { Document } from "mongoose";
// import {}

export interface Transactions extends Document {
	transactionsType: String;
	user: string;
	amountBTC: number;
	status: string;
	wallet?: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

const transactionSchema = new mongoose.Schema(
	{
		transactionsType: {
			type: String,
			enum: ["DEPOSIT", "WITHRAWAL"],
		},
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "user",
			required: "true",
		},
		amountBTC: {
			type: Number,
			required: true,
			min: 0.5,
		},
		wallet: {
			type: String,
			trim: true,
		},
		status: {
			type: String,
			required: true,
			enum: ["PENDING", "CONFIRMED", "FAILED"],
			default: "PENDING",
		},
	},
	{
		timestamps: true,
	}
);

export const transactionModel = mongoose.model<Transactions>(
	"transaction",
	transactionSchema
);