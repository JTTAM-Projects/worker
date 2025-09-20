# Gig-Based Job Platform

This project is a desktop-first (mobile-optimized) application designed to connect individuals seeking help ("Employers") with skilled individuals looking for work ("Taskers"). The platform facilitates the entire process from posting a job to secure payment and feedback.

## Core Features

The application is built around two primary user roles: the Employer and the Tasker.

### For Employers
* **Post & Manage Gigs:** Easily create new job listings with detailed descriptions, categories (e.g., yard work, cleaning, small repairs), a fixed price, and location. Employers can view and manage their active and archived job posts.
* **Review & Hire Applicants:** Receive notifications for new applicants. Browse applicant profiles, which include star ratings and written feedback from previous jobs, and hire the best candidate for the task.
* **Secure Payment System:** When a Tasker is hired, the payment is held in escrow. This assures the Tasker that the funds are available. The payment is released with a single click once the Employer confirms the job is completed.
* **Rate & Review Taskers:** After a job is complete, employers can leave a 1-5 star rating and public feedback, which is added to the Tasker's profile.

### For Taskers
* **Build Your Profile:** Create and maintain a public profile to showcase skills and expertise. The profile automatically builds a work history with all completed jobs and reviews from Employers.
* **Find & Apply for Gigs:** Browse all available jobs in a list or map view. Use powerful search and filter functions based on keywords, category, distance, and price to find suitable work.
* **Track Applications:** Keep track of all job applications and their status (Pending, Approved, Rejected) in a personal dashboard.
* **Track Your Earnings:** Receive payments instantly to your in-app balance after a job is marked as complete. View a comprehensive history of all earnings.

## Technology Stack
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)


## Entity-Relationship Diagram (ERD)

The following ERD shows the current database design structure and the logical relationships between entities.
```mermaid
erDiagram
    User {
        string user_id PK "unique, managed by Auth0"
        string email "unique"
        string first_name
        string last_name
        string phone_number
        string status "e.g., active, suspended"
        datetime created_at
    }

    Tasker_Profile {
        int tasker_profile_id PK
        string user_id FK "unique"
        text bio
        int location_id FK "optional, for home base"
        decimal average_rating
        boolean is_verified
    }

    Employer_Profile {
        long employer_profile_id PK
        string user_id FK "unique"
        string employer_type "e.g., INDIVIDUAL, COMPANY"
        int location_id FK "optional"
        text bio "optional"
        string company_name "optional"
        string business_id "optional"
        string website_link "optional"
        string profile_image_url "optional"
        boolean is_verified
        string status "e.g., ACTIVE, DELETED, SUSPENDED"
        datetime created_at
        datetime updated_at
        datetime deleted_at "optional"
    }

    Job_Category {
        int job_category_id PK
        string category_name
    }

    Location {
        int location_id PK
        string street_address
        string postal_code
        string city
        string country
        decimal latitude
        decimal longitude
    }

    Task {
        int task_id PK
        string employer_id FK
        int job_category_id FK
        string title
        text description
        decimal price
        datetime start_date
        datetime end_date
        string status "e.g., open, assigned, completed"
    }

    Task_Location {
        int task_id PK, FK
        int location_id PK, FK
    }

    Application {
        int application_id PK
        int task_id FK
        string tasker_id FK
        decimal price_suggestion
        text description
        string status "e.g., pending, accepted, rejected"
    }

    Review {
        int review_id PK
        int task_id FK
        string reviewer_id FK "User (Employer)"
        string reviewee_id FK "User (Tasker)"
        int rating "1-5"
        text comment
        datetime created_at
    }

    Conversation {
        int conversation_id PK
        int application_id FK
        datetime created_at
    }

    Message {
        int message_id PK
        int conversation_id FK
        string sender_id FK
        text content
        datetime sent_at
        boolean is_read
    }

    %% --- Relationships ---
    User |o--|| Tasker_Profile : "has one"
    User |o--|| Employer_Profile : "has one"
    User }o--|| Task : "posts"
    User }o--o| Application : "applies with"
    User }o--o| Message : "sends"
    User }o--o| Review : "as reviewer/reviewee"

    Location }o--o| Tasker_Profile : "optional home base"
    Location }o--o| Employer_Profile : "optional default address"

    Job_Category ||--o{ Task : "categorizes"

    Task ||--o{ Application : "has"
    Task ||--o{ Review : "is reviewed in"
    Task }o--o{ Location : "has (via Task_Location)"

    Task ||--|{ Task_Location : "links to"
    Location ||--|{ Task_Location : "links to"

    Application ||--o| Conversation : "can lead to"
    Conversation ||--o{ Message : "contains"
```

## Authors
* Aku Ihamuotila
* Tuomas Jaakkola
* Jani Könönen
* Tuomas Leinonen
* Markus Mäntylä
