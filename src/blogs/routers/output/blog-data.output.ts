// import { ResourceType } from '../../../core/types/resource-type';

// export type BlogDataOutput = {
//   type: ResourceType.Blogs;
//   id: string;
//   attributes: {
//     name: string;
//     description: string;
//     websiteUrl: string;
//     createdAt: string;
//     isMembership: boolean;
//   };
// };

import { ResourceType } from '../../../core/types/resource-type';

export type BlogDataOutput = {
  id: string,
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
