import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Product, Category } from "@/types";
import { products as fallbackProducts } from "@/data/products";

export function useProducts() {
  const [data, setData] = useState<Product[]>(fallbackProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch from PostgreSQL API
        const response = await api.get('/products');
        // Transform API response to match our Product type
        const products = response.products.map((product: any) => ({
          id: product.id.toString(),
          title: product.name,
          shortDescription: product.description || '',
          description: product.description || '',
          price: product.price,
          originalPrice: product.price,
          image: product.image_url || '/images/placeholder.jpg',
          images: product.image_url ? [product.image_url] : ['/images/placeholder.jpg'],
          category: product.category_name || 'other',
          brand: product.brand_name || 'Unknown',
          specifications: product.specifications || {},
          available: true,
          rating: 4.5,
          reviewsCount: 0,
          tags: [],
          inStock: true,
          sku: `SKU-${product.id}`,
          weight: '1kg',
          dimensions: '10x10x10cm',
          material: 'Various',
          color: 'Various',
          warranty: '1 year'
        }));
        setData(products);
      } catch (err) {
        console.warn('Failed to fetch products from API, using fallback data:', err);
        // Use static data as fallback
        setData(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { data, isLoading, error };
}

export function useProductsByCategory(category?: string) {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Fetch from PostgreSQL API
        const response = await api.get(`/products?category=${encodeURIComponent(category)}`);
        // Transform API response to match our Product type
        const products = response.products.map((product: any) => ({
          id: product.id.toString(),
          title: product.name,
          shortDescription: product.description || '',
          description: product.description || '',
          price: product.price,
          originalPrice: product.price,
          image: product.image_url || '/images/placeholder.jpg',
          images: product.image_url ? [product.image_url] : ['/images/placeholder.jpg'],
          category: product.category_name || 'other',
          brand: product.brand_name || 'Unknown',
          specifications: product.specifications || {},
          available: true,
          rating: 4.5,
          reviewsCount: 0,
          tags: [],
          inStock: true,
          sku: `SKU-${product.id}`,
          weight: '1kg',
          dimensions: '10x10x10cm',
          material: 'Various',
          color: 'Various',
          warranty: '1 year'
        }));
        setData(products);
      } catch (err) {
        console.warn('Failed to fetch products by category from API, using fallback data:', err);
        // Use static data as fallback
        const filtered = fallbackProducts.filter(p => p.category === category);
        setData(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return { data, isLoading, error };
}

export function useProduct(id: string) {
  const [data, setData] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        // Fetch from PostgreSQL API
        const product = await api.get(`/products/${id}`);
        // Transform API response to match our Product type
        const transformedProduct = {
          id: product.id.toString(),
          title: product.name,
          shortDescription: product.description || '',
          description: product.description || '',
          price: product.price,
          originalPrice: product.price,
          image: product.image_url || '/images/placeholder.jpg',
          images: product.image_url ? [product.image_url] : ['/images/placeholder.jpg'],
          category: product.category_name || 'other',
          brand: product.brand_name || 'Unknown',
          specifications: product.specifications || {},
          available: true,
          rating: 4.5,
          reviewsCount: 0,
          tags: [],
          inStock: true,
          sku: `SKU-${product.id}`,
          weight: '1kg',
          dimensions: '10x10x10cm',
          material: 'Various',
          color: 'Various',
          warranty: '1 year'
        };
        setData(transformedProduct);
      } catch (err) {
        console.warn('Failed to fetch product from API, using fallback data:', err);
        // Use static data as fallback
        const product = fallbackProducts.find(p => p.id === id) || null;
        setData(product);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { data, isLoading, error };
}