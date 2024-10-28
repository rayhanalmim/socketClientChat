import React, { useEffect } from 'react';
// import {
//   CLTable, CLTableActionButton, CLTableActionButtons, CLTableBody, CLTableCell, CLTableDate, CLTableDateTimeCell, CLTableHead, CLTableHeader, CLTableImageCell, CLTableRow, CLTableTime, Header,
// } from "@antopolis/admin-component-library/dist/elements";
// import { CardLayout } from "@antopolis/admin-component-library/dist/layout";
// import { useEntityState } from "@antopolis/admin-component-library/dist/hooks";
import {
  CLTable,
  CLTableActionButton,
  CLTableActionButtons,
  CLTableBody,
  CLTableCell,
  CLTableDate,
  CLTableDateTimeCell,
  CLTableHead,
  CLTableHeader,
  CLTableImageCell,
  CLTableRow,
  CLTableTime,
  Header,
  CLTableFooter,
} from '@antopolis/admin-component-library/dist/elements';
import { CardLayout } from '@antopolis/admin-component-library/dist/layout';
// import { useEntity } from '@antopolis/admin-component-library/dist/hooks';
import { useEntity } from '@antopolis/admin-component-library/src/Hooks/Hooks';

const tabs = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'invited', label: 'Invited' },
];

function Test() {
  const [modal, setModal] = React.useState(false);
  const { data, setViewModal, viewModal } = useEntity();

  const headers = [
    { label: '', className: 'min-w-16' } ,
    { label: 'Name', className: 'min-w-24' },
    { label: 'Email', className: 'min-w-36 max-lg:hidden' },
    { label: 'DateTime', className: 'min-w-36 max-lg:hidden' },
    { label: 'Date', className: 'min-w-36 max-lg:hidden' },
    { label: 'Time', className: 'min-w-36 max-lg:hidden' },
  ];

  return (
    <CardLayout>
      <Header
        heading='Venture Table'
        // tabs={tabs}
        openModal={setViewModal}
        modalLabel='Venture Modal'
        searchPlaceholder='Search Venture'
      />

      <CLTable containerClassName='' tableClassName=''>
        <CLTableHeader headers={headers} hasActions={true} />
        {/* or */}
        {/* 
            <CLTableHeader>
              <CLTableHead className=''>Th1</CLTableHead>
              <CLTableHead className=''>Th2</CLTableHead>
              <CLTableHead className=''>Th3</CLTableHead>
              <CLTableHead className=''>Actions</CLTableHead>
            </CLTableHeader> 
            */}
        <CLTableBody className=''>
          <CLTableRow className=''>
            <CLTableImageCell url='' altText='' className='max-lg:hidden' />
            <CLTableCell className=''>Name</CLTableCell>
            <CLTableCell className='max-lg:hidden' text='email@email.com' />
            <CLTableDateTimeCell className='max-lg:hidden' date={new Date()} />
            <CLTableDate className='max-lg:hidden' date={new Date()} />
            <CLTableTime className='max-lg:hidden' date={new Date()} />
            <CLTableActionButtons
              isActive={data?.isActive || true}
              target={'MyTarget'}
            />
          </CLTableRow>
        </CLTableBody>
        
      </CLTable>
      <CLTableFooter dataLabel='Venture Data' />
    </CardLayout>
  );
}

export default Test;
