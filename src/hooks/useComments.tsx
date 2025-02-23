import { useState, useEffect } from 'react';
import { Comment } from '../types';

export const useComments = (postId: number, commentsPerPage: number = 15) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchComments = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}/comments?_page=${page}&_limit=${commentsPerPage}`
      );
      const data = await response.json();

      if (page === 1) {
        setComments(data);
      } else {
        setComments(prev => [...prev, ...data]);
      }
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, [postId]);

  return { comments, loading, currentPage, fetchComments };
};
