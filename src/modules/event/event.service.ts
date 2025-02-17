import { injectable, inject } from "inversify";
import TYPES from "../../core/container/container.types";
import { kafka } from "@hireverse/kafka-communication";
import { logger } from "../../core/utils/logger";
import { UserCreatedEvent, UserCreatedMessage } from "@hireverse/kafka-communication/dist/events";

@injectable()
export class EventService {
  @inject(TYPES.KafkaProducer) private producer!: kafka.KafkaProducer;

  async userCreatedEvent(message: UserCreatedMessage) {
    try {
      const event = UserCreatedEvent({ key: message.userId, value: message });
      await this.producer.sendEvent(event);
    } catch (error: any) {
      logger.error(
        `Failed to publish UserCreatedEvent event for user: ${message.userId}. Error: ${error.message || "Unknown error"}`,
        {
          context: "UserCreatedEvent",
          id: message.userId,
          errorStack: error.stack || "No stack trace",
        }
      );

    }
  }

}

