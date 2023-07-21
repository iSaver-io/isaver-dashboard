import { Flex } from '@chakra-ui/react';

import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { ControlField } from '@/components/AdminPanel/common/ControlField';
import { useTopNotification, useTopNotificationControl } from '@/hooks/useTopNotification';

export const TopNotificationControl = () => {
  const { topNotificationRequest } = useTopNotification();
  const { updateTopNotification } = useTopNotificationControl();

  return (
    <AdminSection title="Top Notification">
      <Flex>
        <ControlField
          type="textarea"
          label="Notification message"
          onSubmit={updateTopNotification.mutateAsync}
          value={topNotificationRequest.data}
        />
      </Flex>
    </AdminSection>
  );
};
