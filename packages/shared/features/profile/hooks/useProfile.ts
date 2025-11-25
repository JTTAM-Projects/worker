import { useAuth0 } from "react-native-auth0";
import { useCallback, useEffect, useState } from "react";
import { TaskerProfile } from "../types";
import { createTaskerProfile, fetchTaskerProfile } from "../api";

export function useProfile() {
 const { getCredentials } = useAuth0();
 const [ data, setData ] = useState<TaskerProfile>(null);

 const load = useCallback(async () => {
    const credentials = await getCredentials()
    const token = credentials.accessToken
    const result = await fetchTaskerProfile(token);
    console.log(result)
    setData(result);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, refetch: load };
}

export function useCreateProfile() {
 const { getCredentials } = useAuth0();
 const [ data, setData ] = useState<TaskerProfile>(null);;

 const create = useCallback(async (details : TaskerProfile) => {
    const credentials = await getCredentials()
    const token = credentials.accessToken
    const result = await createTaskerProfile(token, details);
    console.log(result)
    setData(result);
  }, []);

  return { data, create };
}