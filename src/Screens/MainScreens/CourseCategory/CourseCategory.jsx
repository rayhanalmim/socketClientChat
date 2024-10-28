import { useEffect } from 'react';
import { IconFolders, } from '@tabler/icons-react';
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
  Loading,
} from '@antopolis/admin-component-library/dist/elements';
import { CardLayout } from '@antopolis/admin-component-library/dist/layout';
// import { useEntity } from '@antopolis/admin-component-library/dist/hooks';
import { useEntityState } from '@antopolis/admin-component-library/src/Hooks/Hooks';
import { ArchiveModal } from '@antopolis/admin-component-library/dist/elements';
import { CLUseNavigate } from '@antopolis/admin-component-library/dist/helper';
import { CreateCourseCategory } from './CreateCourseCategory';
import { useAxiosInstance } from '../../../Hooks/Instances/useAxiosInstance';
import { COURSE_CATEGORY_APIS } from './CourseCategoryAPIS';
import UpdateCourseCategory from './UpdateCouseCategory';


function CourseCategory() {
  const axiosInstance = useAxiosInstance();
  const { data, setData, setFilter, setEditModal, editModal,
    createModal, setCreateModal,
    archiveModal, setArchiveModal,
    filter, toggleFilter, toggleFilterValue, setToggleFilter,
    target, setTarget, toggleFetch, toggle,
    paginationState, setPaginationState, switchToFirstPage, isLoading, setIsLoading,
  } = useEntityState();


  const navigate = CLUseNavigate()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const response = await axiosInstance.get(COURSE_CATEGORY_APIS + "?filter=" + filter);
      if (response.status === 200) {
        setData(response.data);
      } else {
        console.error("Failed to fetch course category:", response.data);
      }
      setIsLoading(false)
    }
    fetchData()
  }, [toggle, filter]);

  const headers = [
    { label: 'Name', className: 'min-w-24' },
    { label: 'Description', className: 'min-w-36 max-lg:hidden' },
  ];

  if (isLoading) return <Loading />


  return (

    <CardLayout>
      <Header
        heading='Course Category'
        // tabs={tabs}
        openModal={setCreateModal}
        modalLabel='Create Category'
        searchPlaceholder='Search Category'
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
                <CLTableCell className='' text={item.name} />
                <CLTableCell className='max-lg:hidden' text={item.description} />
                <CLTableActionButtons
                  isActive={item.isActive || true}
                  target={item}
                  hasView={false}
                  editBtnProps={{ setEditModal, setTarget }}
                  archiveBtnProps={{ setArchiveModal, setTarget }}
                  extraAction
                  extraActions={[
                    {
                      onClick: () => {
                        navigate(`/main/courseSubCategories/${item._id}`)
                      },
                      btnProps: {
                        icon: IconFolders,
                        tooltipText: 'SubCategory',
                        toolTipContainerClassName: '!text-slate-600  hover:!bg-slate-600 hover:!text-white ',
                        toolTipClassName: 'hover:!text-white '
                      }
                    }
                  ]}
                />
              </CLTableRow>
            ))
          }
        </CLTableBody>
      </CLTable>
      <CLTableFooter
        dataLabel='Course Category'
        paginationState={paginationState}
        paginationDispatch={setPaginationState}
        switchToFirstPage={switchToFirstPage}
      />

      <Modal
        isOpen={createModal}
        onClose={setCreateModal}
        title={'Create Category'}
      >
        <CreateCourseCategory setCreateModal={setCreateModal} toggleFetch={toggleFetch} />
      </Modal>

      <Modal
        isOpen={editModal}
        onClose={setEditModal}
        title={'Update Category'}
      >
        <UpdateCourseCategory setEditModal={setEditModal} id={target?._id} toggleFetch={toggleFetch} />
      </Modal>

      {archiveModal && (
        <ArchiveModal
          isOpen={archiveModal}
          onClose={() => setArchiveModal(false)}
          item={target}
          toggleFetch={toggleFetch}
          api={`${COURSE_CATEGORY_APIS}${target?._id}`}
          axiosInstance={axiosInstance}
          successMessage={`${target?.name} has been archived`}
          isArchive={target?.isActive}
        />
      )}


    </CardLayout>
  );
}

export default CourseCategory;
