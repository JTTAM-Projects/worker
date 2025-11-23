import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../auth/useAuth";
import { getEmployerProfile, updateEmployer, createEmployerProfile } from "../api/profileApi";
import type { EmployerProfile } from "../types";

export function useGetEmployerProfile() {
    const { getAccessTokenSilently, isAuthenticated } = useAuth();

    return useQuery({
        queryKey: ['employerDetails'],
        queryFn: () => getEmployerProfile(getAccessTokenSilently),
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateEmployerProfile() {
    const { user, getAccessTokenSilently } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (employerData: EmployerProfile) => {
            if (!user?.sub) {
                throw new Error("No user authenticated");
            }
            return createEmployerProfile(getAccessTokenSilently, employerData);
        },
        onSuccess: () => {
            // Invalidate and refetch user queries
            queryClient.invalidateQueries({ queryKey: ['employerDetails'] });
        },
        onError: (error) => {
            console.error('Failed to create employer profile: ', error);
        }
    });
}

export function useUpdateEmployer() {
    const { user, getAccessTokenSilently } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(employerData:Partial<EmployerProfile>) => {
                if (!user?.sub) {
                    throw new Error("No user authenticated");
                }
                return updateEmployer(getAccessTokenSilently, employerData);
        },
        onSuccess:() => {
            queryClient.invalidateQueries({ queryKey: ['employerDetails'] });
        },
        onError: (error) => {
            console.error('Failed to update user:', error);
        }      
    });
}
