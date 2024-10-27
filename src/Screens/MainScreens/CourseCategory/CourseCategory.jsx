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
} from '@antopolis/admin-component-library/dist/elements.cjs';
import { CardLayout } from '@antopolis/admin-component-library/dist/layout.cjs';
// import { useEntity } from '@antopolis/admin-component-library/dist/hooks.cjs';
import { useEntity } from '@antopolis/admin-component-library/src/Hooks/Hooks';
import { ArchiveModal } from '@antopolis/admin-component-library/dist/elements.cjs';
import { CLUseNavigate } from '@antopolis/admin-component-library/dist/helper.cjs';
import { CreateCourseCategory } from './CreateCourseCategory';
import { useAxiosInstance } from '../../../Hooks/Instances/useAxiosInstance';
import { COURSE_CATEGORY_APIS } from './CourseCategoryAPIS';
import UpdateCourseCategory from './UpdateCouseCategory';


function CourseCategory() {
  const axiosInstance = useAxiosInstance();
  const { data, setData, setEditModal, editModal,
    inviteModal: createModal, setInviteModal: setCreateModal,
    archiveModal, setArchiveModal, filter, isLoading, setIsLoading,
    target, toggleFetch, toggle, } = useEntity();

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

  console.log(createModal)

  return (

    <CardLayout>
      <Header
        heading='Course Category'
        hasSearch={false}
        // tabs={tabs}
        openModal={setCreateModal}
        modalLabel='Create Category'
        searchPlaceholder='Search Category'
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
                <CLTableCell className='' text={item.name} />
                <CLTableCell className='max-lg:hidden' text={item.description} />
                <CLTableActionButtons
                  isActive={item.isActive || true}
                  target={item}
                  hasView={false}
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
      <CLTableFooter dataLabel='Course Category' />

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
