import { useGetApplication, useGetAllUserApplications } from "../features/application/hooks/useGetApplication";
import { useAuth0 } from "@auth0/auth0-react";
import { useMemo } from 'react'
import ApplicationToList from "../features/application/components/applicationsToList";


export default function ActiveApplicationsPage() {

  const { data: userApplication } = useGetApplication(10);
  const { data: userApplications } = useGetAllUserApplications({
    page: 0,
    size: 5,
    applicationStatus: 'PENDING'
  });

/*   //debugging
  console.log('Raw userApplications:', userApplications);
  console.log('userApplications type:', typeof userApplications);
  console.log('userApplications keys:', userApplications ? Object.keys(userApplications) : 'no keys'); */
  console.log('First application structure:', userApplications?.[0]); 


  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Aktiiviset hakemukset
      </h1>
      <div className="debug-info bg-gray-100 p-4 mb-4">
        <h3>Debug Info:</h3>
        <p>Applications count: {userApplications?.length}</p>
        <p>Single application status: {userApplications?.[0]?.applicationStatus}</p>
      </div>
      <ApplicationToList applications={userApplications} /> 
    </div>
  );
}
