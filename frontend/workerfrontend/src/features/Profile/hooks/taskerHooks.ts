import { useAuth0 } from "@auth0/auth0-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getTaskerProfile, createTaskerProfile, updateTasker } from "../api/profileApi";
import type { TaskerProfile } from "../types";

export function useGetTaskerDetails(){
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    return useQuery({
        queryKey: ['taskerDetails'],
        queryFn: () => getTaskerProfile(getAccessTokenSilently),
        enabled: isAuthenticated
    });
}

export function useCreateTasker(){
    const { user, getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (taskerData: TaskerProfile) => {
            if (!user?.sub) {
                throw new Error("No user authenticated");
            }
            return createTaskerProfile(getAccessTokenSilently, taskerData);
        },
        onSuccess: () => {
            // Invalidate and refetch user queries
            queryClient.invalidateQueries({ queryKey: ['taskerDetails'] });
        },
        onError: (error) => {
            console.error('Failed to create tasker profile: ', error);
        }
    });
}

export function useUpdateTaskerDetails(){ 
    const { user, getAccessTokenSilently } = useAuth0();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async(taskerData:Partial<TaskerProfile>) => {
                if (!user?.sub) {
                    throw new Error("No user authenticated");
                }
                return updateTasker(getAccessTokenSilently, taskerData);
        },
        onSuccess:() => {
            queryClient.invalidateQueries({ queryKey: ['taskerDetails'] });
        },
        onError: (error) => {
            console.error('Failed to update user:', error);
        }      
    });
}