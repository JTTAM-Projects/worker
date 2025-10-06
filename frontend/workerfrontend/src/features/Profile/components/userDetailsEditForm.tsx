import { useForm } from '@tanstack/react-form';
import { useUpdateUser } from '../hooks/userHooks';
import type { User } from '../types';

interface FormValues {
  businessId: string;
  phoneNumber: string;
  address: string;
}

export default function UserDetailsEditForm({ 
  initialValues,
  onSuccess 
}: { 
  initialValues?: Partial<User>;
  onSuccess?: () => void;
}) {
  const { mutate: updateUser } = useUpdateUser();

  const form = useForm({
    defaultValues: {
      userName: initialValues?.userName,
      mail: initialValues?.mail,
      businessId: initialValues?.businessId || '',
      phoneNumber: initialValues?.phoneNumber || '',
      address: initialValues?.address || ''
    },
    onSubmit: async ({ value }: { value: FormValues }) => {
      try {
        await updateUser(value);
        onSuccess?.();
      } catch (error) {
        console.error('Failed to update user details:', error);
      }
    }
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div className="space-y-4">
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
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Tallenna muutokset
        </button>
      </div>
    </form>
  );
}