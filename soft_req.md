Great. You already have:

* **Frontend website**
* **Backend in PHP Laravel API**
* System type: **Web-based Student Wing Management System**
* Organization name: **Student Movment - NDM**

Below is a clean, professional system concept you can use as a **project brief / software blueprint / AI prompt base**.

# Project Title

**Student Movment - NDM**
**Web-Based Political Student Wing Organization Management System**

# Project Overview

Student Movment - NDM is a centralized web-based organization management platform for managing political student wing activities, membership, committee hierarchy, member profiles, blog/news publishing, notices, and role-based administration.

The system will allow public users to apply for membership, enable administrators to review and approve members, automatically activate approved members, send confirmation emails, and manage committees across multiple organizational levels such as Central, Division, District, Upazila, and Union.

The platform will also provide a structured member profile directory where users can view profile photo, name, designation, position, location, and subordinate members under a leader’s hierarchy.

# Core Goals

* Digitize member registration and approval
* Manage full political committee hierarchy
* Maintain member profiles and chain of command
* Publish blogs, news, notices, and organization updates
* Provide secure role-based access
* Build a scalable Laravel API + frontend web platform

# User Roles

## 1. Super Admin

Full system control.

Permissions:

* Manage all modules
* Approve/reject memberships
* Create and manage all committees
* Assign leadership roles
* Manage blog, news, notices
* Manage member hierarchy
* Manage organization settings
* View full reports

## 2. Admin

Operational management role.

Permissions:

* Manage assigned committees
* Review members
* Update member profiles
* Publish notices/news if permitted
* View reports based on access

## 3. Member

Active approved organization member.

Permissions:

* View and update own profile
* View committee structure
* View leaders and subordinates
* Read blog, notices, and organization content
* Apply for internal roles if needed

## 4. Public User

Not logged in.

Permissions:

* View public pages
* Apply for membership
* Read public blog/news/notices
* Contact organization

# Main Modules

## 1. Authentication & Security

Features:

* Login
* Logout
* Forgot password
* Reset password
* Email verification
* Role-based access control
* Secure API authentication
* Optional 2FA for admins

## 2. Membership Management

Features:

* Public membership application form
* Application review panel
* Approve / reject / hold application
* Auto-create active member after approval
* Auto-send approval email
* Store applicant status history
* Search and filter applications
* Membership ID generation
* Member category/type support

Suggested fields:

* Full name
* Father’s name
* Mother’s name
* Date of birth
* Gender
* Mobile
* Email
* National ID / Student ID
* Photo
* Address
* Educational institution
* Department / class / session
* Occupation/student status
* Blood group
* Emergency contact
* Desired committee/unit
* Reference member
* Application status

Application statuses:

* Pending
* Under Review
* Approved
* Rejected
* Suspended

## 3. Member Management

Features:

* Active member list
* Inactive member list
* Suspended member list
* Member profile details
* Member card/profile page
* Search by name, phone, email, location, committee
* Promote/demote role
* Assign organization position
* Member activity history
* Profile update request workflow

Profile view should show:

* Photo
* Full name
* Position / Podobi
* Role
* Committee
* Location
* Contact info
* Bio
* Join date
* Status
* Reporting leader
* Under him/her member list

## 4. Committee Management

This is one of the most important modules.

Committee levels:

* Central
* Division
* District
* Upazila
* Union

Features:

* Create committee
* Edit committee
* Remove committee
* Activate/deactivate committee
* Set parent-child hierarchy
* Add members to committee
* Assign positions in committee
* Transfer member between committees
* Committee tenure dates
* Committee status tracking
* Committee-wise reporting dashboard

Examples:

* Central Committee
* Dhaka Division Committee
* Jamalpur District Committee
* Madarganj Upazila Committee
* Specific Union Committee

Committee structure fields:

* Committee name
* Committee type/level
* Parent committee
* Region/location
* Start date
* End date
* Status
* Notes
* Office address
* Committee code

## 5. Position / Designation Management

Features:

* Create organization positions
* Assign rank/order
* Define leadership hierarchy
* Set position visibility
* Assign one or multiple members to roles if needed

Examples:

* President
* Vice President
* General Secretary
* Organizing Secretary
* Joint Secretary
* Office Secretary
* Member

## 6. Role & Permission Management

Features:

* Manage system roles
* Assign permissions by module
* Restrict admin actions
* Committee-wise access controls
* Audit logs of permission changes

## 7. Member Hierarchy Management

Features:

* Show who reports to whom
* Show leader’s subordinate members
* Tree view / hierarchy chart
* Committee-based command structure
* Member relationship mapping

This helps for:

* Showing “under his/her members”
* Leadership visibility
* Organizational structure display

## 8. Blog / News Management

Features:

* Create blog posts
* Publish organization news
* Publish political updates
* Draft / publish / archive
* Category management
* Featured image upload
* SEO-friendly slug
* Rich text editor
* Author attribution
* Publish schedule

Possible categories:

* News
* Notice
* Statement
* Campaign
* Event
* Press Release

## 9. Notice Management

Features:

* Publish notices
* Internal or public visibility
* Priority notices
* Attach PDF/documents
* Expiry date
* Committee-specific notices

## 10. Profile Management

Features:

* View own profile
* Edit personal information
* Change password
* Change profile photo
* Update contact info
* Update organization details
* Social links
* Academic info

## 11. Dashboard

Dashboard should be different by role.

### Super Admin Dashboard

* Total applicants
* Total active members
* Total committees
* Total divisions/districts/upazilas/unions
* Pending approvals
* Recent notices
* Recent blogs/news
* Member growth chart
* Committee growth chart

### Admin Dashboard

* Assigned committee summary
* Pending member requests
* New notices
* Members by status
* Committee reports

### Member Dashboard

* My profile
* My committee
* My leader
* Under me members
* Latest notices
* Latest news

## 12. Media / File Management

Features:

* Upload member photos
* Upload blog images
* Upload notice attachments
* Manage documents
* File validation and storage rules

## 13. Email Notification System

Features:

* Approval email
* Registration confirmation
* Password reset email
* Notice email
* Event/announcement email
* Committee assignment email

## 14. Activity Log / Audit Trail

Features:

* Log all important actions
* Who approved member
* Who created committee
* Who changed role
* Who removed member
* Who updated notice/blog

## 15. Reports

Features:

* Member list report
* Committee-wise member report
* Pending membership report
* Active/inactive member report
* Location-based report
* Position-wise report
* Blog/news activity report

# Suggested Database Entities

Main tables:

* users
* roles
* permissions
* role_user
* members
* membership_applications
* committees
* committee_types
* committee_member
* positions
* member_hierarchy
* divisions
* districts
* upazilas
* unions
* blogs
* blog_categories
* notices
* media_files
* activity_logs
* email_logs
* settings

# Committee Hierarchy Logic

Example hierarchy:

* Central Committee

  * Division Committee

    * District Committee

      * Upazila Committee

        * Union Committee

Rules:

* A child committee must belong to one parent committee
* Members can belong to one primary committee
* Members can have one or more designations if allowed
* Committee head should be identifiable
* Each committee should support tenure and status

# Suggested Member Workflow

## Public Registration Flow

1. User fills membership form
2. Application stored as pending
3. Admin reviews application
4. Admin approves or rejects
5. If approved:

   * member profile created
   * system account activated
   * email sent automatically
   * committee assigned if applicable

## Member Lifecycle

* Applied
* Pending
* Approved
* Active
* Suspended
* Resigned
* Removed

# Suggested Admin Workflow

1. Create committee levels
2. Create locations
3. Create positions/designations
4. Set roles and permissions
5. Review membership requests
6. Approve and assign committee
7. Publish notices/news
8. Monitor organization growth

# Suggested Frontend Menus

## Public Website

* Home
* About Us
* Our Mission
* Leadership
* Committees
* Members
* News
* Blog
* Notices
* Contact
* Apply for Membership
* Login

## Member Panel

* Dashboard
* My Profile
* My Committee
* My Leaders
* My Subordinates
* Notices
* News
* Settings

## Admin Panel

* Dashboard
* Membership Applications
* Members
* Committees
* Committee Types
* Positions
* Roles & Permissions
* Blog Management
* Notice Management
* Media Library
* Reports
* Settings
* Activity Logs

# Suggested API Module Structure for Laravel

* Auth API
* Membership Application API
* Member API
* Committee API
* Position API
* Role & Permission API
* Profile API
* Blog API
* Notice API
* Dashboard API
* Report API
* Setting API
* Media API
* Notification API

# Important Security Requirements

* Laravel Sanctum or Passport for API auth
* Server-side validation for all forms
* File upload validation
* Role-based middleware
* Rate limit registration/login endpoints
* Audit log for sensitive actions
* Prevent unauthorized committee edits
* Secure password reset flow
* Email verification before activation if required

# Professional Short Description

**Student Movment - NDM** is a modern web-based political student organization management platform designed to handle membership registration, approval workflows, committee hierarchy, member profiles, role-based administration, and organization communication through blogs and notices.

# AI Prompt Version for Development

Use this with GitHub Copilot / ChatGPT / AI builder:

Build a professional web-based Organization Management System named **Student Movment - NDM** using **Laravel API backend** and an existing **frontend website**.

System purpose:
A political student wing management platform to manage members, committee structure, news/blog publishing, notices, user roles, and member hierarchy.

Core modules:

1. Authentication and authorization
2. Membership registration and approval
3. Active member management
4. Committee management with hierarchy: Central, Division, District, Upazila, Union
5. Position/designation management
6. Role and permission management
7. Member profile management
8. Member hierarchy / reporting structure
9. Blog/news management
10. Notice management
11. Dashboard and reports
12. Media/file upload management
13. Email notification system
14. Activity logs

Key functional requirements:

* Public users can apply for membership
* Admin can approve/reject applications
* Approved applicants become active members automatically
* System sends automatic email after approval
* Every member has a profile with photo, name, position, location, committee, and reporting hierarchy
* Committee management must support add, edit, remove, assign member, and leadership structure
* Members should be viewable under a leader
* Blog module should support news, notices, and organization-related publishing
* Role-based system must support Super Admin, Admin, and Member
* Dashboard must show counts, growth, pending approvals, latest notices, and committee summaries
* API must be secure, scalable, and modular
* Use clean Laravel architecture with migrations, seeders, services, policies, Form Requests, API Resources, and proper RBAC middleware

Non-functional requirements:

* RESTful API design
* Clean folder structure
* Validation and security best practices
* Maintainable code
* Audit logs for critical changes
* Scalable database design
* Production-ready architecture

Generate:

* full software architecture
* module breakdown
* database schema suggestion
* API endpoint plan
* admin workflow
* member workflow
* security checklist
* development task breakdown

