import { useState, useMemo } from 'react';
import { BD_GEO } from '../data/bd-geo';

/**
 * Cascading Bangladesh address selector: Division → District → Upazila → Union
 *
 * Props:
 *   value   : { division, district, upazila, union }
 *   onChange: (newValue) => void
 *   errors  : { division?, district?, upazila?, union? }
 *   lang    : 'en' | 'bn'
 *   required: boolean
 */
export default function BdAddressSelect({ value = {}, onChange, errors = {}, lang = 'en', required }) {
  const [search, setSearch] = useState({ division: '', district: '', upazila: '', union: '' });

  const division = BD_GEO.find(d => d.id === value.division) || null;
  const district = division?.districts.find(d => d.id === value.district) || null;
  const upazila  = district?.upazilas.find(u => u.id === value.upazila) || null;

  const filtered = useMemo(() => ({
    divisions: BD_GEO.filter(d =>
      !search.division || d.name.toLowerCase().includes(search.division.toLowerCase()) || d.bn.includes(search.division)
    ),
    districts: division
      ? division.districts.filter(d =>
          !search.district || d.name.toLowerCase().includes(search.district.toLowerCase()) || d.bn.includes(search.district)
        )
      : [],
    upazilas: district
      ? district.upazilas.filter(u =>
          !search.upazila || u.name.toLowerCase().includes(search.upazila.toLowerCase()) || u.bn.includes(search.upazila)
        )
      : [],
    unions: upazila
      ? upazila.unions.filter(u =>
          !search.union || u.name.toLowerCase().includes(search.union.toLowerCase()) || u.bn.includes(search.union)
        )
      : [],
  }), [search, division, district, upazila]);

  const select = (level, id) => {
    if (level === 'division') {
      onChange({ division: id, district: '', upazila: '', union: '' });
      setSearch(s => ({ ...s, district: '', upazila: '', union: '' }));
    } else if (level === 'district') {
      onChange({ ...value, district: id, upazila: '', union: '' });
      setSearch(s => ({ ...s, upazila: '', union: '' }));
    } else if (level === 'upazila') {
      onChange({ ...value, upazila: id, union: '' });
      setSearch(s => ({ ...s, union: '' }));
    } else {
      onChange({ ...value, union: id });
    }
  };

  const label = (en, bn) => lang === 'en' ? en : bn;

  const renderSelect = (level, list, selectedId, placeholder, disabled) => {
    const err = errors[level];
    const selectedItem = list.find(x => x.id === selectedId);
    return (
      <div className="bd-addr-field">
        <label className="bd-addr-label">
          {label(
            level.charAt(0).toUpperCase() + level.slice(1),
            level === 'division' ? 'বিভাগ' : level === 'district' ? 'জেলা' : level === 'upazila' ? 'উপজেলা' : 'ইউনিয়ন'
          )}
          {required && ' *'}
        </label>
        <div className={`bd-addr-select-wrap${disabled ? ' bd-addr-disabled' : ''}${err ? ' bd-addr-error' : ''}`}>
          <input
            className="bd-addr-search"
            type="text"
            placeholder={disabled ? (lang === 'en' ? `Select ${level === 'district' ? 'division' : level === 'upazila' ? 'district' : level === 'union' ? 'upazila' : ''} first` : 'আগে উপরের ধাপ বেছে নিন') : placeholder}
            value={selectedItem ? (lang === 'en' ? selectedItem.name : selectedItem.bn || selectedItem.name) : search[level]}
            onChange={e => {
              if (selectedId) {
                // Clear selection when user types
                select(level, '');
              }
              setSearch(s => ({ ...s, [level]: e.target.value }));
            }}
            disabled={disabled}
            autoComplete="off"
          />
          {!disabled && (search[level] || !selectedId) && list.length > 0 && (
            <ul className="bd-addr-dropdown">
              {filtered[level + 's'].length === 0 ? (
                <li className="bd-addr-no-result">{lang === 'en' ? 'No results' : 'কিছু পাওয়া যায়নি'}</li>
              ) : (
                filtered[level + 's'].map(item => (
                  <li
                    key={item.id}
                    className={`bd-addr-option${item.id === selectedId ? ' bd-addr-option--active' : ''}`}
                    onMouseDown={() => {
                      select(level, item.id);
                      setSearch(s => ({ ...s, [level]: '' }));
                    }}
                  >
                    <span className="bd-addr-en">{item.name}</span>
                    {item.bn && <span className="bd-addr-bn">{item.bn}</span>}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        {err && <span className="field-error">{err}</span>}
      </div>
    );
  };

  return (
    <div className="bd-addr-root">
      <div className="bd-addr-grid">
        {renderSelect('division', BD_GEO,               value.division, label('Search division...', 'বিভাগ খুঁজুন...'), false)}
        {renderSelect('district', division?.districts || [], value.district, label('Search district...', 'জেলা খুঁজুন...'),  !value.division)}
        {renderSelect('upazila',  district?.upazilas || [], value.upazila,  label('Search upazila...', 'উপজেলা খুঁজুন...'), !value.district)}
        {renderSelect('union',    upazila?.unions    || [], value.union,    label('Search union...', 'ইউনিয়ন খুঁজুন...'),   !value.upazila)}
      </div>
    </div>
  );
}
