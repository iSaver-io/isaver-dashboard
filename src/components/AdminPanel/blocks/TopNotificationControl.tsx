import { Flex } from '@chakra-ui/react';

import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { ControlField } from '@/components/AdminPanel/common/ControlField';
import { Button } from '@/components/ui/Button/Button';
import { useDashboardConfigControl } from '@/hooks/admin/useDashboardConfigControl';
import { useDashboardConfig } from '@/hooks/useDashboardConfig';

export const TopNotificationControl = () => {
  const { topNotification } = useDashboardConfig();
  const { setTopNotification, isAuthorized, signIn } = useDashboardConfigControl();

  return (
    <AdminSection title="Top Notification">
      <Flex>
        {isAuthorized ? (
          <ControlField
            type="textarea"
            label="Notification message"
            onSubmit={setTopNotification}
            value={topNotification}
          />
        ) : (
          <Button size="sm" onClick={signIn}>
            Log In with Google
          </Button>
        )}
      </Flex>
    </AdminSection>
  );
};
