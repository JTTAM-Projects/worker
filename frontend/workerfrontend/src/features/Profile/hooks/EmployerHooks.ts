import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { getEmployerProfile, updateEmployer, createEmployerProfile } from "../api/profileApi";
import type { EmployerProfile } from "../types";

export function useGetEmployerProfile() {
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();

    return useQuery({
        queryKey: ['employerDetails'],
        queryFn: () => getEmployerProfile(getAccessTokenSilently),
        enabled: isAuthenticated
    });
}

export function useCreateEmployerProfile() {
    const { user, getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (employerData: EmployerProfile) => {
            if (!user?.sub) {
                throw new Error("No user authenticated");
            }
            return createEmployerProfile(getAccessTokenSilently, employerData);
        },
        onSuccess: (data) => {
            // Invalidate and refetch user queries
            queryClient.invalidateQueries({ queryKey: ['employerDetails'] });
        },
    });
}

export function useUpdateEmployer() {
    const { user, getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(employerData:Partial<EmployerProfile>) => {
                if (!user?.sub) {
                    throw new Error("No user authenticated");
                }
                return updateEmployer(getAccessTokenSilently, employerData);
        },
        onSuccess:(data) => {
            queryClient.invalidateQueries({ queryKey: ['employerDetails'] });
        },
        onError: (error) => {
            console.error('Failed to update user:', error);
        }      
    });
}

