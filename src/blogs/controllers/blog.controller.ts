import { inject, injectable } from "inversify";
import { Request, RequestHandler, Response } from "express";
import { matchedData } from "express-validator";
import { TYPES } from "../../core/ioc/types";
import { HttpStatus } from "../../core/types/http-statuses";
import { setDefaultSortAndPaginationIfNotExist } from "../../core/helpers/set-default-sort-and-pagination";
import { PostsService } from "../../posts/application/posts.service";
import { PostQueryInput } from "../../posts/routers/input/post-query.input";
import { mapToPostListPaginatedOutput } from "../../posts/routers/mappers/map-to-post-list-paginated-output.util";
import { mapToPostOutputUtil } from "../../posts/routers/mappers/map-to-post-output.util";
import { PostCreateByBlogInput } from "../../posts/routers/input/post-create.input";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import { BlogService } from "../application/blogs.service";
import { BlogCreateInput } from "../routers/input/blog-create.input";
import { BlogQueryInput } from "../routers/input/blog-query.input";
import { BlogUpdateInput } from "../routers/input/blog-update.input";
import { mapToBlogListPaginatedOutput } from "../routers/mappers/map-to-blog-list-paginated-output.util";
import { mapToBlogOutput } from "../routers/mappers/map-to-blog-output.util";

@injectable()
export class BlogController {
    constructor(
        @inject(TYPES.BlogService)
        private readonly blogService: BlogService,
        @inject(TYPES.PostsService)
        private readonly postsService: PostsService,
    ) {}

    getBlogList: RequestHandler = async (req: Request, res: Response) => {
        try {
            const sanitizedQuery = matchedData(req, {
                locations: ["query"],
                includeOptionals: true,
            }) as BlogQueryInput;

            const queryInput =
                setDefaultSortAndPaginationIfNotExist(sanitizedQuery);
            const { items, totalCount } =
                await this.blogService.findBlogs(queryInput);

            const blogsListOutput = mapToBlogListPaginatedOutput(items, {
                pageNumber: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount,
            });

            res.send(blogsListOutput);
        } catch (error) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    };

    getBlogById: RequestHandler<{ id: string }> = async (req, res) => {
        try {
            const blog = await this.blogService.findBlogByIdOrFail(
                req.params.id,
            );
            const blogOutput = mapToBlogOutput(blog);

            res.status(HttpStatus.Ok).send(blogOutput);
        } catch (error) {
            res.sendStatus(HttpStatus.NotFound);
        }
    };

    createBlog: RequestHandler<unknown, unknown, BlogCreateInput> = async (
        req,
        res,
    ) => {
        try {
            const createdBlogId = await this.blogService.createBlog(req.body);
            const createdBlog =
                await this.blogService.findBlogByIdOrFail(createdBlogId);
            const blogOutput = mapToBlogOutput(createdBlog);

            res.status(HttpStatus.Created).send(blogOutput);
        } catch (error) {
            res.sendStatus(HttpStatus.InternalServerError);
        }
    };

    updateBlogById: RequestHandler<{ id: string }, unknown, BlogUpdateInput> =
        async (req, res) => {
            try {
                await this.blogService.updateBlogById(req.params.id, req.body);
                res.sendStatus(HttpStatus.NoContent);
            } catch (error) {
                res.sendStatus(HttpStatus.NotFound);
            }
        };

    deleteBlogById: RequestHandler<{ id: string }> = async (req, res) => {
        try {
            await this.blogService.deleteBlogById(req.params.id);
            res.sendStatus(HttpStatus.NoContent);
        } catch (error) {
            res.sendStatus(HttpStatus.NotFound);
        }
    };

    createBlogPost: RequestHandler<
        { id: string },
        unknown,
        PostCreateByBlogInput
    > = async (req, res) => {
        try {
            const createdPostId =
                await this.postsService.createPostWithUrlBlogId(req.params.id, {
                    ...req.body,
                    blogId: req.params.id,
                });
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

    getBlogPostList: RequestHandler<{ id: string }> = async (req, res) => {
        try {
            const sanitizedQuery = matchedData(req, {
                locations: ["query"],
                includeOptionals: true,
            }) as PostQueryInput;

            const queryInput =
                setDefaultSortAndPaginationIfNotExist(sanitizedQuery);
            const { items, totalCount } =
                await this.postsService.findPostsByBlog(
                    queryInput,
                    req.params.id,
                );

            const postListOutput = mapToPostListPaginatedOutput(items, {
                pageNumber: queryInput.pageNumber,
                pageSize: queryInput.pageSize,
                totalCount,
            });

            res.send(postListOutput);
        } catch (error) {
            if (error instanceof RepositoryNotFoundError) {
                res.sendStatus(HttpStatus.NotFound);
                return;
            }

            res.sendStatus(HttpStatus.InternalServerError);
        }
    };
}
