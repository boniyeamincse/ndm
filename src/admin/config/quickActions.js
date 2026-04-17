import { Bell, Building2, FileText, Newspaper, UserCog, Users } from 'lucide-react';

export const ADMIN_QUICK_ACTIONS = [
  {
    label: 'Add Member',
    description: 'Open the members workspace',
    icon: Users,
    route: '/admin/members/new',
    color: '#2980B9',
  },
  {
    label: 'Review Applications',
    description: 'Review pending membership applications',
    icon: FileText,
    route: '/admin/membership-applications',
    color: '#27AE60',
  },
  {
    label: 'Create Committee',
    description: 'Create a new committee record',
    icon: Building2,
    route: '/admin/committees/create',
    color: '#8E44AD',
  },
  {
    label: 'Publish Notice',
    description: 'Draft and publish a notice',
    icon: Bell,
    route: '/admin/notices/create',
    color: '#E67E22',
  },
  {
    label: 'Add News Post',
    description: 'Create a news or blog post',
    icon: Newspaper,
    route: '/admin/posts/create',
    color: '#C0392B',
  },
  {
    label: 'Profile Requests',
    description: 'Review member profile update requests',
    icon: UserCog,
    route: '/admin/profile-update-requests',
    color: '#16A085',
  },
];