import { inject, injectable } from "inversify";
import { MongoRepository } from "typeorm";
import { Post as PostModel } from "../../typeorm/models/Post.model";
import { Post } from "../../../domain/post/post";
import { IPostRepository } from "../../../domain/post/post.repo";

import { Logger, ILogger } from "../../logging/pino";
import { TYPES } from "../../../application/constants/types";
import { CustomError } from "../../errors/base.error";
import { IAppDataSource } from "../../typeorm/typeorm.config";
import { getObjectId } from "../../typeorm/utils";

@injectable()
export class PostRepository implements IPostRepository {
  protected logger: ILogger;
  protected postDataSource: MongoRepository<PostModel>;

  constructor(
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.DataSource) appDataSource: IAppDataSource
  ) {
    this.logger = logger.get();
    this.postDataSource = appDataSource
      .instance()
      .getMongoRepository(PostModel);
  }

  async create(post: Post): Promise<Post> {
    try {
      const postToSave = this.postDataSource.create(post);
      const res = await this.postDataSource.save(postToSave);

      return Post.create({ ...res, id: res.id.toString() });
    } catch (err) {
      this.logger.error(`<Error> PostRepositoryGetAll - ${err}`);
      throw err;
    }
  }

  async getAll(): Promise<Post[]> {
    try {
      const res = await this.postDataSource.find();
      const posts: Post[] = [];
      res.forEach((element) => {
        posts.push(Post.create({ ...element, id: element.id.toString() }));
      });
      return posts;
    } catch (err) {
      this.logger.error(`<Error> PostRepositoryGetAll - ${err}`);
      throw err;
    }
  }

  async update(post: Post): Promise<Post> {
    this.logger.info(`Post ${JSON.stringify(post)}`);
    let existingPost = await this.postDataSource.findOneBy({
      _id: getObjectId(post.id)
    });
    this.logger.info(`Check ${JSON.stringify(existingPost)}`);

    try {
      if (!existingPost) {
        throw new CustomError({
          message: "Invalid id",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

     
      existingPost = this.postDataSource.create({ ...existingPost, ...post });
      await this.postDataSource.findOneAndUpdate(
        {
          _id: getObjectId(post.id)
        },
        { $set: existingPost }
      );

      return Post.create({ ...existingPost, id: existingPost.id.toString() });
    } catch (err) {
      this.logger.error(`<Error> UserRepositoryUpdate - ${err}`);

      throw err;
    }
  }

  async getById(id: string): Promise<Post> {
    try {
      const post = await this.postDataSource.findOneBy({
        _id: getObjectId(id)
      });
      
      if (!post) {
        throw new CustomError({
          message: "Invalid id",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

      return Post.create({ ...post, id: post.id.toString() });
    } catch (err) {
      this.logger.error(`<Error> UserRepositoryGet - ${err}`);

      throw err;
    }
  }
}
