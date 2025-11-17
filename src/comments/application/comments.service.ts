import { inject, injectable } from 'inversify';
import { WithId } from 'mongodb';
import { TYPES } from '../../core/ioc/types';
import { RepositoryForbiddenError } from '../../core/errors/repository-forbidden.error';
import { PostsService } from '../../posts/application/posts.service';
import { CommentRepository } from '../repositories/comment.repository';
import { Comment } from '../domain/comment';
import { CommentQueryInput } from '../routers/input/comment-query.input';
import { CommentAttributes } from './dtos/comment-attributes';

type CurrentUser = { _id: any; login: string; email: string; createdAt: string };

@injectable()
export class CommentsService {
  constructor(
    @inject(TYPES.CommentRepository)
    private readonly commentsRepository: CommentRepository,
    @inject(TYPES.PostsService)
    private readonly postsService: PostsService,
  ) {}

  async findCommentsByPost(
    queryDto: CommentQueryInput,
    postId: string,
  ): Promise<{ items: WithId<Comment>[]; totalCount: number }> {
    await this.postsService.findPostByIdOrFail(postId);

    return this.commentsRepository.findCommentsByPost(queryDto, postId);
  }

  async findCommentByIdOrFail(id: string): Promise<WithId<Comment>> {
    return this.commentsRepository.findCommentByIdOrFail(id);
  }

  async createCommentWithUrlPostId(
    postIdUrl: string,
    dto: CommentAttributes,
    user: CurrentUser,
  ): Promise<string> {
    const post = await this.postsService.findPostByIdOrFail(postIdUrl);

    const newComment: Comment = {
      postId: post._id.toString(),
      content: dto.content,
      commentatorInfo: {
        userId: user._id.toString(),
        userLogin: user.login,
      },
      createdAt: new Date().toISOString(),
    };

    return this.commentsRepository.createComment(newComment);
  }

  async deleteComment(id: string, user: CurrentUser): Promise<void> {
    const comment = await this.commentsRepository.findCommentByIdOrFail(id);
    if (comment.commentatorInfo.userId !== user._id.toString()) {
      throw new RepositoryForbiddenError('You can delete only your own comments');
    }
    await this.commentsRepository.deleteCommentById(id);
  }

  async updateComment(
    id: string,
    dto: CommentAttributes,
    user: CurrentUser,
  ): Promise<void> {
    const comment = await this.commentsRepository.findCommentByIdOrFail(id);
    if (comment.commentatorInfo.userId !== user._id.toString()) {
      throw new RepositoryForbiddenError('You can update only your own comments');
    }
    await this.commentsRepository.updateCommentById(id, dto);
  }
}