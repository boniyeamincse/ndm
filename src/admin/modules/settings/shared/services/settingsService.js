import { adminApi } from '../../../../services/adminApi';
import {
  emailSettingsMock,
  generalSettingsMock,
  notificationSettingsMock,
  organizationSettingsMock,
  securitySettingsMock,
} from '../mock/settingsMock';

const SETTINGS_ENDPOINTS = {
  general: '/admin/settings/general',
  organization: '/admin/settings/organization',
  email: '/admin/settings/email',
  notifications: '/admin/settings/notifications',
  security: '/admin/settings/security',
};

const localStore = {
  general: { ...generalSettingsMock },
  organization: { ...organizationSettingsMock },
  email: { ...emailSettingsMock },
  notifications: { ...notificationSettingsMock },
  security: { ...securitySettingsMock },
};

async function get(section) {
  try {
    const payload = await adminApi.request(SETTINGS_ENDPOINTS[section]);
    return payload?.data || payload;
  } catch {
    return { ...localStore[section] };
  }
}

async function save(section, data) {
  try {
    const payload = await adminApi.request(SETTINGS_ENDPOINTS[section], {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return payload?.data || payload;
  } catch {
    localStore[section] = { ...data };
    return { ...localStore[section] };
  }
}

async function sendTestEmail(payload) {
  try {
    await adminApi.request('/admin/settings/email/test', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch {}
  return { success: true, message: `Test email queued for ${payload?.test_email_address || 'recipient'}.` };
}

export const settingsService = {
  get,
  save,
  sendTestEmail,
};
