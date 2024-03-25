import { useCallback } from 'react';
import { useAccount } from 'wagmi';

export type EventName =
  | 'cross'
  | 'dashboard'
  | 'landing'
  | 'staking'
  | 'team'
  | 'raffle'
  | 'settings'
  | 'momento';
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
export type EventContext =
  | 'staking'
  | 'teams'
  | 'raffles'
  | 'levels'
  | 'avatars'
  | 'powers'
  | 'momento';
type ButtonLocation = 'header' | 'subhead' | 'up' | 'mid' | 'down' | 'footer' | 'popup';
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

const defaultProps = {
  value: undefined,
  content: undefined,
  context: undefined,
};

export const useLogger = (commonProps?: Partial<LoggerProps>) => {
  const { address } = useAccount();

  return useCallback(
    (props?: Partial<LoggerProps>) => {
      const pagePath = window.location.origin + window.location.pathname;

      const allProps = { ...defaultProps, ...commonProps, ...props };

      // @ts-ignore
      window?.dataLayer.push({
        pagePath,
        userId: address?.slice(2) || 'Not connected',
        ...allProps,
      });
    },
    [commonProps, address]
  );
};
