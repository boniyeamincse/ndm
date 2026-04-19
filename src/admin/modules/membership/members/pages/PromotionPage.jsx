import { useState, useEffect, useRef } from 'react';
import { Search, CheckCircle, Award, Users, Target, UserPlus, ShieldCheck, Loader2 } from 'lucide-react';
import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import { committeesService } from '../../../organization/committees/services/committeesService';
import { positionsService } from '../../../organization/positions/services/positionsService';
import { membersService } from '../services/membersService';
import '../promotion.css';

export default function PromotionPage() {
  // --- Search & Workflow State ---
  const [committeeQuery, setCommitteeQuery] = useState('');
  const [committees, setCommittees] = useState([]);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [showCommitteeResults, setShowCommitteeResults] = useState(false);

  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('');

  const [memberQuery, setMemberQuery] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberResults, setShowMemberResults] = useState(false);

  // --- UI/Action State ---
  const [loading, setLoading] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const committeeRef = useRef(null);
  const memberRef = useRef(null);

  // --- Fetch Committees on input change ---
  useEffect(() => {
    if (committeeQuery.trim().length > 1) {
      committeesService.list({ search: committeeQuery, per_page: 5 }).then(res => {
        setCommittees(res.items || []);
        setShowCommitteeResults(true);
      });
    } else {
      setCommittees([]);
      setShowCommitteeResults(false);
    }
  }, [committeeQuery]);

  // --- Fetch Positions when committee is selected ---
  useEffect(() => {
    if (selectedCommittee) {
      positionsService.list({ per_page: 100 }).then(res => {
        // In a real system, we might filter positions by committee type
        setPositions(res.items || []);
      });
    } else {
      setPositions([]);
      setSelectedPosition('');
    }
  }, [selectedCommittee]);

  // --- Fetch Members when position/query change ---
  useEffect(() => {
    if (selectedCommittee && memberQuery.trim().length > 0) {
      membersService.list({ 
        search: memberQuery, 
        per_page: 5 
      }).then(res => {
        setMembers(res.items || []);
        setShowMemberResults(true);
      });
    } else {
      setMembers([]);
      setShowMemberResults(false);
    }
  }, [memberQuery, selectedCommittee]);

  // --- Promotion Logic ---
  const handlePromote = async () => {
    if (!selectedMember) return;
    
    setPromoting(true);
    setError('');
    
    try {
      await membersService.promote(selectedMember.id);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
      
      // Clear selection after 2 seconds
      setTimeout(() => {
        setSelectedMember(null);
        setMemberQuery('');
      }, 2000);
    } catch (err) {
      setError('Failed to promote member. Please try again.');
    } finally {
      setPromoting(false);
    }
  };

  const handleSelectCommittee = (committee) => {
    setSelectedCommittee(committee);
    setCommitteeQuery(committee.name);
    setShowCommitteeResults(false);
    // Reset following steps
    setSelectedMember(null);
    setMemberQuery('');
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setMemberQuery(member.full_name);
    setShowMemberResults(false);
  };

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Promoted Members Management"
          subtitle="Identify and promote excellence within the movement."
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Membership', path: '/admin/members' },
            { label: 'Promotions' },
          ]}
        />

        <div className="promotion-container">
          <div className="promotion-workflow">
            
            {/* LEFT COLUMN: Search & Selection */}
            <div className="promotion-card">
              <h3><Search size={18} /> Search Committee</h3>
              
              <div className="promotion-form-group" ref={committeeRef}>
                <label>Identify Committee</label>
                <div className="promotion-input-wrapper">
                  <Target size={18} />
                  <input
                    type="text"
                    className="promotion-input"
                    placeholder="Search by committee name (e.g. Central, District...)"
                    value={committeeQuery}
                    onChange={(e) => setCommitteeQuery(e.target.value)}
                  />
                  {showCommitteeResults && (
                    <div className="autocomplete-results">
                      {committees.map(c => (
                        <div key={c.id} className="autocomplete-item" onClick={() => handleSelectCommittee(c)}>
                          <span className="name">{c.name}</span>
                          <span className="sub">{c.type_name || 'Organization Unit'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="promotion-form-group">
                <label>Target Position</label>
                <select 
                  className="promotion-select" 
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  disabled={!selectedCommittee}
                >
                  <option value="">-- Select Position --</option>
                  {positions.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="promotion-form-group" ref={memberRef}>
                <label>Find Member</label>
                <div className="promotion-input-wrapper">
                  <Users size={18} />
                  <input
                    type="text"
                    className="promotion-input"
                    placeholder="Search by name or member ID..."
                    value={memberQuery}
                    onChange={(e) => setMemberQuery(e.target.value)}
                    disabled={!selectedCommittee}
                  />
                  {showMemberResults && (
                    <div className="autocomplete-results">
                      {members.map(m => (
                        <div key={m.id} className="autocomplete-item" onClick={() => handleSelectMember(m)}>
                          <span className="name">{m.full_name}</span>
                          <span className="sub">{m.member_no}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Details & Action */}
            <div className="promotion-card">
              <div className="promotion-member-detail">
                <h3><Award size={18} /> Promotion Summary</h3>
                
                {!selectedMember ? (
                  <div className="promotion-empty-state" style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
                    <UserPlus size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p>Select a committee and a member to begin the promotion process.</p>
                  </div>
                ) : (
                  <>
                    <div className="member-preview">
                      <div className="member-preview-avatar">
                        {selectedMember.full_name?.charAt(0)}
                      </div>
                      <div className="member-preview-info">
                        <h4>{selectedMember.full_name}</h4>
                        <p>{selectedMember.email}</p>
                        <p style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 'bold' }}>{selectedMember.member_no}</p>
                      </div>
                    </div>

                    <div className="promotion-meta-grid">
                      <div className="promotion-meta-item">
                        <div className="label">Current Status</div>
                        <div className="value">{selectedMember.status}</div>
                      </div>
                      <div className="promotion-meta-item">
                        <div className="label">Join Date</div>
                        <div className="value">{new Date(selectedMember.joined_at).toLocaleDateString()}</div>
                      </div>
                      <div className="promotion-meta-item">
                        <div className="label">Division</div>
                        <div className="value">{selectedMember.division_name || 'N/A'}</div>
                      </div>
                      <div className="promotion-meta-item">
                        <div className="label">New Status</div>
                        <div className="value" style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={14} /> Promoted
                        </div>
                      </div>
                    </div>

                    {success && (
                      <div className="success-message">
                        <CheckCircle size={18} />
                        Member promoted successfully!
                      </div>
                    )}

                    {error && (
                      <div className="error-message" style={{ color: '#dc2626', background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', fontSize: '14px', marginBottom: '1rem' }}>
                        {error}
                      </div>
                    )}

                    <div className="promotion-action-bar">
                      <button 
                        className="btn-promote" 
                        onClick={handlePromote}
                        disabled={promoting || success}
                      >
                        {promoting ? (
                          <><Loader2 className="ndm-spin" size={16} /> Processing...</>
                        ) : (
                          <><ShieldCheck size={18} /> Promote Now</>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </PageContainer>
    </AdminContentWrapper>
  );
}
