import { useEffect, useState } from 'react';

export const useCommentCount = (postId: number) => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCommentCount = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        const data = await response.json();
        setCount(data.length);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Error fetching comments');
      } finally {
        setLoading(false);
      }
    };

    fetchCommentCount();
  }, [postId]);

  return { count, loading, error };
};
