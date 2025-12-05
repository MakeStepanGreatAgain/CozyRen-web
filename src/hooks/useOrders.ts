import { useState } from "react";
import { api } from "@/lib/api";

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface CreateOrderData {
  email: string;
  fullName: string;
  phone: string;
  deliveryMethod: string;
  deliveryAddress?: string;
  paymentMethod: string;
  items: OrderItem[];
  totalAmount: number;
}

interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  paymentUrl?: string;
  sberbankOrderId?: string;
  message?: string;
  error?: string;
}

export function useCreateOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutateAsync = async (orderData: CreateOrderData): Promise<CreateOrderResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/orders', orderData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create order";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutateAsync,
    isLoading,
    error,
  };
}