import { Plus, X } from 'lucide-react';
import { NOTICE_RULE_TYPES } from '../../shared/types/contentTypes';

export default function AudienceRulesBuilder({ rules = [], onChange }) {
  function addRule() {
    onChange([...(rules || []), { id: Date.now(), rule_type: 'role', rule_value: '' }]);
  }

  function updateRule(id, key, value) {
    onChange((rules || []).map((rule) => (rule.id === id ? { ...rule, [key]: value } : rule)));
  }

  function removeRule(id) {
    onChange((rules || []).filter((rule) => rule.id !== id));
  }

  return (
    <div className="cnt-rules-builder">
      <div className="cnt-rules-builder__head">
        <h4>Audience Rules</h4>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={addRule}><Plus size={14} /> Add Rule</button>
      </div>
      <div className="cnt-rules-builder__rows">
        {(rules || []).length ? rules.map((rule) => (
          <div key={rule.id} className="cnt-rules-builder__row">
            <select className="ndm-input" value={rule.rule_type} onChange={(event) => updateRule(rule.id, 'rule_type', event.target.value)}>
              {NOTICE_RULE_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <input className="ndm-input" value={rule.rule_value} onChange={(event) => updateRule(rule.id, 'rule_value', event.target.value)} placeholder="Rule value" />
            <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => removeRule(rule.id)} aria-label="Remove rule"><X size={14} /></button>
          </div>
        )) : <div className="cnt-rules-builder__empty">No custom audience rules added.</div>}
      </div>
    </div>
  );
}
