/** Type of employer account (individual person or company) */
export type EmployerType = 'INDIVIDUAL' | 'COMPANY'

/** User data transfer object (matches backend DTO) */
export interface UserDto {
  userName: string;
  mail: string;
  businessId: string;
  phoneNumber: string;
  address: string;
}

/** Tasker (worker) profile information */
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

/** Employer profile information with company details */
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

/** Auth0 user data from authentication provider */
export interface Auth0User{
  name: string
  email: string
}
