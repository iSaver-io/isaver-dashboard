export const getPageByPathname = (pathname: string) => {
  if (pathname === '/') return 'dashboard';
  if (pathname.includes('staking')) return 'staking';
  if (pathname.includes('team')) return 'team';
  if (pathname.includes('raffle')) return 'raffle';
  if (pathname.includes('settings')) return 'settings';
  if (pathname.includes('avatar')) return 'avatar';
  if (pathname.includes('exchange')) return 'exchange';
  if (pathname.includes('momento')) return 'momento';

  return pathname;
};
