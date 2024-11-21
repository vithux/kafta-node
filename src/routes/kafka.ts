import express from "express";
import kafka from "../utils/client";

const kafkaRouter = express.Router()
const consumer = kafka.consumer({ groupId: 'my-group-2' });

kafkaRouter.get('/produce', async (req, res, next) => {
    const producer = kafka.producer()
    await producer.connect();

    console.log('Producer connected!');

    const message = {
        value: 'Hello, Kafka!',
    };

    const topic = 'input-topic';

    await producer.send({
        topic,
        messages: [message],
    });

    console.log('Message sent successfully!');

    await producer.disconnect();
    res.send('Message sent');
})

kafkaRouter.get('/consumer', async (req, res, next) => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'input-topic', fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                value: message.value?.toString(),

                partition,
            });
            // Processar a mensagem aqui

            await consumer.commitOffsets([{ topic, partition, offset: message.offset }]);

        },
    });

    res.send('Consumption started');
})

kafkaRouter.get('/stop', async (req, res, next) => {
    await consumer.stop();
    res.send('Consumption stopped');
})

export default kafkaRouter;