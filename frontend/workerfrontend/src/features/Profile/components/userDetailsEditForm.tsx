import { useForm } from '@tanstack/react-form';
import { useUpdateUser } from '../hooks/userHooks';
import type { User } from '../types';
import { useAuth0 } from '@auth0/auth0-react';

interface UserDetailsEditFormProps {
  initialValues?: Partial<User>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function UserDetailsEditForm({ 
  initialValues,
  onSuccess,
  onClose
}: UserDetailsEditFormProps) {
  const { user } = useAuth0();
  const { mutate: updateUser } = useUpdateUser();

  const form = useForm({
    defaultValues: {
      userName: initialValues?.userName || '',
      mail: initialValues?.mail || '',
      phoneNumber: initialValues?.phoneNumber || '',
      businessId: initialValues?.businessId || '',
      address: initialValues?.address || '',
    },
    onSubmit: async ({ value }) => {
      try {
        const userUpdate = {
          userName: value.userName,
          mail: value.mail,
          phoneNumber: value.phoneNumber,
          businessId: value.businessId,
          address: value.address
        };

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
                <h3 className="text-lg font-medium text-gray-900">Yhteystiedot</h3>
              
                <form.Field
                  name="phoneNumber"
                  children={(field) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Puhelinnumero
                      </label>
                      <input
                        type="tel"
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
                        Y-tunnus
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
                  name="address"
                  children={(field) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Osoite
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