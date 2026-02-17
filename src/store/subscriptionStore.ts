import { create } from 'zustand';
import { subscriptionService } from '@/services/subscriptionService';
import type { Plan, Subscription } from '@/types/subscription';

interface SubscriptionState {
    plans: Plan[];
    subscription: Subscription | null;
    isLoading: boolean;
    error: string | null;

    fetchPlans: () => Promise<void>;
    fetchSubscription: () => Promise<void>;
    upgrade: (planSlug: string) => Promise<string | null>;
    cancel: (immediately?: boolean) => Promise<boolean>;
    reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
    plans: [],
    subscription: null,
    isLoading: false,
    error: null,

    fetchPlans: async () => {
        set({ isLoading: true, error: null });
        try {
            const plans = await subscriptionService.getPlans();
            console.log("Plans set in store: ", plans);
            set({ plans: plans || [], isLoading: false });
        } catch (e: any) {
            console.error("Error loading plans: ", e);
            set({
                error: e.response?.data?.message || 'Error al cargar planes',
                isLoading: false,
            });
        }
    },

    fetchSubscription: async () => {
        set({ isLoading: true, error: null });
        try {
            const subscription = await subscriptionService.getCurrentSubscription();
            set({ subscription, isLoading: false });
        } catch (e: any) {
            set({
                error: e.response?.data?.message || 'Error al cargar suscripción',
                isLoading: false,
            });
        }
    },

    upgrade: async (planSlug: string) => {
        set({ isLoading: true, error: null });
        try {
            const result = await subscriptionService.upgrade(planSlug);
            set({ isLoading: false });
            return result.checkout_url;
        } catch (e: any) {
            set({
                error: e.response?.data?.message || 'Error al iniciar upgrade',
                isLoading: false,
            });
            return null;
        }
    },

    cancel: async (immediately = false) => {
        set({ isLoading: true, error: null });
        try {
            const subscription = await subscriptionService.cancel(immediately);
            set({ subscription, isLoading: false });
            return true;
        } catch (e: any) {
            set({
                error: e.response?.data?.message || 'Error al cancelar',
                isLoading: false,
            });
            return false;
        }
    },

    reset: () => set({ plans: [], subscription: null, isLoading: false, error: null }),
}));
