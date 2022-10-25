import { isMongoId } from "class-validator";
import { Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  requestBody,
  requestParam,
  response
} from "inversify-express-utils";
import { IPostRepository } from "../../../domain/post/post.repo";
import { Result } from "../../../domain/utilities/result";
import { validationMiddleware } from "../../../infra/middleware/validator.middleware";
import { TYPES } from "../../constants/types";
import { BaseController } from "../base/base.controller";
import { PostDTO, PostUpdateDTO } from "./dtos/user.dto";

@controller("/posts")
export class UserController extends BaseController {
  @inject(TYPES.PostRepository) postRepository: IPostRepository;

  @httpGet("/")
  private async getAll(
    @response() res: Response
  ) {
    try {
      const users = await this.postRepository.getAll();
      this.createResponse(res, Result.ok(users, "Get all Posts successfully"));
    } catch (err) {
      this.logger.error(`<Error> Controller /posts - ${err}`);
      const errMsg = err.status && err.status !== 500 ? err.message : "";
      this.createResponse(res, Result.fail(errMsg, err.errorCode));
    }
  }



  @httpPost("/", validationMiddleware(PostDTO))
  private async create(
    @requestBody() body: PostDTO,
    @response() res: Response
  ) {
    try {
      const user = await this.postRepository.create(body);
      this.createResponse(res, Result.ok(user, "Post created successfully"));
    } catch (err) {
      this.logger.error(`<Error> Controller Create Posts - ${err}`);
      const errMsg = err.status && err.status !== 500 ? err.message : "";
      this.createResponse(res, Result.fail(errMsg, err.errorCode));
    }
  }

  @httpPut("/", validationMiddleware(PostUpdateDTO))
  private async update(
    @requestBody() body: PostUpdateDTO,
    @response() res: Response
  ) {
    try {
      const user = await this.postRepository.update(body);
      this.createResponse(res, Result.ok(user, "Post updated successfully"));
    } catch (err) {
      this.logger.error(`<Error> Controller update - ${err}`);
      const errMsg = err.status && err.status !== 500 ? err.message : "";
      this.createResponse(res, Result.fail(errMsg, err.errorCode));
    }
  }

  @httpGet("/:id")
  private async get(@requestParam("id") id: string, @response() res: Response) {
    if (!id || !isMongoId(id)) {
      this.createResponse(res, Result.fail("Invalid id", "INVALID_REQUEST"));
      return;
    }
    try {
      const user = await this.postRepository.getById(id);
      this.createResponse(res, Result.ok(user, "Post retrieved successfully"));
    } catch (err) {
      this.logger.error(`<Error> Controller Get - ${err}`);
      const errMsg = err.status && err.status !== 500 ? err.message : "";
      this.createResponse(res, Result.fail(errMsg, err.errorCode));
    }
  }
}
