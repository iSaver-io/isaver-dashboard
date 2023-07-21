import { FC, useCallback } from 'react';
import { Box } from '@chakra-ui/react';

import { ReactComponent as DownloadIcon } from '@/assets/images/icons/download.svg';
import { Button } from '@/components/ui/Button/Button';
import { useLogger } from '@/hooks/useLogger';

type ExportButtonProps = {
  event?: 'staking' | 'team';
  buttonLocation?: 'down' | 'mid' | 'up';
  onClick: () => void;
};
export const ExportButton: FC<ExportButtonProps> = ({ buttonLocation, event, onClick }) => {
  const logger = useLogger({
    category: 'elements',
    action: 'element_click',
    label: 'sort',
    buttonLocation: 'down',
    actionGroup: 'interactions',
  });

  const handleClick = useCallback(() => {
    onClick();
    if (event && buttonLocation) {
      logger({ event, buttonLocation });
    }
  }, [logger, onClick, event, buttonLocation]);

  return (
    <Button variant="link" onClick={handleClick} height="100%">
      <Box as="span" mr="10px" display={{ sm: 'none', xl: 'unset' }}>
        Export
      </Box>
      <Box>
        <DownloadIcon width="24px" />
      </Box>
    </Button>
  );
};
