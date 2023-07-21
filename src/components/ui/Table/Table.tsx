import React, { FC } from 'react';
import { Table as CHTable, TableContainer } from '@chakra-ui/react';

type TableProps = {
  children: any;
};

export const Table: FC<TableProps> = ({ children }) => {
  return (
    <TableContainer position="relative" overflowY="auto" maxHeight="500px">
      <CHTable variant="main" colorScheme="teal">
        {children}
      </CHTable>
    </TableContainer>
  );
};
