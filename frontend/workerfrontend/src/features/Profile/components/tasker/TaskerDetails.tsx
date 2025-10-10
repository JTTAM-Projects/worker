import { useState } from 'react';
import { useGetUserDetails } from "../../hooks/userHooks";
import { useGetTaskerDetails } from '../../hooks/taskerHooks'
import { useAuth0 } from '@auth0/auth0-react';

//TODO use props for user

export default function TaskerDetails () {

    const { user } = useAuth0();
    const { data: userDetails } = useGetUserDetails();
    //const { data: taskerDetails } = useGetTaskerDetails();
    const [ isEditing, setIsEditing ] = useState(false);

    const handleSaveClick = () => {
        setIsEditing(false);
    }

    const handleEditClick = () => {
        setIsEditing(true);
    }

    return (
        <div>
            <div className ="flex justify-between items center" >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Työntekijä tietosi</h2>
                    <button
                        className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 font-medium transition duration-150"
                        onClick={isEditing ? handleSaveClick : handleEditClick}
                    >
                        {isEditing ? 'Tallenna' : 'Muokkaa'}
                    </button>
            </div>

        {isEditing ? (
                <>
                    <h2 className="text-2xl font-bold text-gray-800 pt-4 pb-4">Tietoja sinusta</h2>
                    <div>
                        <textarea className="mt-1 text-gray-800" placeholder={"Tietoja ei löytynyt"} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 pt-4 pb-4">Yhteystiedot</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Sähköposti</h3>
                            <input className="mt-1 text-gray-800" placeholder= {`${user?.email || "Sähköpostia ei löytynyt"}`} />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Puhelinnumero</h3>
                            <input type='text' className="mt-1 text-gray-800" placeholder={`${userDetails?.phoneNumber || "Puhelinnumeroa ei löytynyt"}`} />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Osoite</h3>
                            <input type='text' className="mt-1 text-gray-800" placeholder={`${userDetails?.address || "Osoitetta ei löytynyt"}`} />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Henkilökohtainen Y-tunnuksesi</h3>
                            <input type='text' className="mt-1 text-gray-800" placeholder={`${userDetails?.businessId || "Y-tunnusta ei löytynyt"}`} />
                        </div>
                    </div>
                </>
        ) : (
            <>
                <h2 className="text-2xl font-bold text-gray-800 pt-4 pb-4">Tietoja sinusta</h2>
                <div>
                    <p className="mt-1 text-gray-800">Tietoja ei löytynyt</p>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 pt-4 pb-4">Yhteystiedot</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Sähköposti</h3>
                        <p className="mt-1 text-gray-800">{user?.email || "Sähköpostia ei löytynyt"}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Puhelinnumero</h3>
                        <p className="mt-1 text-gray-800">{userDetails?.phoneNumber || "Puhelinnumeroa ei löytynyt"}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Osoite</h3>
                        <p className="mt-1 text-gray-800">{userDetails?.address || "Osoitetta ei löytynyt"}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Henkilökohtainen Y-tunnuksesi</h3>
                        <p className="mt-1 text-gray-800">{userDetails?.businessId || "Y-tunnusta ei löytynyt"}</p>
                    </div>
                </div>
            </>
        )}
        </div>
    )
}