//
import { RootModel } from "../root.interface";
import { User } from "../users/users.model";

export interface notification extends RootModel {
	title: String;
	user: User;
	actions: actions;
}

enum actions {
	"like",
	"comment",
	"message",
}
