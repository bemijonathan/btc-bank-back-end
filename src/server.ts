import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import UserRoute from "./models/users/users.route";
import { newPassword, resetPassword, signIn, signUp } from "./utils/authRoutes";
import transactionsRoute from "./models/transactions/transactions.route";

const app: express.Application = express();

app.use(morgan("tiny"));
app.use(bodyParser.json());

/**
 * Routes
 *
 */

app.post("/signup", signUp);
app.post("/signin", signIn);
app.post("/reset", resetPassword);
app.post("/password", newPassword);
app.use(`/user`, UserRoute);
app.use("/transaction", transactionsRoute);

export default app;
