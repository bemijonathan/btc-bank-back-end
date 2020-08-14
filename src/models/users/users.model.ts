import mongoose, { Document } from "mongoose";
import { hashedpassword, validatepassword } from "../../utils/auth";
import { logs } from "../../utils/logger";

export interface User extends Document {
	name: string;
	username: string;
	profile: string;
	email: string;
	password: string;
	admin: boolean;
	photos: string;
	transactions: [string];
	resetoken: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

const UsersSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		username: {
			type: String,
			unique: true,
			trim: true,
		},
		profile: {
			type: String,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		admin: {
			type: Boolean,
			default: false,
		},
		photos: {
			type: String,
		},
		transactions: {
			type: [mongoose.SchemaTypes.ObjectId],
			ref: "transaction",
		},
		resetoken: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

UsersSchema.pre("save", function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	let user = this as User;
	const hash = hashedpassword((this as User).password);
	user.password = hash;
	user.username = user.name.split(" ").join("-");
	logs.success(user.username);
	next();
});

UsersSchema.methods.checkPassword = (
	password: string,
	hash: string
): boolean => {
	return validatepassword(password, hash);
};

const usermodel = mongoose.model<User>("user", UsersSchema);

export default usermodel;
