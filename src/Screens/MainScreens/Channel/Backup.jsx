import {
    ArchiveModal,
    CLTable,
    CLTableActionButtons,
    CLTableBody,
    CLTableCell,
    CLTableFooter,
    CLTableHeader,
    CLTableImageCell,
    CLTableRow,
    Header,
    Modal,
  } from '@antopolis/admin-component-library/dist/elements';
  import { useEntityState } from '@antopolis/admin-component-library/dist/hooks';
  import { CardLayout } from '@antopolis/admin-component-library/dist/layout';
  import { useEffect, useState } from 'react';
  import { toast } from 'sonner';
  import axiosChannelInstance from "../../../Hooks/Instances/useAxiosCourseInstance";
import { ALL_CHANNEL_API } from "./AllChannelApi";

  import {
    CMS_USER_API,
    IMAGE_URL,
    PROJECT_MEMBERS_API,
    PROJECTS_API,
  } from '../Course/Utils/Apis';
  import {
    CLUseNavigate,
    CLUseParams,
  } from '@antopolis/admin-component-library/dist/helper';
  import DataLoader from '../Course/Utils/Dataloader/DataLoader';
  import InviteProjectMemberModal from './inviteProjectMember';
import axios from 'axios';
  
  function ProjectMembers() {
    const { id } = CLUseParams();
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const {
      data,
      setData,
      setFilter,
      setEditModal,
      editModal,
      createModal,
      setCreateModal,
      archiveModal,
      setArchiveModal,
      filter,
      toggleFilter,
      toggleFilterValue,
      setToggleFilter,
      target,
      setTarget,
      toggleFetch,
      toggle,
      paginationState,
      setPaginationState,
      setTotalPages,
      setTotalData,
      viewModal,
      setViewModal,
      setIsLoading,
      isLoading,
    } = useEntityState();
  
    const navigate = CLUseNavigate();
  
    useEffect(() => {
      async function fetchData() {
        setIsLoading(true);
        const { data: projectsData, status } = await axios.get(
          `${PROJECT_MEMBERS_API}?filter=${filter}&project=${id}`,
          // {
          //   params: {
          //     page: paginationState.currentPage,
          //     limit: paginationState.limit,
          //   },
          // }
        );
        if (status === 200) {
          setData(projectsData);
          // setTotalPages(projectsData?.totalPages);
          setTotalData(projectsData?.length);
        } else {
          toast.error('Failed to fetch data');
        }
      }
      fetchData();
      setIsLoading(false);
    }, [toggle, filter]);
  
    const headers = [
      { label: 'Image' },
      { label: 'Name' },
      { label: 'Email' },
      { label: 'level' },
    ];
  
    // console.log("createModal", createModal);
  
    // console.log("Projects data", data);
  
    return isLoading ? (
      <DataLoader />
    ) : (
      <CardLayout>
        <Header
          heading={`${data[0]?.project?.name} Project Members`}
          hasModal={true}
          openModal={setCreateModal}
          modalLabel='Invite Member'
          filterAndSearchProps={{
            filter,
            setFilter,
            hasSearch: false,
            hasFilter: true,
            toggleFilterValue,
            toggleFilter,
            setToggleFilter,
          }}
          hasBackBtn={true}
        />
  
        <CLTable containerClassName='' tableClassName=''>
          <CLTableHeader headers={headers} hasActions={true} />
          <CLTableBody className=''>
            {data?.length > 0 &&
              data.map((item, index) => (
                <CLTableRow key={index} className=''>
                  <CLTableImageCell url={IMAGE_URL + item?.cmsUser?.image} />
                  <CLTableCell
                    className='capitalize'
                    text={item?.cmsUser?.name}
                  />
                  <CLTableCell className='' text={item?.cmsUser?.email} />
                  <CLTableCell className='' text={item?.level} />
                  <CLTableActionButtons
                    isActive={item.isActive}
                    target={item}
                    hasView={false}
                    archiveBtnProps={{ setArchiveModal, setTarget }}
                    hasEdit={false}
                  />
                </CLTableRow>
              ))}
          </CLTableBody>
        </CLTable>
        <CLTableFooter
          dataLabel='Projects'
          paginationState={paginationState}
          paginationDispatch={setPaginationState}
        />
  
        <Modal
          isOpen={createModal}
          onClose={setCreateModal}
          title={'Invite Member'}
        >
          <InviteProjectMemberModal toggleFetch={toggleFetch} id={id} />
        </Modal>
  
        {archiveModal && (
          <ArchiveModal
            isOpen={archiveModal}
            onClose={() => setArchiveModal(false)}
            item={target?.cmsUser}
            toggleFetch={toggleFetch}
            api={`${CMS_USER_API}archiveCmsUser/${target?.cmsUser?._id}`}
            axiosInstance={axiosInstance}
            successMessage={`${target?.cmsUser?.name} has been archived`}
            isArchive={target?.isActive}
            title={target?.cmsUser?.name}
          />
        )}
      </CardLayout>
    );
  }
  
  export default ProjectMembers;
  