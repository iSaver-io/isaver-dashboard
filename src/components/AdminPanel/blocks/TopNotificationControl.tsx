import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { ControlField } from '@/components/AdminPanel/common/ControlField';
import { useDashboardConfigControl } from '@/hooks/admin/useDashboardConfigControl';
import { useDashboardConfig } from '@/hooks/useDashboardConfig';

export const TopNotificationControl = () => {
  const { topNotification } = useDashboardConfig();
  const { setTopNotification } = useDashboardConfigControl();

  return (
    <AdminSection title="Top Notification">
      <ControlField
        type="textarea"
        label="Notification message"
        onSubmit={setTopNotification}
        value={topNotification}
      />
    </AdminSection>
  );
};
