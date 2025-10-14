// import { WithId } from 'mongodb';
// import { Blog } from '../../domain/blog';
// import { ResourceType } from '../../../core/types/resource-type';
// import { BlogListPaginatedOutput } from '../output/blog-list-paginated.output';
// import { BlogDataOutput } from '../output/blog-data.output';

// export function mapToBlogListPaginatedOutput(
//   blogs: WithId<Blog>[],
//   meta: { pageNumber: number; pageSize: number; totalCount: number },
// ): BlogListPaginatedOutput {
//   return {
//     meta: {
//       page: meta.pageNumber,
//       pageSize: meta.pageSize,
//       pageCount: Math.ceil(meta.totalCount / meta.pageSize),
//       totalCount: meta.totalCount,
//     },
//     data: blogs.map(
//       (blog): BlogDataOutput => ({
//         type: ResourceType.Blogs,
//         id: blog._id.toString(),
//         attributes: {
//           name: blog.name,
//           description: blog.description,
//           websiteUrl: blog.websiteUrl,
//           createdAt: blog.createdAt,
//           isMembership: blog.isMembership,
//         },
//       }),
//     ),
//   };
// }


import { WithId } from 'mongodb';
import { Blog } from '../../domain/blog';
import { BlogListPaginatedOutput } from '../output/blog-list-paginated.output';

export function mapToBlogListPaginatedOutput(
  blogs: WithId<Blog>[],
  meta: { pageNumber: number; pageSize: number; totalCount: number },
): BlogListPaginatedOutput {
  return {
    pagesCount: meta.pageSize ? Math.ceil(meta.totalCount / meta.pageSize) : 0,
    page: meta.pageNumber,
    pageSize: meta.pageSize,
    totalCount: meta.totalCount,
    items: blogs.map((blog) => ({
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    })),
  };
}
