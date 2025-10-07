import { useForm } from '@tanstack/react-form';
import { useUpdateUser } from '../../hooks/userHooks';
import { useCreateEmployerProfile, useGetEmployerProfile, useUpdateEmployer } from '../../hooks/EmployerHooks'
import type { User, EmployerProfile } from '../../types';
import { useAuth0 } from '@auth0/auth0-react';


export default function EmployerDetailsEditForm({ 
  initialValues,
  onSuccess,
  onClose
}: { 
  initialValues?: Partial<User & EmployerProfile>;
  onSuccess?: () => void;
  onClose?: () => void;
}) {
  const { user } = useAuth0();
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: updateEmployer} = useUpdateEmployer();
  const { mutate: createEmployer } = useCreateEmployerProfile();
  const { data: employerProfile } = useGetEmployerProfile();

  const form = useForm({
    defaultValues: {
      //USER FIELDS
      userName: initialValues?.userName,
      mail: initialValues?.mail,
      businessId: initialValues?.businessId || '',
      phoneNumber: initialValues?.phoneNumber || '',
      address: initialValues?.address || '',

      //EMPLOYER FIELDS
      firstName: initialValues?.firstName || '',
      lastName: initialValues?.lastName || '',
      employerType: initialValues?.employerType || '',
      streetAddress: initialValues?.streetAddress || '',
      postalCode: initialValues?.postalCode || '',
      city: initialValues?.city || '',
      country: initialValues?.country || '',       
      bio: initialValues?.bio || '', 
      companyName: initialValues?.companyName || '',
      websiteLink: initialValues?.websiteLink || '',
      profileImageUrl: initialValues?.profileImageUrl || ''
    },
    onSubmit: async ({ value }) => {
      try {
        const userUpdate = {
          userName: initialValues?.userName,
          mail: initialValues?.mail,
          businessId: value.businessId, 
          phoneNumber: value.phoneNumber, 
          address: value.address
        }
        const employerUpdate = {
          userId: initialValues?.userName,
          firstName: value.firstName, 
          lastName: value.lastName, 
          employerType: value.employerType, 
          streetAddress: value.streetAddress, 
          postalCode: value.postalCode, 
          city: value.city, 
          country: value.country, 
          bio: value.bio,
          companyName: value.companyName, 
          companyBusinessId: value.businessId,
          websiteLink: value.websiteLink,
          profileImageUrl: value.profileImageUrl,
        }

        const employerToCreate = {
          employerProfileId: '', // or generate a new ID if needed
          userId: user?.sub || '',  // Auth0 user ID
          firstName: value.firstName,
          lastName: value.lastName,
          employerType: "INDIVIDUAL",  // Hardcoded as per requirement
          streetAddress: value.streetAddress,
          postalCode: value.postalCode,
          city: value.city,
          country: value.country,
          bio: value.bio || '',
          companyName: value.companyName,
          businessId: value.businessId,
          websiteLink: value.websiteLink || '',
          profileImageUrl: value.profileImageUrl || '',
        };

        if (employerProfile) {
          await updateEmployer(employerUpdate);
        }else {
            await createEmployer(employerToCreate/* {
            userId: employerToCreate.userId,
            firstName: employerToCreate.firstName,
            lastName: employerToCreate.lastName,
            employerType: employerToCreate.employerType,
            streetAddress: employerToCreate.streetAddress,
            postalCode: employerToCreate.postalCode,
            city: employerToCreate.city,
            country: employerToCreate.country,
            bio: employerToCreate.bio,
            companyName: employerToCreate.companyName,
            businessId: employerToCreate.businessId,
            websiteLink: employerToCreate.websiteLink,
            profileImageUrl: employerToCreate.profileImageUrl
            } */);
        }

        await updateUser(userUpdate);
        
        onSuccess?.();
        onClose?.();
      } catch (error) {
        console.error('Failed to update user details:', error);
      }
    }
  });

  return (
    <div className="fixed inset-0 z-50">
    <div 
      className="absolute inset-0 bg-gray-800/30 backdrop-blur-sm"
      onClick={onClose}
    />
    <div className="relative z-50 flex items-center justify-center min-h-screen p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Muokkaa profiilia</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
        </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
            className="flex flex-col flex-1 overflow-hidden"
          >
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Yhteystietosi</h3>
              <form.Field
                name="firstName"
                children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Etunimi
                    </label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                )}
              />

              <form.Field
                name="lastName"
                children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sukunimi
                    </label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                )}
              />

              <form.Field
                name="phoneNumber"
                children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Puhelinnumero
                    </label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                )}
              />              
              <form.Field
                name="businessId"
                children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Henkilökohtainen Y-tunnuksesi
                    </label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                )}
              />
              <h3 className="text-lg font-medium text-gray-900">Yrityksesi tiedot</h3>
              <form.Field
                name="companyName"
                children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Yrityksen nimi
                    </label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                )}
              />

              <form.Field
                name="employerType"
                children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Työnantaja tyyppi
                    </label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                )}
              />

              <form.Field
                name="streetAddress"
                children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Katuosoite
                    </label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                )}
              />

              <form.Field
                name="postalCode"
                children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Postikoodi
                    </label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                )}
              />

              <form.Field
                name="city"
                children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kaupunki
                    </label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                )}
              />

              <form.Field
                name="country"
                children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Maa
                    </label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                )}
              />

              <form.Field
                name="websiteLink"
                children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Verkkosivuston linkki
                    </label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                )}
              />

              <form.Field
                name="businessId"
                children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Yrityksesi Y-tunnus
                    </label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                )}
              />

              <form.Field
                name="bio"
                children={(field) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kuvaus Yrityksestäsi
                    </label>
                    <textarea
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full border rounded-md px-3 py-2"
                      placeholder="Kuvaile yritystäsi"
                    />
                  </div>
                )}
              />
            </div>
          </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Tallenna muutokset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}