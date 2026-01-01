import { useAuth } from '@/hooks/Authcontext';
import { useRouter } from 'next/navigation';

export function useDeliveryFlow() {
  const { user } = useAuth();
  const router = useRouter();
  
  const startDeliveryFlow = (deliveryData) => {
    if (!user) {
      // Store delivery data and redirect to login
      sessionStorage.setItem('pendingDelivery', JSON.stringify(deliveryData));
      sessionStorage.setItem('redirectAfterLogin', '/create-delivery');
      router.push('/login');
    } else {
      // User is logged in, proceed to create delivery
      sessionStorage.setItem('deliveryData', JSON.stringify(deliveryData));
      router.push('/create-delivery');
    }
  };
  
  return { startDeliveryFlow };
}