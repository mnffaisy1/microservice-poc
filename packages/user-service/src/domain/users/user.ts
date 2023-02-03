import { Entity } from "../entity";
import { IUserProps } from "./user.props";

export class User extends Entity<IUserProps> {
  private constructor(props: IUserProps) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IUserProps): User {
    const instance = new User(props);
    return instance;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  set password(text: string) {
    this.props.password = text;
  }

  get password(): string {
    return this.props.password;
  }

  get savedPosts(): string[] {
    return this.props.savedPosts;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
