import { useTokensPoolControl } from '@/hooks/admin/useTokensPoolControl';
import { ContractsEnum } from '@/hooks/contracts/useContractAbi';

import { AdminSection } from '../common/AdminSection';
import { TokensPoolControl } from '../common/TokensPoolControl';

export const MomentoControl = () => {
  const { prizesRequest } = useTokensPoolControl(ContractsEnum.MomentoTokensPool);

  return (
    <AdminSection title="Momento" isLoading={prizesRequest.isLoading}>
      <TokensPoolControl
        label="Momento Prizes Pool"
        contractName={ContractsEnum.MomentoTokensPool}
      />
    </AdminSection>
  );
};
