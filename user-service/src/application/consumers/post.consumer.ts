import { inject, injectable } from "inversify";
import { SubscriptionParameters } from "../../domain/ports/messaging/consumer";
import { IUserRepository } from "../../domain/users/user.repo";
import { PostEvents, Topics } from "../constants/messaging.constants";
import { TYPES } from "../constants/types";

@injectable()
class PostConsumer {
  @inject(TYPES.UserRepository) userRepository: IUserRepository;

  public onPostCreated(): SubscriptionParameters {
    return {
      topic: Topics.PostService,
      eventTypes: [PostEvents.Created],
      readFromBeginning: true,
      handles: {
        async handle(event) {
          console.log(`Consumed Event ${JSON.stringify(event)}`);
          return {
            handled: true
          };
        }
      }
    };
  }

  public onPostUpdated(): SubscriptionParameters {
    return {
      topic: Topics.PostService,
      eventTypes: [PostEvents.Updated],
      readFromBeginning: true,
      handles: {
        async handle(event) {
          console.log(`Consumed Event ${JSON.stringify(event)}`);
          return {
            handled: true
          };
        }
      }
    };
  }

  public onPostDeleted(): SubscriptionParameters {
    return {
      topic: Topics.PostService,
      eventTypes: [PostEvents.Deleted],
      readFromBeginning: true,
      handles: {
        async handle(event) {
          console.log(
            `Consumed Post Delete Event ${JSON.stringify(event)}`
          );
          return {
            handled: true
          };
        }
      }
    };
  }
}

const postConsumer = new PostConsumer();

export default [
  postConsumer.onPostCreated(),
  postConsumer.onPostUpdated(),
  postConsumer.onPostDeleted()
];
