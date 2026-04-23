import { adminApi } from '../../../../services/adminApi';
import {
  emailSettingsMock,
  generalSettingsMock,
  notificationSettingsMock,
  organizationSettingsMock,
  securitySettingsMock,
} from '../mock/settingsMock';

const STORAGE_PREFIX = 'ndm_admin_settings';

const localStore = {
  general: { ...generalSettingsMock },
  organization: { ...organizationSettingsMock },
  email: { ...emailSettingsMock },
  notifications: { ...notificationSettingsMock },
  security: { ...securitySettingsMock },
};

function getStorageKey(section) {
  return `${STORAGE_PREFIX}:${section}`;
}

function readLocal(section) {
  try {
    const saved = window.localStorage.getItem(getStorageKey(section));
    if (!saved) {
      return { ...localStore[section] };
    }

    return {
      ...localStore[section],
      ...JSON.parse(saved),
    };
  } catch {
    return { ...localStore[section] };
  }
}

function writeLocal(section, data) {
  localStore[section] = { ...data };

  try {
    window.localStorage.setItem(getStorageKey(section), JSON.stringify(localStore[section]));
  } catch {}

  return { ...localStore[section] };
}

async function get(section) {
  return readLocal(section);
}

async function save(section, data) {
  return writeLocal(section, data);
}

async function sendTestEmail(payload) {
  return { success: true, message: `Test email queued for ${payload?.test_email_address || 'recipient'}.` };
}

export const settingsService = {
  get,
  save,
  sendTestEmail,
};
