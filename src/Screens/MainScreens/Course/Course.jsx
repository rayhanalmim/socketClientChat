
import React, { useEffect, useState } from 'react';
import {
  IconArchive,
  IconArchiveOff,
  IconEdit,
  IconEye,
} from '@tabler/icons-react';
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
  Modal,
} from '@antopolis/admin-component-library/src/Components/Elements/Elements';
import { CardLayout } from '@antopolis/admin-component-library/src/Layouts/Layouts';
import { useEntity } from '@antopolis/admin-component-library/src/Hooks/Hooks';
import { useAxiosInstance } from '../../../Hooks/Instances/useAxiosInstance';
import { ArchiveModal } from '@antopolis/admin-component-library/src/Components/Elements/ArchiveModal/ArchiveModal';
import { CLUseNavigate, CLUseParams } from '@antopolis/admin-component-library/src/Helpers/ReactRouterDomHelpers';
import CreateCourse from './CreateCourse';
import UpdateCourse from './UpdateCourse';
import { COURSE_APIS } from './CourseAPIs';


const tabs = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'invited', label: 'Invited' },
];

function Course() {
  const axiosInstance = useAxiosInstance();
  const { data, setData, setViewModal, viewModal, setEditModal, editModal,
    inviteModal: createModal, setInviteModal: setCreateModal,
    archiveModal, setArchiveModal, filter,
    target, toggleFetch, toggle } = useEntity();


  useEffect(() => {
    async function fetchData() {
      const response = await axiosInstance.get(`${COURSE_APIS}?filter=${filter} `);
      if (response.status === 200) {
        setData(response.data);
      } else {
        console.error("Failed to fetch course category:", response.data);
      }
    }
    fetchData()
  }, [toggle, filter]);

  const headers = [
    { label: 'Course', className: 'min-w-24' },
    { label: 'Platform', className: 'min-w-36 max-lg:hidden' },
    { label: 'Category', className: 'min-w-24' },
    { label: 'Subcategory', className: 'min-w-24' },
  ];

  return (
    <CardLayout>
      <Header
        heading='Course'
        hasSearch={false}
        // tabs={tabs}
        openModal={setCreateModal}
        modalLabel='Create Course'
        searchPlaceholder='Search Course'
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
          {
            data?.length > 0 && data.map((item, index) => (
              <CLTableRow key={index} className=''>
                <CLTableCell className='' text={item?.courseName} />
                <CLTableCell className='max-lg:hidden' text={item?.platform} />
                <CLTableCell className='' text={item?.category?.name} />
                <CLTableCell className='' text={item?.subCategory?.name} />
                <CLTableActionButtons
                  isActive={item.isActive || true}
                  target={item}
                  hasView={false}
                  extraAction
                />
              </CLTableRow>
            ))
          }
        </CLTableBody>
      </CLTable>
      <CLTableFooter dataLabel='Course' />

      <Modal
        isOpen={createModal}
        onClose={setCreateModal}
        title={'Create Course'}
      >
        <CreateCourse setCreateModal={setCreateModal} toggleFetch={toggleFetch} />
      </Modal>

      <Modal
        isOpen={editModal}
        onClose={setEditModal}
        title={'Update Course'}
      >
        <UpdateCourse setEditModal={setEditModal} id={target?._id} toggleFetch={toggleFetch} />
      </Modal>

      {archiveModal && (
        <ArchiveModal
          isOpen={archiveModal}
          onClose={() => setArchiveModal(false)}
          item={target}
          toggleFetch={toggleFetch}
          api={`${COURSE_APIS}${target?._id}`}
          axiosInstance={axiosInstance}
          successMessage={`${target?.courseName} has been archived`}
          isArchive={target?.isActive}
          title={target?.courseName}
        />
      )}


    </CardLayout>
  );
}

export default Course;
