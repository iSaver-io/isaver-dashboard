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
        <AddressInfo title="Avatars (ERC721)" address={contracts.ISaverAvatars} />
        <AddressInfo title="Powers (ERC1155)" address={contracts.ISaverPowers} />
        <AddressInfo title="Sell avatars & powers" address={contracts.AvatarsSell} />
        <AddressInfo title="Avatar settings" address={contracts.AvatarSettings} />
        <AddressInfo title="Birthday Present pool" address={contracts.BirthdayTokensPool} />
        <AddressInfo title="Momento" address={contracts.Momento} />
        <AddressInfo title="Momento Prizes pool" address={contracts.MomentoTokensPool} />

        <Text textStyle="textMedium" mt="20px" mb="8px" fontSize="18px">
          Accounts (Pools)
        </Text>
        <AddressInfo title="Vesting Pool" address={accounts.vestingPool} />

        <Text textStyle="textMedium" mt="20px" mb="8px" fontSize="18px">
          Helpful Links
        </Text>
        <Link href="https://polygonscan.com/unitconverter" target="_blank" color="green.400">
          Unit Converter
        </Link>
        <Link href="/vesting" target="_blank" color="green.400">
          Vestings
        </Link>
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
