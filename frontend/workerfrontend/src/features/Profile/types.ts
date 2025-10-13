export type EmployerType = 'INDIVIDUAL' | 'COMPANY'
export interface User {
  userName: string;
  mail: string;
  businessId: string;
  phoneNumber: string;
  address: string;
}

export interface TaskerProfile { 
    firstName: string,
    lastName: string,
    bio: string,
    streetAddress: string,
    postalCode: string,
    city: string,
    country: string,
    websiteLink: string,
    profileImageUrl: string,
}

export interface EmployerProfile {
    userId: string,
    firstName: string,
    lastName: string,
    employerType: string,
    streetAddress: string,
    postalCode: string,
    city: string,
    country: string,    
    bio: string,
    companyName: string,
    businessId: string,
    websiteLink: string,
    profileImageUrl: string,
}

export interface Auth0User{
  name: string
  email: string
}
