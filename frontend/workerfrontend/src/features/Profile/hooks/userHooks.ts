import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { createUser, getUser, updateUser} from "../api/profileApi";
import type { User } from "../types";

export function useGetUserDetails() {
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();

    return useQuery({
        queryKey: ['userDetails', user?.sub],
        queryFn: () => getUser(getAccessTokenSilently, user?.sub),
        enabled: isAuthenticated
    });
}

export function useUpdateUser() {
    const { user, getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(userData:Partial<User>) => {
                if (!user?.sub) {
                    throw new Error("No user authenticated");
                }
                updateUser(getAccessTokenSilently, userData)
        },
        onSuccess:(data) => {
            queryClient.invalidateQueries({ queryKey: ['userDetails'] });
        },
        onError: (error) => {
            console.error('Failed to update user:', error);
        }      
    });
}

export function useCreateUser() {
    const { user, getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData: User) => {
            if (!user?.sub) {
                throw new Error("No user authenticated")
            }
            return createUser(getAccessTokenSilently, userData);
        },
        onSuccess: (data) => {
            // Invalidate and refetch user queries
            queryClient.invalidateQueries({ queryKey: ['userDetails'] });
        },
    });
}