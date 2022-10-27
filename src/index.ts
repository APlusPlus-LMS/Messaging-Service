import { connect } from "mongoose";
import dotenv from "dotenv";
import { router } from "./routes/messages.js";
import express from "express";

dotenv.config();

if (process.env.MONGODB_URI === undefined) {
    throw Error("MONGODB_URI not set.");
}

connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to database.");

        const app = express();
        const PORT = process.env.PORT || 8000;

        app.use("/api/v1/messaging", router);
        app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
    })
    .catch((err) => {
        throw err;
    });
