import { MapPin } from 'lucide-react';
import { joinLocation } from '../utils/resourceTransforms';

export default function CommitteeLocationBlock({ committee }) {
  return (
    <div className="org-location-block">
      <MapPin size={14} />
      <span>
        {joinLocation([
          committee.union_name,
          committee.upazila_name,
          committee.district_name,
          committee.division_name,
        ])}
      </span>
    </div>
  );
}