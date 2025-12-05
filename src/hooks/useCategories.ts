import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  products_count: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching categories...');
        const response = await api.get('/categories');
        console.log('Categories response:', response);
        setCategories(response || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(`Ошибка загрузки категорий: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}


