import { ResourceType } from '../../../core/types/resource-type';
import { PostAttributes } from '../../application/dtos/post-attributes';

export type PostUpdateInput = {
  data: {
    type: ResourceType.Posts;
    id: string;
    attributes: PostAttributes;
  };
};
