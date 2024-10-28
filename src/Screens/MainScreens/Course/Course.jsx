
import { useEffect } from 'react';
import {
  CLTable,
  CLTableActionButtons,
  CLTableBody,
  CLTableCell,
  CLTableHeader,
  CLTableRow,
  Header,
  CLTableFooter,
  Modal,
} from '@antopolis/admin-component-library/dist/elements';
import { CardLayout } from '@antopolis/admin-component-library/dist/layout';
import { ArchiveModal } from '@antopolis/admin-component-library/dist/elements';
import CreateCourse from './CreateCourse';
import UpdateCourse from './UpdateCourse';
import { useAxiosInstance } from '../../../Hooks/Instances/useAxiosInstance';
import { COURSE_APIS } from './CourseAPIs';
import { useEntityState } from '@antopolis/admin-component-library/dist/hooks';


function Course() {
  const axiosInstance = useAxiosInstance();
  const { data, setData, setFilter, setEditModal, editModal,
    createModal, setCreateModal,
    archiveModal, setArchiveModal,
    filter, toggleFilter, toggleFilterValue, setToggleFilter,
    target, setTarget, toggleFetch, toggle,
    paginationState, setPaginationState, switchToFirstPage,
  } = useEntityState();


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

  console.log(editModal)

  return (
    <CardLayout>
      <Header
        heading='Course'
        openModal={setCreateModal}
        modalLabel='Create Course'
        searchPlaceholder='Search Course'
        filterAndSearchProps={
          {
            filter,
            setFilter,
            hasSearch: false,
            hasFilter: true,
            toggleFilterValue,
            toggleFilter,
            setToggleFilter,
          }
        }
      />

      <CLTable containerClassName='' tableClassName=''>
        <CLTableHeader headers={headers} hasActions={true} />
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
                  editBtnProps={{ setEditModal, setTarget }}
                  archiveBtnProps={{ setArchiveModal, setTarget }}

                />
              </CLTableRow>
            ))
          }
        </CLTableBody>
      </CLTable>
      <CLTableFooter
        dataLabel='Course'
        paginationState={paginationState}
        paginationDispatch={setPaginationState}
        switchToFirstPage={switchToFirstPage}
      />
      
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
