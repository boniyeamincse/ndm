import { useEffect, useState } from 'react';
import { membersService } from '../../../membership/members/services/membersService';
import { committeesService } from '../../committees/services/committeesService';
import { positionsService } from '../../positions/services/positionsService';
import { committeeAssignmentsService } from '../services/committeeAssignmentsService';
import EntityLookupField from './EntityLookupField';

const EMPTY = {
  member_id: '',
  member: null,
  committee_id: '',
  committee: null,
  position_id: '',
  position: null,
  assignment_type: '',
  is_primary: false,
  is_leadership: false,
  appointed_by: '',
  appointed_by_user: null,
  approved_by: '',
  approved_by_user: null,
  assigned_at: '',
  approved_at: '',
  start_date: '',
  end_date: '',
  status: 'active',
  is_active: true,
  note: '',
};

function buildOptionLabel(item, fallback = 'Unknown') {
  return item?.label || item?.name || fallback;
}

function formatMemberOption(item) {
  if (!item) return null;

  return {
    ...item,
    label: item.full_name || item.name,
    description: [item.member_no, item.email, item.mobile].filter(Boolean).join(' • '),
  };
}

function formatCommitteeOption(item) {
  if (!item) return null;

  return {
    ...item,
    label: item.name,
    description: [item.committee_type_name, item.division_name, item.district_name, item.upazila_name, item.union_name].filter(Boolean).join(' • '),
  };
}

function formatPositionOption(item) {
  if (!item) return null;

  return {
    ...item,
    label: item.name,
    description: [item.category, item.scope, item.committee_type_names?.join(', ')].filter(Boolean).join(' • '),
  };
}

function formatAdminOption(item) {
  if (!item) return null;

  return {
    ...item,
    label: item.name,
    description: [item.email, item.phone, Array.isArray(item.roles) ? item.roles.join(', ') : ''].filter(Boolean).join(' • '),
  };
}

function normalizeInitialValues(initialValues) {
  if (!initialValues) return EMPTY;

  return {
    ...EMPTY,
    ...initialValues,
    member_id: initialValues.member_id || initialValues.member?.id || '',
    member: formatMemberOption(initialValues.member),
    committee_id: initialValues.committee_id || initialValues.committee?.id || '',
    committee: formatCommitteeOption({
      ...initialValues.committee,
      committee_type_name: initialValues.committee_type_name || initialValues.committee?.committee_type?.name,
    }),
    position_id: initialValues.position_id || initialValues.position?.id || '',
    position: formatPositionOption(initialValues.position),
    appointed_by: typeof initialValues.appointed_by === 'object' ? initialValues.appointed_by?.id || '' : initialValues.appointed_by || initialValues.appointed_by_user?.id || '',
    appointed_by_user: formatAdminOption(initialValues.appointed_by_user || initialValues.appointed_by),
    approved_by: typeof initialValues.approved_by === 'object' ? initialValues.approved_by?.id || '' : initialValues.approved_by || initialValues.approved_by_user?.id || '',
    approved_by_user: formatAdminOption(initialValues.approved_by_user || initialValues.approved_by),
    assignment_type: initialValues.assignment_type || 'general_member',
    assigned_at: initialValues.assigned_at || '',
    approved_at: initialValues.approved_at || '',
    start_date: initialValues.start_date || '',
    end_date: initialValues.end_date || '',
    note: initialValues.note || '',
  };
}

export default function CommitteeAssignmentForm({ initialValues, busy, onCancel, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const isEdit = Boolean(initialValues?.id);

  useEffect(() => {
    setForm(normalizeInitialValues(initialValues));
  }, [initialValues]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function searchMembers(query) {
    const result = await membersService.list({ search: query, status: 'active', per_page: 8 });
    return result.items.map((item) => formatMemberOption(item)).filter(Boolean);
  }

  async function searchCommittees(query) {
    const result = await committeesService.list({ search: query, status: 'active', per_page: 8 });
    return result.items.map((item) => formatCommitteeOption(item)).filter(Boolean);
  }

  async function searchPositions(query) {
    const result = await positionsService.list({
      search: query,
      committee_type_id: form.committee?.committee_type_id || form.committee_type_id || undefined,
      is_active: true,
      per_page: 8,
    });

    return result.items.map((item) => formatPositionOption(item)).filter(Boolean);
  }

  async function searchAdminUsers(query) {
    const result = await committeeAssignmentsService.lookupAdminUsers({ search: query, per_page: 8 });
    return result.map((item) => formatAdminOption(item)).filter(Boolean);
  }

  function submitForm() {
    onSubmit({
      member_id: form.member_id,
      committee_id: form.committee_id,
      position_id: form.position_id || null,
      assignment_type: form.assignment_type || 'general_member',
      is_primary: Boolean(form.is_primary),
      is_leadership: Boolean(form.is_leadership),
      appointed_by: form.appointed_by || null,
      approved_by: form.approved_by || null,
      assigned_at: form.assigned_at || null,
      approved_at: form.approved_at || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      status: form.status || 'active',
      is_active: Boolean(form.is_active),
      note: form.note || null,
    });
  }

  return (
    <form className="org-form" onSubmit={(event) => { event.preventDefault(); submitForm(); }}>
      <section className="org-form__section">
        <div className="ndm-form-grid">
          <EntityLookupField
            label="Member"
            required
            value={form.member_id}
            selectedLabel={buildOptionLabel(form.member, '')}
            placeholder="Search member by name, member ID, phone or email"
            helperText={isEdit ? 'Member is locked after assignment creation to preserve history.' : 'Search by member number or member name.'}
            disabled={busy || isEdit}
            onSearch={searchMembers}
            onSelect={(option) => setForm((current) => ({
              ...current,
              member_id: option?.id || '',
              member: option || null,
            }))}
          />

          <EntityLookupField
            label="Committee"
            required
            value={form.committee_id}
            selectedLabel={buildOptionLabel(form.committee, '')}
            placeholder="Search active committee by name or code"
            helperText={isEdit ? 'Use Transfer Assignment to move a member to another committee.' : 'Committee selection drives position filtering.'}
            description={form.committee?.committee_type_name ? `Committee type: ${form.committee.committee_type_name}` : ''}
            disabled={busy || isEdit}
            onSearch={searchCommittees}
            onSelect={(option) => setForm((current) => ({
              ...current,
              committee_id: option?.id || '',
              committee: option || null,
              position_id: '',
              position: null,
            }))}
          />

          <EntityLookupField
            label="Position"
            value={form.position_id}
            selectedLabel={buildOptionLabel(form.position, '')}
            placeholder={form.committee_id ? 'Search position by name' : 'Select committee first'}
            helperText={form.committee_id ? 'Only active positions are shown. Committee-specific positions are filtered by committee type.' : 'Choose a committee first to narrow positions.'}
            description={form.position?.description || ''}
            disabled={busy || !form.committee_id}
            onSearch={searchPositions}
            onSelect={(option) => setForm((current) => ({
              ...current,
              position_id: option?.id || '',
              position: option || null,
              is_leadership: option?.is_leadership ? true : current.is_leadership,
            }))}
          />

          <label className="org-form__field">
            <span>Assignment Type</span>
            <select className="ndm-input" value={form.assignment_type} onChange={(event) => updateField('assignment_type', event.target.value)} disabled={busy}>
              <option value="">Select</option>
              <option value="office_bearer">Office Bearer</option>
              <option value="general_member">General Member</option>
            </select>
          </label>

          <EntityLookupField
            label="Appointed By"
            value={form.appointed_by}
            selectedLabel={buildOptionLabel(form.appointed_by_user, '')}
            placeholder="Search admin or permission user"
            helperText="Optional. Search by admin name, email, phone or username."
            disabled={busy}
            onSearch={searchAdminUsers}
            onSelect={(option) => setForm((current) => ({
              ...current,
              appointed_by: option?.id || '',
              appointed_by_user: option || null,
            }))}
          />

          <EntityLookupField
            label="Approved By"
            value={form.approved_by}
            selectedLabel={buildOptionLabel(form.approved_by_user, '')}
            placeholder="Search approver user"
            helperText="Optional. Use this when the assignment has already been approved by an authorized user."
            disabled={busy}
            onSearch={searchAdminUsers}
            onSelect={(option) => setForm((current) => ({
              ...current,
              approved_by: option?.id || '',
              approved_by_user: option || null,
            }))}
          />
        </div>
      </section>

      <section className="org-form__section">
        <div className="ndm-form-grid">
          <label className="org-form__field"><span>Assigned At</span><input type="date" className="ndm-input" value={form.assigned_at} onChange={(event) => updateField('assigned_at', event.target.value)} disabled={busy} /></label>
          <label className="org-form__field"><span>Approved At</span><input type="date" className="ndm-input" value={form.approved_at} onChange={(event) => updateField('approved_at', event.target.value)} disabled={busy} /></label>
          <label className="org-form__field"><span>Start Date</span><input type="date" className="ndm-input" value={form.start_date} onChange={(event) => updateField('start_date', event.target.value)} disabled={busy} /></label>
          <label className="org-form__field"><span>End Date</span><input type="date" className="ndm-input" value={form.end_date} onChange={(event) => updateField('end_date', event.target.value)} disabled={busy} /></label>
          <label className="org-form__field">
            <span>Status</span>
            <select className="ndm-input" value={form.status} onChange={(event) => updateField('status', event.target.value)} disabled={busy}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label className="org-form__field org-form__field--wide">
            <span>Note</span>
            <textarea className="ndm-input" rows={4} value={form.note} onChange={(event) => updateField('note', event.target.value)} disabled={busy} />
          </label>
        </div>
      </section>

      <div className="org-form__toggles">
        <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.is_primary)} onChange={(event) => updateField('is_primary', event.target.checked)} /> Primary Assignment</label>
        <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.is_leadership)} onChange={(event) => updateField('is_leadership', event.target.checked)} /> Leadership Assignment</label>
        <label className="ndm-checkbox-row"><input type="checkbox" checked={Boolean(form.is_active)} onChange={(event) => updateField('is_active', event.target.checked)} /> Active</label>
      </div>
      <div className="ndm-modal__actions org-form__actions">
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onCancel} disabled={busy}>Cancel</button>
        <button type="submit" className="ndm-btn ndm-btn--primary" disabled={busy || !form.member_id || !form.committee_id}>{busy ? 'Saving...' : 'Save Assignment'}</button>
      </div>
    </form>
  );
}
