import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import kafka from "./utils/client";
import kafkaRouter from "./routes/kafka"

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use('/kafka', kafkaRouter)

app.use('/create_topic', () => {
    const admin = kafka.admin();
    console.log("Admin connecting...");
    admin.connect();
    console.log("Admin Connection Success...");

    console.log("Creating Topic [input-topic]");
    admin.createTopics({
        topics: [
            {
                topic: "input-topic2",
                numPartitions: 2,
            },
        ],
    });
    console.log("Topic Created Success [input-topic]");

    console.log("Disconnecting Admin..");
    admin.disconnect();
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});