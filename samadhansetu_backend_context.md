# SAMADHANSETU — BACKEND IMPLEMENTATION CONTEXT

> **Purpose of this file**: This is the engineering/build-layer ground truth for the SamadhanSetu Spring Boot backend — the actual codebase realization of the Societal Innovation Collaboration Portal (see `PROJECT_CONTEXT.md` for the problem statement, vision, and competitive positioning). This file is written for AI-agent consumption, not human reading. It is authoritative for entities, package structure, controllers/services/repositories, dev sequence, and repo state. It is NOT a source for problem justification, competitive analysis, or pitch positioning — for that, defer to `PROJECT_CONTEXT.md`.

---

## 1. PROJECT METADATA

- `project_name`: SamadhanSetu
- `backend_stack`: Spring Boot (Java), Spring Data JPA, Spring Security/JWT, MySQL, Maven, Lombok
- `architecture_pattern`: Layered — `Controller → Service → Repository → Entity/Database`
- `github_repo`: Atharvsurya/SamadhanSetu
- `local_repo_path`: `C:\Users\Mokshith Shetty\Downloads\samadhansetu`
- `git_state_note`: Local `main` branch was previously behind `remote/main` (non-fast-forward). Recommended continuation: switch to `main`, `pull --rebase`, then push normally. Avoid `force push` and `reset --hard`.
- `relationship_to_PS`: This backend implements Modules 1–7 of PS26043 (see `PROJECT_CONTEXT.md` Section 3 for full module spec). Cross-reference that file for *why* a feature exists; use this file for *how* it's built.

---

## 2. ARCHITECTURE OVERVIEW (Module → Controller → Service → Repository → Entities)

| # | Module / Domain | Controller | Service | Repository | Core Entities / Responsibility |
|---|---|---|---|---|---|
| 1 | Authentication & RBAC | `AuthController` | `AuthService`, `UserService` | `UserRepository`, `RoleRepository` | User, Role, Citizen, NodalOfficer, Faculty, Student, Industry, Admin |
| 2 | Citizen Ingestion | `IssueController` | `IssueService` | `IssueRepository` | Issue, EvidenceMedia |
| 3 | AI Orchestration | `AiIntegrationController` | `AiBridgeService` | Uses `IssueRepository` & `UniversityRepository` | Webhooks/Python FastAPI, NLP, translation, deduplication, tags — **no dedicated JPA entity** |
| 4 | Academic Workspace | `UniversityController` | `UniversityService` | `UniversityRepository` | University, Department, FacultyProfile |
| 5 | R&D & Kanban Lifecycle | `ProjectController` | `ProjectService` | `ProjectRepository`, `TaskRepository` | Project, TeamMember, Milestone, Task, Kanban state |
| 6 | Industry & CSR | `IndustryController` | `IndustryService`, `VerificationService` | `OrganizationRepository`, `SponsorshipRepository` | Organization, Sponsorship, CIN/GSTIN/Udyam verification |
| 7 | Analytics & Heatmaps | `DashboardController` | `DashboardService` | Aggregates `IssueRepository` & `ProjectRepository` | Metric cards, domain counts, spatial GIS clusters — **no dedicated JPA entity** |
| 8 | Notifications & Feeds | `NotificationController` | `NotificationService` | `NotificationRepository` | Notification; status shifts and milestones |

### 2.1 Key Design Decisions
- CIN, GSTIN, and Udyam are modeled as **fields inside `Organization`**, not separate entities.
- **AI Orchestration** does not need a separate core JPA entity — uses `AiBridgeService` plus repositories and DTOs.
- **Analytics & Heatmaps** does not need a separate core JPA entity — `DashboardService` aggregates `Issue` and `Project` data and returns DTOs.

---

## 3. ENTITY INVENTORY (20 total JPA entities; enums not counted)

| # | Entity | Module | Main Content |
|---|---|---|---|
| 1 | Role | Authentication & RBAC | id, name, description |
| 2 | User | Authentication & RBAC | id, name, email, password, role |
| 3 | Citizen | Authentication & RBAC | user, phone, address |
| 4 | NodalOfficer | Authentication & RBAC | user, assigned area |
| 5 | Faculty | Authentication & RBAC | user, university, department |
| 6 | Student | Authentication & RBAC | user, university, department, enrollment number |
| 7 | Industry | Authentication & RBAC | user, organization |
| 8 | Admin | Authentication & RBAC | user |
| 9 | Issue | Citizen Ingestion | title, description, location, coordinates, status, priority, reporter |
| 10 | EvidenceMedia | Citizen Ingestion | issue, media URL, media type |
| 11 | University | Academic Workspace | name, code, location, departments |
| 12 | Department | Academic Workspace | name, code, university |
| 13 | FacultyProfile | Academic Workspace | faculty, designation, specialization, profile URL |
| 14 | Project | R&D & Kanban | title, description, status, university |
| 15 | TeamMember | R&D & Kanban | project, user, member role |
| 16 | Milestone | R&D & Kanban | project, title, dates, status |
| 17 | Task | R&D & Kanban | project, milestone, assignee, title, status, due date |
| 18 | Organization | Industry & CSR | name, CIN, GSTIN, Udyam, address, website |
| 19 | Sponsorship | Industry & CSR | organization, project, amount, status |
| 20 | Notification | Notifications & Feeds | user, title, message, read status, created time |

---

## 4. PACKAGE STRUCTURE

```
src/main/java/com/samadhansetu/model/
├── entity/
│   ├── Role.java
│   ├── User.java
│   ├── Citizen.java
│   ├── NodalOfficer.java
│   ├── Faculty.java
│   ├── Student.java
│   ├── Industry.java
│   ├── Admin.java
│   ├── Issue.java
│   ├── EvidenceMedia.java
│   ├── University.java
│   ├── Department.java
│   ├── FacultyProfile.java
│   ├── Project.java
│   ├── TeamMember.java
│   ├── Milestone.java
│   ├── Task.java
│   ├── Organization.java
│   ├── Sponsorship.java
│   └── Notification.java
└── enums/
    ├── RoleName.java
    ├── IssueStatus.java
    ├── IssuePriority.java
    ├── ProjectStatus.java
    ├── MilestoneStatus.java
    └── TaskStatus.java
```

---

## 5. RELATIONSHIP MODEL

```
Role
 ↓
User
 ├── Citizen
 ├── NodalOfficer
 ├── Faculty
 ├── Student
 ├── Industry
 └── Admin

Citizen → Issue → EvidenceMedia
University → Department → FacultyProfile → Faculty
University → Project
Project → TeamMember
Project → Milestone → Task
Project → Task
Industry → Organization → Sponsorship → Project
User → Notification
```

---

## 6. JPA / LOMBOK CONVENTIONS

- `imports`: `jakarta.persistence.*`, `lombok.*`
- Typical JPA annotations used: `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`, `@ManyToOne`, `@OneToOne`, `@OneToMany`, `@JoinColumn`, `@Enumerated`
- Typical Lombok annotations used: `@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`, `@Builder`
- ID generation strategy: `@GeneratedValue(strategy = GenerationType.IDENTITY)` used consistently across all entities.

---

## 7. SUPPORTING ENUMS (full source)

```java
// RoleName.java
public enum RoleName {
    CITIZEN, NODAL_OFFICER, FACULTY, STUDENT, INDUSTRY, ADMIN
}

// IssueStatus.java
public enum IssueStatus {
    REPORTED, VERIFIED, ASSIGNED, IN_PROGRESS, RESOLVED, REJECTED
}

// IssuePriority.java
public enum IssuePriority {
    LOW, MEDIUM, HIGH, CRITICAL
}

// ProjectStatus.java
public enum ProjectStatus {
    PLANNED, ACTIVE, ON_HOLD, COMPLETED, CANCELLED
}

// MilestoneStatus.java
public enum MilestoneStatus {
    PENDING, IN_PROGRESS, COMPLETED, DELAYED
}

// TaskStatus.java
public enum TaskStatus {
    TODO, IN_PROGRESS, REVIEW, DONE
}
```

---

## 8. CORE ENTITY CODE TEMPLATES (full source, as-established)

```java
// Role.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Role {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String name;
    private String description;
}
```

```java
// User.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;
}
```

```java
// Citizen.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Citizen {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    private String phone;
    private String address;
}
```

```java
// NodalOfficer.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class NodalOfficer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    private String assignedArea;
}
```

```java
// Faculty.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Faculty {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    @ManyToOne
    private University university;
    @ManyToOne
    private Department department;
}
```

```java
// Student.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    @ManyToOne
    private University university;
    @ManyToOne
    private Department department;
    private String enrollmentNumber;
}
```

```java
// Industry.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Industry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    @ManyToOne
    private Organization organization;
}
```

```java
// Admin.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Admin {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
}
```

```java
// Issue.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Issue {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String location;
    private String latitude;
    private String longitude;
    @Enumerated(EnumType.STRING)
    private IssueStatus status;
    @Enumerated(EnumType.STRING)
    private IssuePriority priority;
    @ManyToOne
    private Citizen reportedBy;
    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL)
    private List<EvidenceMedia> evidenceMedia = new ArrayList<>();
}
```

```java
// EvidenceMedia.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class EvidenceMedia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;
    private String mediaUrl;
    private String mediaType;
}
```

```java
// University.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class University {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    private String code;
    private String location;
    @OneToMany(mappedBy = "university")
    private List<Department> departments = new ArrayList<>();
}
```

```java
// Department.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    private String code;
    @ManyToOne
    @JoinColumn(name = "university_id", nullable = false)
    private University university;
}
```

```java
// FacultyProfile.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class FacultyProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "faculty_id", nullable = false, unique = true)
    private Faculty faculty;
    private String designation;
    private String specialization;
    private String profileUrl;
}
```

```java
// Project.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Project {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Enumerated(EnumType.STRING)
    private ProjectStatus status;
    @ManyToOne
    private University university;
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<TeamMember> teamMembers = new ArrayList<>();
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<Milestone> milestones = new ArrayList<>();
}
```

```java
// TeamMember.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class TeamMember {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    private String memberRole;
}
```

```java
// Milestone.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.util.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Milestone {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    private String title;
    private LocalDate startDate;
    private LocalDate dueDate;
    @Enumerated(EnumType.STRING)
    private MilestoneStatus status;
    @OneToMany(mappedBy = "milestone")
    private List<Task> tasks = new ArrayList<>();
}
```

```java
// Task.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Table(name = "tasks")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    @ManyToOne
    private Milestone milestone;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    @ManyToOne
    private User assignee;
    @Enumerated(EnumType.STRING)
    private TaskStatus status;
    private LocalDate dueDate;
}
```

```java
// Organization.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Organization {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    @Column(unique = true)
    private String cin;
    @Column(unique = true)
    private String gstin;
    @Column(unique = true)
    private String udyam;
    private String address;
    private String website;
}
```

```java
// Sponsorship.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Sponsorship {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
    private BigDecimal amount;
    private String status;
}
```

```java
// Notification.java
package com.samadhansetu.model.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String message;
    private boolean readStatus;
    private LocalDateTime createdAt;
}
```

---

## 9. DEVELOPMENT SEQUENCE (fixed phase order)

```
PHASE 1  → Model / Entities
PHASE 2  → Repositories
PHASE 3  → Services
PHASE 4  → REST Controllers
PHASE 5  → DTOs
PHASE 6  → Authentication + RBAC
PHASE 7  → JWT / Spring Security
PHASE 8  → Citizen Issue Workflow
PHASE 9  → Academic Workspace
PHASE 10 → R&D / Project / Kanban
PHASE 11 → Industry / CSR
PHASE 12 → Notifications
PHASE 13 → AI Orchestration
PHASE 14 → Analytics / Dashboard / Heatmaps
PHASE 15 → Testing
PHASE 16 → Deployment
```

### 9.1 Immediate Next Step Rule
- Model layer is first. After entities compile successfully → repositories → services → controllers, **module-by-module**. Do NOT create all controllers randomly at once.

### 9.2 Module Build Order (detailed)
```
Authentication:
  RoleRepository + UserRepository
    ↓
  AuthService + UserService
    ↓
  AuthController

Citizen:
  IssueRepository
    ↓
  IssueService
    ↓
  IssueController

Then, in order:
  Academic → R&D/Kanban → Industry/CSR → Notifications → AI → Analytics
```

---

## 10. EXISTING PROJECT / SESSION CONTEXT

- User's prior working stack: Spring Boot, Spring Data JPA, REST APIs, Spring Security/JWT, MySQL, Maven.
- User preference: wants implementation **explained and built in sequence**, not disconnected code snippets.
- User previously shared `UniversityController` from the GitHub repo and has repo access.
- Previously generated deliverables in this project's history: a model-package ZIP and a model-code PDF (both containing the 20 entity classes + supporting enums).

---

## 11. CONTINUATION RULE (authoritative — read before making changes)

- Preserve the architecture in Sections 2–5 above.
- **Use the existing repository code as source of truth** where it differs from any starter template or suggestion.
- **Inspect existing classes first** before replacing them.
- Keep strict `Controller → Service → Repository → Entity` separation — do not collapse layers.

---

## 12. CROSS-REFERENCE MAP TO `PROJECT_CONTEXT.md` (PS26043 + literature review)

| This file (implementation) | `PROJECT_CONTEXT.md` section (vision/spec) | Status |
|---|---|---|
| Module 1 — Authentication & RBAC | Not a named PS module; supports Section 6 (Stakeholder Roles) | Foundational layer, PS-implied not PS-named |
| Module 2 — Citizen Ingestion | Section 3.1 / Section 4.2 (MVP) | Matches MVP scope — correctly omits Aadhaar OTP/DigiLocker |
| Module 3 — AI Orchestration | Section 3.2 / Section 4.3 (MVP) | Matches MVP scope — correctly has no dedicated entity |
| Module 4 — Academic Workspace | Section 3.3 / Section 4.4 (MVP) | Strong match |
| Module 5 — R&D & Kanban Lifecycle | Section 3.3 (Team Formation) + Section 3.5 (Stage-Gate) | Good match; `ProjectStatus` enum uses generic PM terms, not PS's named stage-gates (`Problem Validation → Design → Prototype → Field Testing → Deployment`) |
| Module 6 — Industry & CSR | Section 3.4 / Section 4.6 (deferred in MVP) | **Scope note**: PS's MVP guidance says to mock this with hardcoded data; SamadhanSetu is building it fully (real entities + CIN/GSTIN/Udyam verification) — a deliberate expansion beyond MVP scope |
| Module 7 — Analytics & Heatmaps | Section 3.6 | Conceptual match; **gap**: `Issue.java` uses plain `String latitude/longitude`, not PostGIS geometry — won't support real spatial clustering per Section 3.8's PostGIS recommendation without a schema change |
| Module 8 — Notifications & Feeds | Section 3.7 / Section 4.6 (MVP) | Matches MVP scope — in-app only, no real SMS/WhatsApp API integration |

### 12.1 Known Gaps vs. Full PS Vision (not yet in entities/fields)
- No EXIF/geotag verification or OCR fields (PS Module 1 capability).
- No field-testing/video/citizen-feedback verification signature fields (PS Module 5 capability).
- No document/asset repository entity (PS Module 5 capability).
- Geospatial fields are plain strings, not PostGIS geometry types (PS Section 3.8 tech-stack recommendation).

---

## 13. USAGE NOTES FOR AI AGENTS

- This file is the source of truth for **backend code structure** — entity fields, relationships, package layout, enums, dev-phase ordering.
- For **why** a module/feature exists, or how it should be positioned competitively, defer to `PROJECT_CONTEXT.md`.
- When asked to generate new code (repositories, services, controllers, DTOs), follow the exact package path (`com.samadhansetu.model.entity`, `com.samadhansetu.model.enums`) and the Lombok/JPA annotation conventions in Sections 6–8 — do not introduce a different ORM style or annotation set.
- When asked "what's next to build," answer from Section 9 (Development Sequence) and Section 9.2 (Module Build Order) — do not suggest a different order.
- Before proposing changes to any existing entity, apply Section 11 (Continuation Rule): inspect existing code first, treat repo code as source of truth over this document if the two ever conflict, and preserve layer separation.
- When asked to compare implementation completeness against the PS vision, use Section 12's cross-reference map and gap list rather than re-deriving the comparison from scratch.
