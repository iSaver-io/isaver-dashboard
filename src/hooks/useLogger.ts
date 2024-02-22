import { useCallback } from 'react';
import { useAccount } from 'wagmi';

type EventName =
  | 'cross'
  | 'dashboard'
  | 'landing'
  | 'staking'
  | 'team'
  | 'raffle'
  | 'avatarSettings';
type EventCategory = 'elements' | 'forms' | 'blocks' | 'notifications';
type EventAction =
  | 'element_click'
  | 'button_click'
  | 'form_add'
  | 'social_click'
  | 'link_click'
  | 'page_sсroll'
  | 'menu_click'
  | 'wallet_click'
  | 'link_click'
  | 'notification_show';
type EventLabel = string;
type EventValue = string | number | null;
type EventContext = 'staking' | 'teams' | 'raffles' | 'levels';
type ButtonLocation = 'header' | 'up' | 'mid' | 'down' | 'footer' | 'popup';
type ActionGroup = 'interactions' | 'conversions' | 'callbacks';

type LoggerProps = {
  event: EventName;
  category: EventCategory;
  action: EventAction;
  label: EventLabel;
  value?: EventValue;
  content?: string | number;
  context?: EventContext;
  buttonLocation: ButtonLocation;
  actionGroup: ActionGroup;
};
export const useLogger = (commonProps?: Partial<LoggerProps>) => {
  const { address } = useAccount();

  return useCallback(
    (props?: Partial<LoggerProps>) => {
      const pagePath = window.location.origin + window.location.pathname;

      // @ts-ignore
      window?.dataLayer.push({
        pagePath,
        userId: address?.slice(2) || 'Not connected',
        ...commonProps,
        ...props,
      });
    },
    [commonProps, address]
  );
};
