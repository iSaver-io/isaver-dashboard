import { Flex, Link, Text } from '@chakra-ui/react';

import { AdminSection } from '@/components/AdminPanel/common/AdminSection';
import { useAccounts } from '@/hooks/admin/useAccounts';
import { useContractsAddresses } from '@/hooks/admin/useContractsAddresses';
import { useExplorerLink } from '@/hooks/useExplorerLink';

export const Addresses = () => {
  const accounts = useAccounts();
  const contracts = useContractsAddresses();

  return (
    <AdminSection title="Addresses">
      <Flex direction="column">
        <Text textStyle="textMedium" mb="8px" fontSize="18px">
          Contracts
        </Text>
        <AddressInfo title="SAV (ERC20)" address={contracts.ISaverSAVToken} />
        <AddressInfo title="SAVR (ERC20)" address={contracts.ISaverSAVRToken} />
        <AddressInfo title="Staking" address={contracts.Staking} />
        <AddressInfo title="Referral Manager" address={contracts.ReferralManager} />
        <AddressInfo title="Teams" address={contracts.Teams} />
        <AddressInfo title="Raffles" address={contracts.Raffles} />
        <AddressInfo title="Raffle Ticket (ERC1155)" address={contracts.Ticket} />
        <AddressInfo title="Token exchange" address={contracts.VendorSell} />
        <AddressInfo title="Vesting" address={contracts.TokenVesting} />

        <Text textStyle="textMedium" mt="20px" mb="8px" fontSize="18px">
          Accounts (Pools)
        </Text>
        <AddressInfo title="Vesting Pool" address={accounts.vestingPool} />
      </Flex>
    </AdminSection>
  );
};

const AddressInfo = ({ title, address }: { title: string; address: string }) => {
  const explorerLink = useExplorerLink(address, true);

  return (
    <Flex alignItems="baseline" fontSize="14px">
      <Text flex="0 0 190px">{title}</Text>
      <Text flex="0 0 390px">{address}</Text>
      <Link href={explorerLink} target="_blank" color="green.400" display="block">
        Polygonscan
      </Link>
    </Flex>
  );
};
