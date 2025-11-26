import { useAuth0 } from "react-native-auth0";
import { useCallback, useEffect, useState } from "react";
import { TaskerProfile } from "../types";
import { createTaskerProfile, fetchTaskerProfile } from "../api";

export function useProfile() {
 const { getCredentials } = useAuth0();
 const [ data, setData ] = useState<TaskerProfile>(null);
 const [ loading, setLoading] = useState<Boolean>(true)

 const load = useCallback(async () => {
    const credentials = await getCredentials()
    const token = credentials.accessToken
    const result = await fetchTaskerProfile(token);
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, refetch: load, loading };
}

export function useCreateProfile() {
 const { getCredentials } = useAuth0();
 const [ data, setData ] = useState<TaskerProfile>(null);

 const create = useCallback(async (details : TaskerProfile) => {
    const credentials = await getCredentials()
    const token = credentials.accessToken
    const result = await createTaskerProfile(token, details);
    setData(result);
  }, []);

  return { data, create };
}