export interface User {
  userName: string;
  mail: string;
  businessId: string;
  phoneNumber: string;
  address: string;
}

export interface TaskerProfile { 
    taskerProfileId: number,
    userId: string,
    averageRating: number,
    createdAt: Date,
    updatedAt: Date,
    firstName: string,
    lastName: string,
    bio: string,
    streetAddress: string,
    postalCode: string,
    city: string,
    country: string,
    websiteLink: string,
    profileImageUrl: string,
    verified: boolean
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