import { inject, injectable } from "inversify";
import { MongoRepository } from "typeorm";
import { User as UserModel } from "../../typeorm/models/User.model";
import { User } from "../../../domain/users/user";
import { IUserRepository } from "../../../domain/users/user.repo";
import {
  IUserSignInProps,
  IUserWithTokenProps
} from "../../../domain/users/user.props";
import { hashIt } from "../../encryption";
import { Logger, ILogger } from "../../logging/pino";
import { TYPES } from "../../../application/constants/types";
import { CustomError } from "../../errors/base.error";
import { IAppDataSource } from "../../typeorm/typeorm.config";
import { getObjectId } from "../../typeorm/utils";

@injectable()
export class UserRepository implements IUserRepository {
  protected logger: ILogger;
  protected userDataSource: MongoRepository<UserModel>;

  constructor(
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.DataSource) appDataSource: IAppDataSource
  ) {
    this.logger = logger.get();
    this.userDataSource = appDataSource
      .instance()
      .getMongoRepository(UserModel);
  }

  async getAll(): Promise<User[]> {
    // throw new Error("Method not implemented.");
    try {
      const res = await this.userDataSource.find();
      console.log(
        "🚀 ~ file: index.ts ~ line 36 ~ UserRepository ~ getAll ~ res",
        res
      );
      let users: User[];
      res.forEach((element) => {
        users.push(User.create({ ...element, id: element.id.toString() }));
      });
      return users;
    } catch (err) {
      this.logger.error(`<Error> UserRepositoryGet - ${err}`);
      throw err;
    }
  }

  async signUp(user: User): Promise<User> {
    try {
      const check = await this.userDataSource.findOneBy({ email: user.email });

      if (check) {
        throw new CustomError({
          message: "User already exists",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

      user.password = hashIt(user.password);
      const userToSave = this.userDataSource.create(user);
      const res = await this.userDataSource.save(userToSave);
      console.log(
        "🚀 ~ file: index.ts ~ line 66 ~ UserRepository ~ signUp ~ res",
        res
      );

      return User.create({ ...res, id: res.id.toString() });
    } catch (err) {
      this.logger.error(`<Error> UserRepositorySignUp - ${err}`);

      throw err;
    }
  }

  signIn(signInInfo: IUserSignInProps): Promise<IUserWithTokenProps> {
    throw new Error("Method not implemented.");
  }

  async update(user: User): Promise<User> {
    this.logger.info(`User ${JSON.stringify(user)}`);
    let existingUser = await this.userDataSource.findOneBy({
      _id: getObjectId(user.id)
    });
    this.logger.info(`Check ${JSON.stringify(existingUser)}`);

    try {
      if (!existingUser) {
        throw new CustomError({
          message: "Invalid id",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

      if (user.password) {
        user.password = hashIt(user.password);
      }
      existingUser = this.userDataSource.create({ ...existingUser, ...user });
      await this.userDataSource.findOneAndUpdate(
        {
          _id: getObjectId(user.id)
        },
        { $set: existingUser }
      );

      return User.create({ ...existingUser, id: existingUser.id.toString() });
    } catch (err) {
      this.logger.error(`<Error> UserRepositoryUpdate - ${err}`);

      throw err;
    }
  }

  async getById(id: string): Promise<User> {
    try {
      const user = await this.userDataSource.findOneBy({
        _id: getObjectId(id)
      });
      console.log(
        "🚀 ~ file: index.ts ~ line 119 ~ UserRepository ~ getById ~ user",
        user
      );

      if (!user) {
        throw new CustomError({
          message: "Invalid id",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

      return User.create({ ...user, id: "" });
    } catch (err) {
      this.logger.error(`<Error> UserRepositoryGet - ${err}`);

      throw err;
    }
  }
}
