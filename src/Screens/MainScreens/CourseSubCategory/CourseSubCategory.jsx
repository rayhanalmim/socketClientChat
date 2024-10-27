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
  Loading,
} from '@antopolis/admin-component-library/src/Components/Elements/Elements';
import { CardLayout } from '@antopolis/admin-component-library/src/Layouts/Layouts';
import { useEntity } from '@antopolis/admin-component-library/src/Hooks/Hooks';
import { useAxiosInstance } from '../../../Hooks/Instances/useAxiosInstance';
import { ArchiveModal } from '@antopolis/admin-component-library/src/Components/Elements/ArchiveModal/ArchiveModal';
import { CLUseNavigate, CLUseParams } from '@antopolis/admin-component-library/src/Helpers/ReactRouterDomHelpers';
import { COURSE_SUB_CATEGORY_APIS } from './CourseSubCategoryAPIS';
import UpdateCourseSubCategory from './UpdateCourseSubCategory';
import CreateCourseSubCategory from './CreateCourseSubCategory';

const tabs = [
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'invited', label: 'Invited' },
];

function CourseSubCategory() {
  const axiosInstance = useAxiosInstance();
  const { data, setData, setViewModal, viewModal, setEditModal, editModal,
    inviteModal: createModal, setInviteModal: setCreateModal,isLoading,setIsLoading
    ,
    archiveModal, setArchiveModal, filter,
    target, toggleFetch, toggle } = useEntity();

  const { id: categoryId } = CLUseParams();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const response = await axiosInstance.get(`${COURSE_SUB_CATEGORY_APIS}?filter=${filter}&category=${categoryId} `);
      if (response.status === 200) {
        setData(response.data);
      } else {
        console.error("Failed to fetch course category:", response.data);
      }
      setIsLoading(false)
    }
    fetchData()
  }, [toggle, filter, categoryId]);

  const headers = [
    { label: 'Category', className: 'min-w-24' },
    { label: 'Name', className: 'min-w-24' },
    { label: 'Description', className: 'min-w-36 max-lg:hidden' },
  ];

  if (isLoading) return <Loading />

  return (
    <CardLayout >
      <Header
        heading='Course Subcategory'
        hasSearch={false}
        // tabs={tabs}
        openModal={setCreateModal}
        modalLabel='Create Subcategory'
        searchPlaceholder='Search Subcategory'
        hasBackBtn = {true}
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
                <CLTableCell className='' text={item?.category?.name} />
                <CLTableCell className='' text={item?.name} />
                <CLTableCell className='max-lg:hidden' text={item?.description} />
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
      <CLTableFooter dataLabel='Course Subcategory' />

      <Modal
        isOpen={createModal}
        onClose={setCreateModal}
        title={'Create Subcategory'}
      >
        <CreateCourseSubCategory setCreateModal={setCreateModal} toggleFetch={toggleFetch} categoryId={categoryId} />
      </Modal>

      <Modal
        isOpen={editModal}
        onClose={setEditModal}
        title={'Update Subcategory'}
      >
        <UpdateCourseSubCategory setEditModal={setEditModal} id={target?._id} toggleFetch={toggleFetch} />
      </Modal>

      {archiveModal && (
        <ArchiveModal
          isOpen={archiveModal}
          onClose={() => setArchiveModal(false)}
          item={target}
          toggleFetch={toggleFetch}
          api={`${COURSE_SUB_CATEGORY_APIS}${target?._id}`}
          axiosInstance={axiosInstance}
          successMessage={`${target?.name} has been archived`}
          isArchive={target?.isActive}
        />
      )}


    </CardLayout>
  );
}

export default CourseSubCategory;
