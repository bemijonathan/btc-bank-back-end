import { connect } from "./db";
import app from "./server";

app.listen(
	3000,
	async (): Promise<void> => {
		await connect();
		console.log("listening on port 3000");
	}
);
