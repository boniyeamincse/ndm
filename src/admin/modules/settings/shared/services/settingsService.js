import {
  emailSettingsMock,
  generalSettingsMock,
  notificationSettingsMock,
  organizationSettingsMock,
  securitySettingsMock,
} from '../mock/settingsMock';

const STORAGE_PREFIX = 'ndm_admin_settings';
export const SETTINGS_UPDATED_EVENT = 'ndm:settings-updated';

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

  try {
    window.dispatchEvent(new CustomEvent(SETTINGS_UPDATED_EVENT, {
      detail: {
        section,
        data: { ...localStore[section] },
      },
    }));
  } catch {}

  return { ...localStore[section] };
}

export function getSettingsSnapshot(section) {
  return readLocal(section);
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
