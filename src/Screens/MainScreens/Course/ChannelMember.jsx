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
  import axios from 'axios';

  import {
    CMS_USER_API,
    IMAGE_URL,
    PROJECT_MEMBERS_API,
    PROJECTS_API,
  } from '../Course/Utils/Apis';
  
  import DataLoader from '../Course/Utils/Dataloader/DataLoader';
  import InviteProjectMemberModal from './inviteProjectMember';
import { CLUseParams } from '@antopolis/admin-component-library/dist/helper';
  
  const CHANNEL_MEMBERS_API = 'http://localhost:5010/api/channel/getChannelMember/678ca40ba95404fd372459e2';
  
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
  
    const headers = [
      { label: 'Image' },
      { label: 'Name' },
      { label: 'Email' },
      { label: 'Level' },
    ];
  
    useEffect(() => {
      async function fetchData() {
        try {
          setIsLoading(true);


          console.log(id)
  
          // Fetch data from the hardcoded API
          const response = await axios.get(`http://localhost:5010/api/channel/getChannelMember/${id}`);

          console.log(response.data.data)
          if (response.status === 200) {
            const members = response.data.data; // Adjust based on the API response structure
            setData(members);
            setTotalData(members.length);
          } else {
            toast.error('Failed to fetch channel members');
          }
        } catch (error) {
          console.error('Error fetching channel members:', error);
          toast.error('An error occurred while fetching channel members');
        } finally {
          setIsLoading(false);
        }
      }
  
      fetchData();
    }, [toggle, filter]);
  
    return isLoading ? (
      <DataLoader />
    ) : (
      <CardLayout>
        <Header
          heading="Channel Members"
          hasModal={true}
          openModal={setCreateModal}
          modalLabel="Invite Member"
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
  
        <CLTable containerClassName="" tableClassName="">
          <CLTableHeader headers={headers} hasActions={true} />
          <CLTableBody className="">
            {data?.length > 0 &&
              data.map((item, index) => (
                <CLTableRow key={index} className="">
                  <CLTableImageCell url={item?.image} />
                  <CLTableCell className="capitalize" text={item?.name} />
                  <CLTableCell className="" text={item?.email} />
                  <CLTableCell className="" text={item?.level} />
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
          dataLabel="Channel Members"
          paginationState={paginationState}
          paginationDispatch={setPaginationState}
        />
  
        <Modal
          isOpen={createModal}
          onClose={setCreateModal}
          title="Invite Member"
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
  