import { useCallback, useEffect, useState } from 'react';
import { settingsService } from '../services/settingsService';

function useSettingsSection(section) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await settingsService.get(section));
    } catch (err) {
      setError(err.message || `Failed to load ${section} settings`);
    } finally {
      setLoading(false);
    }
  }, [section]);

  useEffect(() => { load(); }, [load]);

  const save = useCallback(async (payload) => {
    setSaving(true);
    setError('');
    setFeedback('');
    try {
      const next = await settingsService.save(section, payload);
      setData(next);
      setFeedback('Changes saved successfully.');
      return next;
    } catch (err) {
      setError(err.message || `Failed to save ${section} settings`);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [section]);

  return { data, loading, error, saving, feedback, reload: load, save, clearFeedback: () => setFeedback('') };
}

export function useGeneralSettings() { return useSettingsSection('general'); }
export function useOrganizationSettings() { return useSettingsSection('organization'); }
export function useEmailSettings() { return useSettingsSection('email'); }
export function useNotificationSettings() { return useSettingsSection('notifications'); }
export function useSecuritySettings() { return useSettingsSection('security'); }

export function useEmailSettingsActions() {
  const [busyAction, setBusyAction] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const sendTestEmail = useCallback(async (payload) => {
    setBusyAction('send-test-email');
    setActionError('');
    setActionMessage('');
    try {
      const result = await settingsService.sendTestEmail(payload);
      setActionMessage(result.message || 'Test email queued.');
      return result;
    } catch (err) {
      setActionError(err.message || 'Failed to send test email');
      throw err;
    } finally {
      setBusyAction('');
    }
  }, []);

  return { sendTestEmail, busyAction, actionError, actionMessage, clearActionState: () => { setActionError(''); setActionMessage(''); } };
}
