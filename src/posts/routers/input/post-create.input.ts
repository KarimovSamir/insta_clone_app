import { ResourceType } from '../../../core/types/resource-type';
import { PostAttributes } from '../../application/dtos/post-attributes';

export type PostCreateInput = {
  data: {
    type: ResourceType.Posts;
    attributes: PostAttributes;
  };
};
