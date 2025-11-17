import { Container } from 'inversify';
import { TYPES } from './types';
import { BlogRepository } from '../../blogs/repositories/blog.repository';
import { BlogService } from '../../blogs/application/blogs.service';
import { BlogController } from '../../blogs/controllers/blog.controller';
import { PostRepository } from '../../posts/repositories/post.repository';
import { PostsService } from '../../posts/application/posts.service';
import { PostsController } from '../../posts/controllers/posts.controller';
import { CommentRepository } from '../../comments/repositories/comment.repository';
import { CommentsService } from '../../comments/application/comments.service';
import { CommentsController } from '../../comments/controllers/comments.controller';
import { UserRepository } from '../../users/repositories/user.repository';
import { UsersService } from '../../users/application/users.service';
import { UsersController } from '../../users/controllers/users.controller';
import { AuthRepository } from '../../auth/repositories/auth.repository';
import { AuthService } from '../../auth/application/auth.services';
import { AuthController } from '../../auth/controllers/auth.controller';
import { TokenBlacklistRepository } from '../../auth/repositories/token-blacklist.repository';
import { TokenBlacklistService } from '../../auth/application/token-blacklist.service';
import { RateLimitRepository } from '../../auth/repositories/rate-limit.repository';
import { RateLimitService } from '../../auth/application/rate-limit.service';
import { DeviceSessionsRepository } from '../../device_sessions/repositories/device-sessions.repository';
import { DeviceSessionsService } from '../../device_sessions/application/device-sessions.service';
import { DeviceSessionsController } from '../../device_sessions/controllers/device-sessions.controller';
import { JwtService } from '../../auth/adapters/jwt.service';
import { BcryptService } from '../../auth/adapters/bcrypt.service';
import { MailerService } from '../../auth/adapters/resend.mailer';
import { TestingRepository } from '../../testing/repositories/testing.repository';
import { TestingService } from '../../testing/application/testing.service';
import { TestingController } from '../../testing/controllers/testing.controller';

const appContainer = new Container();

appContainer
  .bind<BlogRepository>(TYPES.BlogRepository)
  .to(BlogRepository)
  .inSingletonScope();
appContainer
  .bind<BlogService>(TYPES.BlogService)
  .to(BlogService)
  .inSingletonScope();
appContainer
  .bind<BlogController>(TYPES.BlogController)
  .to(BlogController)
  .inSingletonScope();

appContainer
  .bind<PostRepository>(TYPES.PostRepository)
  .to(PostRepository)
  .inSingletonScope();
appContainer
  .bind<PostsService>(TYPES.PostsService)
  .to(PostsService)
  .inSingletonScope();
appContainer
  .bind<PostsController>(TYPES.PostsController)
  .to(PostsController)
  .inSingletonScope();

appContainer
  .bind<CommentRepository>(TYPES.CommentRepository)
  .to(CommentRepository)
  .inSingletonScope();
appContainer
  .bind<CommentsService>(TYPES.CommentsService)
  .to(CommentsService)
  .inSingletonScope();
appContainer
  .bind<CommentsController>(TYPES.CommentsController)
  .to(CommentsController)
  .inSingletonScope();

appContainer
  .bind<UserRepository>(TYPES.UserRepository)
  .to(UserRepository)
  .inSingletonScope();
appContainer
  .bind<UsersService>(TYPES.UsersService)
  .to(UsersService)
  .inSingletonScope();
appContainer
  .bind<UsersController>(TYPES.UsersController)
  .to(UsersController)
  .inSingletonScope();

appContainer
  .bind<AuthRepository>(TYPES.AuthRepository)
  .to(AuthRepository)
  .inSingletonScope();
appContainer
  .bind<AuthService>(TYPES.AuthService)
  .to(AuthService)
  .inSingletonScope();
appContainer
  .bind<AuthController>(TYPES.AuthController)
  .to(AuthController)
  .inSingletonScope();

appContainer
  .bind<TokenBlacklistRepository>(TYPES.TokenBlacklistRepository)
  .to(TokenBlacklistRepository)
  .inSingletonScope();
appContainer
  .bind<TokenBlacklistService>(TYPES.TokenBlacklistService)
  .to(TokenBlacklistService)
  .inSingletonScope();

appContainer
  .bind<RateLimitRepository>(TYPES.RateLimitRepository)
  .to(RateLimitRepository)
  .inSingletonScope();
appContainer
  .bind<RateLimitService>(TYPES.RateLimitService)
  .to(RateLimitService)
  .inSingletonScope();

appContainer
  .bind<DeviceSessionsRepository>(TYPES.DeviceSessionsRepository)
  .to(DeviceSessionsRepository)
  .inSingletonScope();
appContainer
  .bind<DeviceSessionsService>(TYPES.DeviceSessionsService)
  .to(DeviceSessionsService)
  .inSingletonScope();
appContainer
  .bind<DeviceSessionsController>(TYPES.DeviceSessionsController)
  .to(DeviceSessionsController)
  .inSingletonScope();

appContainer.bind<JwtService>(TYPES.JwtService).to(JwtService).inSingletonScope();
appContainer
  .bind<BcryptService>(TYPES.BcryptService)
  .to(BcryptService)
  .inSingletonScope();
appContainer
  .bind<MailerService>(TYPES.MailerService)
  .to(MailerService)
  .inSingletonScope();

appContainer
  .bind<TestingRepository>(TYPES.TestingRepository)
  .to(TestingRepository)
  .inSingletonScope();
appContainer
  .bind<TestingService>(TYPES.TestingService)
  .to(TestingService)
  .inSingletonScope();
appContainer
  .bind<TestingController>(TYPES.TestingController)
  .to(TestingController)
  .inSingletonScope();

export { appContainer };
