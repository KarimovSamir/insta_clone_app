import { Blog } from '../blogs/types/blog';
import { Post } from '../posts/types/post';

export const db = {
    blogs: <Blog[]>[
        {
            id: '1',
            name: 'Tomb Raider Blog',
            description: 'Game Blog',
            websiteUrl: 'https://sam.com'
        },
        {
            id: '2',
            name: 'Programming Blog',
            description: 'Just Programming',
            websiteUrl: 'https://mydigitalhome.me'
        },
    ],
    posts: <Post[]>[
        {
            id: '1',
            title: 'Game Tomb Raider 1 part',
            shortDescription: 'About Tomb Raider 1 part',
            content: 'Tomb Raider content 1 part',
            blogId: '1',
            blogName: 'Tomb Raider Blog',
        },
        {
            id: '2',
            title: 'Game Tomb Raider 2 part',
            shortDescription: 'About Tomb Raider 2 part',
            content: 'Tomb Raider content 2 part',
            blogId: '1',
            blogName: 'Tomb Raider Blog',
        },
        {
            id: '3',
            title: 'C++ school',
            shortDescription: 'Dark Time',
            content: 'C++ from baby to crazy',
            blogId: '2',
            blogName: 'Programming Blog',
        },
    ],
};
