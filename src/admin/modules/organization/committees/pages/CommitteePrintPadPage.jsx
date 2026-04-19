import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';
import { useCommitteeDetail, useCommitteeMembers } from '../hooks/useCommittees';
import '../../../reports/reports.css';

// Position ordering: leadership roles sort first by hierarchy_rank, then general members
function sortMembers(items) {
  const leadership = items.filter((m) => m.is_leadership).sort((a, b) => (a.hierarchy_rank ?? 99) - (b.hierarchy_rank ?? 99));
  const general = items.filter((m) => !m.is_leadership);
  return [...leadership, ...general];
}

export default function CommitteePrintPadPage() {
  const { committeeId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef(null);

  const { data: committee, loading: committeeLoading } = useCommitteeDetail(committeeId);
  const { items: rawMembers, loading: membersLoading } = useCommitteeMembers(committeeId);

  const loading = committeeLoading || membersLoading;
  const members = sortMembers(rawMembers);

  // President is the first leadership/primary member
  const president = members.find(
    (m) =>
      m.is_primary ||
      String(m.position_name || m.position?.name || '').toLowerCase().includes('president') ||
      String(m.position_name || m.position?.name || '').toLowerCase().includes('সভাপতি'),
  );

  const otherMembers = members.filter((m) => m !== president);

  function handlePrint() {
    window.print();
  }

  const today = new Date().toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const committeeName = committee?.name || 'Committee';
  const committeeType = committee?.committee_type_name || '';
  const committeeNo = committee?.committee_no || '';
  const location = [
    committee?.division_name,
    committee?.district_name,
    committee?.upazila_name,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="print-pad-root">
      {/* ── Screen-only toolbar ─────────────────────────────────── */}
      <div className="print-pad-toolbar no-print">
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <h2 className="print-pad-toolbar__title">Official Committee Pad Preview</h2>
        <button type="button" className="ndm-btn ndm-btn--primary" onClick={handlePrint}>
          <Printer size={16} /> Print / Save PDF
        </button>
      </div>

      {loading ? (
        <div className="no-print" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          Loading committee data…
        </div>
      ) : (
        /* ── Printable body ─────────────────────────────────────── */
        <div className="print-pad-page" ref={printRef}>
          {/* Letterhead */}
          <header className="print-pad-header">
            <div className="print-pad-header__band" />
            <div className="print-pad-header__body">
              <div className="print-pad-header__logo-area">
                {/* NDM emblem placeholder — replace src with actual logo path */}
                <div className="print-pad-header__emblem">
                  <span className="print-pad-header__emblem-text">NDM</span>
                </div>
              </div>
              <div className="print-pad-header__text">
                <p className="print-pad-header__org-bn">জাতীয় গণতান্ত্রিক আন্দোলন</p>
                <p className="print-pad-header__org-en">National Democratic Movement (NDM)</p>
                <h1 className="print-pad-header__committee">{committeeName}</h1>
                {committeeNo && (
                  <p className="print-pad-header__meta">
                    Committee No: <strong>{committeeNo}</strong>
                    {location ? ` · ${location}` : ''}
                  </p>
                )}
              </div>
            </div>
            <div className="print-pad-header__band" />
          </header>

          {/* Date + ref line */}
          <div className="print-pad-ref-line">
            <span className="print-pad-ref-line__date">Date: {today}</span>
            <span className="print-pad-ref-line__type">{committeeType} Committee</span>
          </div>

          {/* President block */}
          {president && (
            <section className="print-pad-president">
              <div className="print-pad-president__label">President / সভাপতি</div>
              <div className="print-pad-president__name">
                {president.member_name || president.member?.full_name || '—'}
              </div>
              <div className="print-pad-president__position">
                {president.position_name || president.position?.name || '—'}
              </div>
            </section>
          )}

          {/* Committee members roster */}
          <section className="print-pad-roster">
            <div className="print-pad-roster__title">
              Full Committee Members · {committeeName}
            </div>

            {/* Leadership members */}
            {otherMembers.filter((m) => m.is_leadership).length > 0 && (
              <>
                <div className="print-pad-roster__section-label">Executive / Leadership</div>
                <table className="print-pad-table">
                  <thead>
                    <tr>
                      <th className="print-pad-table__sl">Sl.</th>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Member No</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {otherMembers
                      .filter((m) => m.is_leadership)
                      .map((m, idx) => (
                        <tr key={m.id}>
                          <td className="print-pad-table__sl">{idx + 2}</td>
                          <td className="print-pad-table__name">{m.member_name || m.member?.full_name || '—'}</td>
                          <td>{m.position_name || m.position?.name || '—'}</td>
                          <td className="print-pad-table__light">{m.member_no || m.member?.member_no || '—'}</td>
                          <td className="print-pad-table__light">{m.phone || m.member?.phone || '—'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            )}

            {/* General members */}
            {otherMembers.filter((m) => !m.is_leadership).length > 0 && (
              <>
                <div className="print-pad-roster__section-label">General Members</div>
                <table className="print-pad-table">
                  <thead>
                    <tr>
                      <th className="print-pad-table__sl">Sl.</th>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Member No</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {otherMembers
                      .filter((m) => !m.is_leadership)
                      .map((m, idx) => {
                        const leaderOffset = otherMembers.filter((x) => x.is_leadership).length + 2;
                        return (
                          <tr key={m.id}>
                            <td className="print-pad-table__sl">{leaderOffset + idx}</td>
                            <td className="print-pad-table__name">{m.member_name || m.member?.full_name || '—'}</td>
                            <td>{m.position_name || m.position?.name || '—'}</td>
                            <td className="print-pad-table__light">{m.member_no || m.member?.member_no || '—'}</td>
                            <td className="print-pad-table__light">{m.phone || m.member?.phone || '—'}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </>
            )}
          </section>

          {/* Signature section */}
          <div className="print-pad-signatures">
            <div className="print-pad-sig">
              <div className="print-pad-sig__line" />
              <div className="print-pad-sig__label">Signature — President</div>
              <div className="print-pad-sig__name">
                {president ? (president.member_name || president.member?.full_name) : '___________'}
              </div>
            </div>
            <div className="print-pad-sig">
              <div className="print-pad-sig__line" />
              <div className="print-pad-sig__label">Signature — Secretary</div>
              <div className="print-pad-sig__name">___________</div>
            </div>
            <div className="print-pad-sig">
              <div className="print-pad-sig__line" />
              <div className="print-pad-sig__label">Official Seal</div>
            </div>
          </div>

          {/* Footer */}
          <footer className="print-pad-footer">
            <div className="print-pad-footer__band" />
            <p className="print-pad-footer__text">
              This is an official document of the {committeeName}, National Democratic Movement (NDM).
              Unauthorised reproduction is prohibited.
            </p>
          </footer>
        </div>
      )}
    </div>
  );
}
