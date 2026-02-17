import { inject, injectable } from "inversify";
import { RequestHandler } from "express";
import { matchedData } from "express-validator";
import { WithId } from "mongodb";
import { TYPES } from "../../core/ioc/types";
import { HttpStatus } from "../../core/types/http-statuses";
import { setDefaultSortAndPaginationIfNotExist } from "../../core/helpers/set-default-sort-and-pagination";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { PostsService } from "../application/posts.service";
import { mapToPostListPaginatedOutput } from "../routers/mappers/map-to-post-list-paginated-output.util";
import { mapToPostOutputUtil } from "../routers/mappers/map-to-post-output.util";
import { PostQueryInput } from "../routers/input/post-query.input";
import { PostCreateInput } from "../routers/input/post-create.input";
import { PostUpdateInput } from "../routers/input/post-update.input";
import { CommentsService } from "../../comments/application/comments.service";
import { mapToCommentListPaginatedOutput } from "../../comments/routers/mappers/map-to-comment-list-paginated-output.util";
import { mapToCommentOutputUtil } from "../../comments/routers/mappers/map-to-comment-output.util";
import { CommentQueryInput } from "../../comments/routers/input/comment-query.input";
import { CommentCreateByIdInput } from "../../comments/routers/input/comment-create.input";
import { Comment, enumCommentLikeDislikeStatus } from "../../comments/domain/comment";

type PostRequestParams = { id: string };

type CurrentUser = {
    _id: any;
    login: string;
    email: string;
    createdAt: string;
};

@injectable()
export class PostsController {
    constructor(
        @inject(TYPES.PostsService)
        private readonly postsService: PostsService,
        @inject(TYPES.CommentsService)
        private readonly commentsService: CommentsService,
    ) { }

    getPostList: RequestHandler = async (req, res) => {
        try {
            const sanitizedQuery = matchedData(req, {
                locations: ["query"],
                includeOptionals: true,
            }) as PostQueryInput;
            const queryInput =
                setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

            const { items, totalCount } =
                await this.postsService.findPosts(queryInput);

            const postListOutput = mapToPostListPaginatedOutput(items, {
                pageNumber: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount,
            });

            res.send(postListOutput);
        } catch (error) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    };

    getPostById: RequestHandler<PostRequestParams> = async (req, res) => {
        try {
            const post = await this.postsService.findPostByIdOrFail(
                req.params.id,
            );
            const postOutput = mapToPostOutputUtil(post);

            res.send(postOutput);
        } catch (error) {
            res.sendStatus(HttpStatus.NotFound);
        }
    };

    createPost: RequestHandler<unknown, unknown, PostCreateInput> = async (
        req,
        res,
    ) => {
        try {
            const createdPostId = await this.postsService.createPost(req.body);
            const createdPost =
                await this.postsService.findPostByIdOrFail(createdPostId);
            const postOutput = mapToPostOutputUtil(createdPost);

            res.status(HttpStatus.Created).send(postOutput);
        } catch (error) {
            if (error instanceof RepositoryNotFoundError) {
                res.sendStatus(HttpStatus.NotFound);
                return;
            }

            res.sendStatus(HttpStatus.InternalServerError);
        }
    };

    updatePostById: RequestHandler<
        PostRequestParams,
        unknown,
        PostUpdateInput
    > = async (req, res) => {
        try {
            await this.postsService.updatePostById(req.params.id, req.body);
            res.sendStatus(HttpStatus.NoContent);
        } catch (error) {
            res.sendStatus(HttpStatus.NotFound);
        }
    };

    deletePostById: RequestHandler<PostRequestParams> = async (req, res) => {
        try {
            await this.postsService.deletePostById(req.params.id);
            res.sendStatus(HttpStatus.NoContent);
        } catch (error) {
            res.sendStatus(HttpStatus.NotFound);
        }
    };

    createPostComment: RequestHandler<
        PostRequestParams,
        unknown,
        CommentCreateByIdInput
    > = async (req, res) => {
        try {
            const currentUser = res.locals.currentUser as
                | CurrentUser
                | undefined;
            const createdCommentId =
                await this.commentsService.createCommentWithUrlPostId(
                    req.params.id,
                    req.body,
                    currentUser!,
                );
            const createdComment =
                await this.commentsService.findCommentByIdOrFail(
                    createdCommentId,
                );
            const commentOutput = mapToCommentOutputUtil(createdComment, enumCommentLikeDislikeStatus.None);

            res.status(HttpStatus.Created).send(commentOutput);
        } catch (error) {
            if (error instanceof RepositoryNotFoundError) {
                res.sendStatus(HttpStatus.NotFound);
                return;
            }

            res.sendStatus(HttpStatus.InternalServerError);
        }
    };

    getPostComments: RequestHandler<PostRequestParams> = async (req, res) => {
        try {
            const currentUser = res.locals.currentUser; 
            const userId = currentUser ? currentUser._id.toString() : undefined;

            const sanitizedQuery = matchedData(req, {
                locations: ["query"],
                includeOptionals: true,
            }) as CommentQueryInput;

            const queryInput =
                setDefaultSortAndPaginationIfNotExist(sanitizedQuery);

            // Мы передаем userId
            // И мы получаем myStatusesDictionary
            const { items, totalCount, myStatusesDictionary } = 
                await this.commentsService.findCommentsByPost(
                    queryInput,
                    req.params.id,
                    userId 
                );

            // Вызываем маппер
            // Вторым аргументом мы передаем найденный словарь.
            const commentListOutput = mapToCommentListPaginatedOutput(
                items as WithId<Comment>[],
                myStatusesDictionary,
                {
                    pageNumber: queryInput.pageNumber,
                    pageSize: queryInput.pageSize,
                    totalCount,
                },
            );

            res.send(commentListOutput);
        } catch (error) {
            if (error instanceof RepositoryNotFoundError) {
                res.sendStatus(HttpStatus.NotFound);
                return;
            }

            res.sendStatus(HttpStatus.InternalServerError);
        }
    };
}
