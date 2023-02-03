import { Entity } from "../entity";
import { IPostProps } from "./post.props";

export class Post extends Entity<IPostProps> {
  private constructor(props: IPostProps) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IPostProps): Post {
    const instance = new Post(props);
    return instance;
  }

  get id(): string {
    return this._id;
  }

  get author(): string {
    return this.props.author;
  }

  get title(): string {
    return this.props.title;
  }

  get body(): string {
    return this.props.body;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
