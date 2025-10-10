import { ResourceType } from '../../../core/types/resource-type';
import { BlogAttributes } from '../../application/dtos/blog-attributes';

export type BlogUpdateInput = {
  data: {
    type: ResourceType.Blogs;
    id: string;
    attributes: BlogAttributes;
  };
};
