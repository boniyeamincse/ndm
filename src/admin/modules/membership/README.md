# Membership Module Integration Notes

## Scope

This module implements admin-facing Membership Applications and Members operations for these routes:

- /admin/membership-applications
- /admin/membership-applications/pending
- /admin/membership-applications/under-review
- /admin/membership-applications/approved
- /admin/membership-applications/rejected
- /admin/membership-applications/on-hold
- /admin/membership-applications/:id
- /admin/members
- /admin/members/active
- /admin/members/inactive
- /admin/members/suspended
- /admin/members/leadership
- /admin/members/new
- /admin/members/:id

## API Mapping

### Membership Applications

- GET /api/v1/admin/membership-applications
- GET /api/v1/admin/membership-applications/{id}
- PUT /api/v1/admin/membership-applications/{id}/review
- PUT /api/v1/admin/membership-applications/{id}/approve
- PUT /api/v1/admin/membership-applications/{id}/reject
- PUT /api/v1/admin/membership-applications/{id}/hold

List filters supported by frontend service:

- status
- search
- division
- district
- from
- to
- desired_committee_level
- sort
- page
- per_page

### Members

- GET /api/v1/admin/members
- GET /api/v1/admin/members/{id}
- PUT /api/v1/admin/members/{id}
- PATCH /api/v1/admin/members/{id}/status
- GET /api/v1/admin/members-summary

List filters supported by frontend service:

- status
- search
- gender
- division
- district
- upazila
- sort_by
- sort_dir
- page
- per_page

Leadership and new member pages are route-driven list variants:

- leadership: frontend applies leadership filter on response rows
- new: frontend filters joined_at by recent period and sorts descending

## Response Normalization

Frontend services normalize backend payload into:

- list: data.items, meta
- detail: data.entity

Current backend standard payload keys:

- success
- message
- data
- meta

## Functional Checklist

- Application workflow actions support modal confirmation and validation.
- Reject and hold enforce reason/remarks inputs.
- Members can be edited and status-updated from list/detail context.
- Route-based submenu pages load pre-applied filters.
- Loading, empty, and error states are present.
- Mobile cards and desktop tables are both rendered.

## QA Readiness

The module uses stable test IDs for key controls:

- filter-search
- apply-filters
- reset-filters
- applications-table
- members-table
- application-action-modal
- member-status-modal
- edit-member-modal

Suggested UI test flow:

1. Load list page and assert table visibility.
2. Apply status/keyword filters and assert result count changes.
3. Open detail pages and assert section headings.
4. Trigger approve/reject/hold/update status flows and assert request body.
5. Verify empty and error rendering states.
