import { useState, useEffect, useCallback } from 'react';
import { fetchAllApplications, FetchApplicationParams } from '../api/get';
import { ApplicationWithDetails, PaginatedResponse } from '../types';
import { useAuth0 } from 'react-native-auth0';

export function useUserApplications (params?: FetchApplicationParams) {
  const {getCredentials} = useAuth0();
  const [data, setData] = useState<PaginatedResponse<ApplicationWithDetails> | null>(null);

  const load = useCallback(async () => {
    const credentials = await getCredentials();
    const token = credentials.accessToken
    const result = await fetchAllApplications(token, params || {});
    setData(result);
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, refetch: load };
}