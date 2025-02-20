import { Container } from "inversify";
import { kafka } from "@hireverse/kafka-communication";
import TYPES from "../../core/container/container.types";
import { KafkaConnect, KafkaProducer } from "@hireverse/kafka-communication/dist/kafka";
import { EventService } from "./event.service";
import { logger } from "../../core/utils/logger";

const kafkaConnect = new KafkaConnect({
    clientId: "user-service",
    brokers: [process.env.KAFKA_SERVER!],
    retry: {
        retries: 10,              
        initialRetryTime: 500,   
        factor: 0.3,              
        multiplier: 2,           
        maxRetryTime: 60_000,    
        restartOnFailure: async (error) => {
            logger.error("Kafka connection failed:", error);
            return true; 
        },
    }
})

export const Producer = new kafka.KafkaProducer(kafkaConnect, {allowAutoTopicCreation: true});

export function loadEventContainer(container: Container) {
    container.bind<KafkaProducer>(TYPES.KafkaProducer).toConstantValue(Producer);
    container.bind<EventService>(TYPES.EventService).to(EventService);
}
