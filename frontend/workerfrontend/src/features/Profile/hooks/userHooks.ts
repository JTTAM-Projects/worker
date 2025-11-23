import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../auth/useAuth";
import { createUser, getUser, updateUser} from "../api/profileApi";
import type { User } from "../types";

export function useGetUserDetails() {
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth();

    return useQuery({
        queryKey: ['userDetails', user?.sub],
        queryFn: () => getUser(getAccessTokenSilently, user?.sub),
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
}

export function useUpdateUser() {
    const { user, getAccessTokenSilently } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(userData:Partial<User>) => {
                if (!user?.sub) {
                    throw new Error("No user authenticated");
                }
                updateUser(getAccessTokenSilently, userData)
        },
        onSuccess:() => {
            queryClient.invalidateQueries({ queryKey: ['userDetails'] });
        },
        onError: (error) => {
            console.error('Failed to update user:', error);
        }      
    });
}

export function useCreateUser() {
    const { user, getAccessTokenSilently } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: User) => {
            if (!user?.sub) {
                throw new Error("No user authenticated")
            }
            return createUser(getAccessTokenSilently, userData);
        },
        onSuccess: () => {
            // Invalidate and refetch user queries
            queryClient.invalidateQueries({ queryKey: ['userDetails'] });
        },
        onError: (error) => {
            console.error('Failed to create user', error);
        }
    });
}
