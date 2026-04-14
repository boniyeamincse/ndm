import { useEffect, useState } from 'react';
import SettingsFormActions from './SettingsFormActions';
import SettingsPageLayout from './SettingsPageLayout';

export default function SettingsFormPage({
  title,
  subtitle,
  breadcrumbs,
  hook,
  renderSections,
  extraAction,
  onAfterSave,
}) {
  const { data, loading, error, saving, feedback, reload, save } = hook();
  const [form, setForm] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setForm(data);
    setDirty(false);
  }, [data]);

  useEffect(() => {
    function handleBeforeUnload(event) {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    setDirty(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await save(form);
    setDirty(false);
    onAfterSave?.();
  }

  function handleReset() {
    setForm(data);
    setDirty(false);
  }

  return (
    <SettingsPageLayout title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} loading={loading} error={error} onRetry={reload} feedback={feedback}>
      {form ? (
        <form className="stg-form" onSubmit={handleSubmit}>
          {renderSections(form, updateField)}
          <SettingsFormActions
            busy={saving}
            dirty={dirty}
            onReset={handleReset}
            extraAction={typeof extraAction === 'function' ? extraAction(form, updateField) : extraAction}
          />
        </form>
      ) : null}
    </SettingsPageLayout>
  );
}
