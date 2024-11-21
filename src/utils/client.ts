import { Kafka, Producer } from "kafkajs";
import 'dotenv/config'

const kafka = new Kafka({
    clientId: process.env.CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER!]
});

export default kafka