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
        instant created_at "CreationTimestamp, not null, updatable=false"
        instant updated_at "UpdateTimestamp, not null"
    }
    
    BaseProfile {
        string first_name "not blank, max 100"
        string last_name "not blank, max 100"
        text bio "max 5000, optional"
        string street_address "max 255, optional"
        string postal_code "max 40, optional"
        string city "max 100, optional"
        string country "max 100, optional"
        string website_link "URL, max 2048, optional"
        string profile_image_url "URL, max 2048, optional"
        boolean is_verified "default false"
        string status "ProfileStatus ENUM: ACTIVE|DELETED|SUSPENDED"
        instant created_at "CreationTimestamp"
        instant updated_at "UpdateTimestamp"
        instant deleted_at "optional"
    }

    %% ========== CONCRETE ENTITIES ==========
    User {
        string user_name PK "Auth0 user ID"
        string mail "not null"
        string business_id "default empty"
        string address "default empty"
        string phone_number "default empty"
    }

    Tasker_Profile {
        long tasker_profile_id PK "auto-generated"
        string user_id FK "OneToOne with User, unique, not null"
        decimal average_rating "precision 3 scale 2, optional"
    }

    Employer_Profile {
        long employer_profile_id PK "auto-generated"
        string user_id FK "OneToOne with User, unique, not null"
        string employer_type "ENUM: INDIVIDUAL|COMPANY, not null"
        string company_name "optional"
        string business_id "optional"
    }

    Task {
        long id PK "auto-generated"
        string user_name FK "ManyToOne with User"
        string title "not null"
        int price "default 0"
        datetime start_date "default now"
        datetime end_date "default now"
        text description "default empty"
        string status "TaskStatus ENUM: ACTIVE|IN_PROGRESS|COMPLETED|DELETED"
        instant created_at "from baseClass"
        instant updated_at "from baseClass"
    }

    Category {
        long category_id PK "auto-generated"
        string title "not null, unique"
        instant created_at "from baseClass"
        instant updated_at "from baseClass"
    }

    Location {
        long location_id PK "auto-generated"
        string street_address "optional"
        string postal_code "optional"
        string city "not null"
        string country "not null"
        decimal latitude "precision 9 scale 6, optional"
        decimal longitude "precision 9 scale 7, optional"
    }

    Application {
        string user_name PK_FK "composite key, ManyToOne with User"
        long task_id PK_FK "composite key, ManyToOne with Task"
        int price_suggestion "default 0"
        datetime time_suggestion "default now"
        text description "default empty"
        string apply_status "ApplicationStatus ENUM: PENDING|ACCEPTED|REJECTED"
        instant created_at "from baseClass"
        instant updated_at "from baseClass"
    }

    Review {
        long id PK "auto-generated"
        long task_id FK "ManyToOne with Task, not null"
        string reviewer_id FK "ManyToOne with User, not null"
        string reviewee_id FK "ManyToOne with User, not null"
        int rating "1-5, not null, CHECK constraint"
        text comment "max 1000, optional"
        instant created_at "from baseClass"
        instant updated_at "from baseClass"
    }

    %% ========== JOIN TABLES (Many-to-Many relationships) ==========
    Task_Category {
        long task_id PK_FK
        long category_id PK_FK
    }

    Task_Location {
        long task_id PK_FK
        long location_id PK_FK
    }

    %% ========== RELATIONSHIPS ==========
    
    %% User relationships
    User ||--o| Tasker_Profile : "has one (OneToOne, user_id unique)"
    User ||--o| Employer_Profile : "has one (OneToOne, user_id unique)"
    User ||--o{ Task : "posts (OneToMany via user_name)"
    User ||--o{ Application : "applies to tasks (OneToMany as user)"
    User ||--o{ Review : "gives reviews (OneToMany as reviewer)"
    User ||--o{ Review : "receives reviews (OneToMany as reviewee)"

    %% Task relationships
    Task ||--o{ Application : "has applications (OneToMany)"
    Task ||--o{ Review : "has reviews (OneToMany)"
    Task }o--o{ Category : "categorized by (ManyToMany via Task_Category)"
    Task }o--o{ Location : "located at (ManyToMany via Task_Location)"

    %% Join table relationships
    Task ||--|{ Task_Category : "links"
    Category ||--|{ Task_Category : "links"
    Task ||--|{ Task_Location : "links"
    Location ||--|{ Task_Location : "links"

    %% Composite key relationships
    Application }o--|| User : "applicant"
    Application }o--|| Task : "applied task"
    
    Review }o--|| Task : "reviewed task"
    Review }o--|| User : "reviewer"
    Review }o--|| User : "reviewee"

    %% ========== INHERITANCE NOTES ==========
    %% Tasker_Profile extends BaseProfile (includes all BaseProfile fields)
    %% Employer_Profile extends BaseProfile (includes all BaseProfile fields)
    %% Task extends baseClass (includes created_at, updated_at)
    %% Category extends baseClass (includes created_at, updated_at)
    %% Application extends baseClass (includes created_at, updated_at)
    %% Review extends baseClass (includes created_at, updated_at)
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
