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
    %% ========== BASE CLASSES (MappedSuperclass - not actual tables) ==========
    baseClass {
        instant created_at "CreationTimestamp"
        instant updated_at "UpdateTimestamp"
    }
    
    BaseProfile {
        string first_name "not blank, max 100"
        string last_name "not blank, max 100"
        text bio "max 5000"
        string street_address "max 255"
        string postal_code "max 40"
        string city "max 100"
        string country "max 100"
        string website_link "URL, max 2048"
        string profile_image_url "URL, max 2048"
        boolean is_verified "default false"
        string status "ACTIVE|DELETED|SUSPENDED"
        instant created_at
        instant updated_at
        instant deleted_at
    }

    %% ========== CONCRETE ENTITIES ==========
    User {
        string user_name PK "Auth0 user ID"
        string mail "not null"
        string business_id
        string address
        string phone_number
    }

    Tasker_Profile {
        long tasker_profile_id PK
        string user_id FK "unique"
        decimal average_rating "precision 3 scale 2"
    }

    Employer_Profile {
        long employer_profile_id PK
        string user_id FK "unique"
        string employer_type "INDIVIDUAL|COMPANY"
        string company_name
        string business_id
    }

    Task {
        long id PK
        string user_name FK
        string title
        int price
        datetime start_date
        datetime end_date
        text description
        string status "ACTIVE|IN_PROGRESS|COMPLETED"
        instant created_at
        instant updated_at
    }

    Category {
        long category_id PK
        string title "unique"
        instant created_at
        instant updated_at
    }

    Location {
        long location_id PK
        string street_address
        string postal_code
        string city "not null"
        string country "not null"
        decimal latitude "precision 9 scale 6"
        decimal longitude "precision 9 scale 7"
    }

    Application {
        string user_name PK,FK
        long task_id PK,FK
        int price_suggestion
        datetime time_suggestion
        text description
        string apply_status "PENDING|ACCEPTED|REJECTED"
        instant created_at
        instant updated_at
    }

    Review {
        long id PK
        long task_id FK
        string reviewer_id FK
        string reviewee_id FK
        int rating "1-5"
        text comment "max 1000"
        instant created_at
        instant updated_at
    }

    Task_Category {
        long task_id PK,FK
        long category_id PK,FK
    }

    Task_Location {
        long task_id PK,FK
        long location_id PK,FK
    }

    %% ========== RELATIONSHIPS ==========
    
    User ||--o| Tasker_Profile : "has one"
    User ||--o| Employer_Profile : "has one"
    User ||--o{ Task : "posts"
    User ||--o{ Application : "applies"
    User ||--o{ Review : "gives"
    User ||--o{ Review : "receives"

    Task ||--o{ Application : "has applications"
    Task ||--o{ Review : "has reviews"
    Task }o--o{ Category : "categorized by"
    Task }o--o{ Location : "located at"

    Task ||--|{ Task_Category : "links"
    Category ||--|{ Task_Category : "links"
    Task ||--|{ Task_Location : "links"
    Location ||--|{ Task_Location : "links"

    Application }o--|| User : "applicant"
    Application }o--|| Task : "for task"
    
    Review }o--|| Task : "reviewed task"
    Review }o--|| User : "reviewer"
    Review }o--|| User : "reviewee"
```
## Swagger-UI

When you run Java-application on localhost, you can find api-documentation in this address:
[Swagger-ui](http://localhost:8080/swagger-ui/index.html#/)

## Backend

Java version 17.0.12

**MacOS & Windows**  
Terminal commands:

```bash
cd glig
```

```bash
./mvnw spring-boot:run
```

## Authors
* Aku Ihamuotila
* Tuomas Jaakkola
* Jani Könönen
* Tuomas Leinonen
* Markus Mäntylä
