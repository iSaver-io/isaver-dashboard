import { useState } from 'react';
import { Box, Text, useBreakpoint } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import { ReactComponent as ChevronDownIcon } from '@/assets/images/icons/chevron-down.svg';
import { useActiveAvatar, useAvatarMetadata } from '@/hooks/useAvatarSettings';

export const AllTraits = () => {
  const { activeAvatar } = useActiveAvatar();
  const { metadata, isLoading } = useAvatarMetadata();
  const bp = useBreakpoint({ ssr: false });
  const isSm = ['sm', 'md', 'lg'].includes(bp);
  const [isOpen, setOpen] = useState(!isSm);

  return activeAvatar?.isAvatarCollection && !isLoading ? (
    <Box className="allTraits">
      <button
        className={`allTraits_title ${isOpen ? 'active' : ''}`}
        onClick={() => setOpen((pv) => !pv)}
      >
        <Text textStyle="h3" textTransform="uppercase">
          all Traits
        </Text>
        <ChevronDownIcon />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="allTraits_list"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box className="allTraits_column">
              <TraitItem label="Body" value={metadata.Body} />
              <TraitItem label="Skin" value={metadata.Skin} />
              <TraitItem label="Eyes" value={metadata.Eyes} />
              <TraitItem label="Horns" value={metadata.Horns} />
              <TraitItem label="Emotion" value={metadata.Emotion} />
            </Box>
            <Box className="allTraits_column">
              <TraitItem label="Clothes" value={metadata.Clothes} />
              <TraitItem label="Accessory" value={metadata.Accessory} />
              <TraitItem label="Background" value={metadata.Background} />
              <TraitItem label="Letter" value={metadata.Letter} />
              <TraitItem label="Hobby" value={metadata.Hobby} />
            </Box>
            <Box className="allTraits_column">
              <TraitItem label="Intelligence" value={metadata.Intelligence} />
              <TraitItem label="Diligence" value={metadata.Diligence} />
              <TraitItem label="Vitality" value={metadata.Vitality} />
              <TraitItem label="Psychotype" value={metadata.Psychotype} />
              <TraitItem label="Genotype" value={metadata.Genotype} />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  ) : null;
};

const TraitItem = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="allTraits_item">
      <Text textStyle="textBold" textTransform="uppercase" color="green.400">
        {label}
      </Text>
      <Text>{value}</Text>
    </div>
  );
};
