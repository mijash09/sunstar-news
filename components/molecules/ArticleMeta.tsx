import React from 'react';
import AuthorInfo from './AuthorInfo';

interface ArticleMetaProps {
  author?: string;
  authorImage?: string;
  time?: string;
  views?: string;
  date?: string;
}

export default function ArticleMeta({
  author,
  authorImage,
  time,
  views,
  date,
}: ArticleMetaProps) {
  return (
    <div className="article-meta">
      {author && <AuthorInfo name={author} avatarSrc={authorImage} />}
      {date && <span>📅 {date}</span>}
      {time && <span>⏱️ {time}</span>}
      {views && <span>👁️ {views}</span>}
    </div>
  );
}
