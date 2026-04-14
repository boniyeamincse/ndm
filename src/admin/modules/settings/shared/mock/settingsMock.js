export const generalSettingsMock = {
  application_name: 'Student Movement - NDM',
  default_language: 'en',
  default_timezone: 'Asia/Dhaka',
  date_format: 'DD MMM YYYY',
  time_format: '12h',
  pagination_size: 20,
  dashboard_default_period: '30d',
  maintenance_mode: false,
};

export const organizationSettingsMock = {
  organization_name: 'National Democratic Movement Student Wing',
  short_name: 'NDM Student Wing',
  organization_slogan: 'Politics with principle, service with discipline.',
  contact_email: 'hello@ndm.test',
  contact_phone: '+8801700000000',
  address: 'Topkhana Road, Dhaka, Bangladesh',
  website: 'https://ndm.test',
  logo_url: '/images/logo/logo.png',
  favicon_url: '/images/logo/logo.png',
  footer_text: 'NDM Student Wing | All rights reserved.',
  registration_terms: 'Applicants must accept the organization code of conduct and membership terms.',
};

export const emailSettingsMock = {
  mail_driver: 'smtp',
  host: 'smtp.mailtrap.io',
  port: 587,
  username: 'ndm-mailer',
  password: 'secret-password',
  encryption: 'tls',
  from_name: 'NDM Student Wing',
  from_email: 'no-reply@ndm.test',
  queue_email: true,
  test_email_address: 'admin@ndm.test',
};

export const notificationSettingsMock = {
  email_membership_submitted: true,
  email_membership_approved: true,
  email_membership_rejected: true,
  email_notice_published: true,
  email_profile_request_submitted: true,
  email_profile_request_reviewed: true,
  sms_enabled: false,
  push_enabled: false,
};

export const securitySettingsMock = {
  force_strong_passwords: true,
  password_min_length: 10,
  session_timeout: 45,
  login_attempt_limit: 5,
  require_2fa_for_admins: false,
  ip_restriction_enabled: false,
  audit_log_retention_days: 180,
};
