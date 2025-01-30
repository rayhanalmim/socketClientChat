import { useEffect, useState } from "react";
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
} from "@antopolis/admin-component-library/dist/elements";
import { CardLayout } from "@antopolis/admin-component-library/dist/layout";
import { CLUseNavigate } from '@antopolis/admin-component-library/dist/helper';
import CreateCourse from "./CreateChannel";
import UpdateCourse from "./UpdateChannel";
import axiosChannelInstance from "../../../Hooks/Instances/useAxiosCourseInstance";
import { ALL_CHANNEL_API } from "./APIs/AllChannelApi";
import { useEntityState } from "@antopolis/admin-component-library/dist/hooks";
import { TbUsersGroup } from 'react-icons/tb';

function Channels() {
  const {
    data,
    setData,
    setFilter,
    setEditModal,
    editModal,
    createModal,
    setCreateModal,
    setArchiveModal,
    filter,
    toggleFilter,
    toggleFilterValue,
    setToggleFilter,
    target,
    setTarget,
    toggleFetch,
    paginationState,
    setPaginationState,
  } = useEntityState();

  const [toggle, setToggle] = useState(false);
  const navigate = CLUseNavigate();

  // Using useEffect with correct dependencies
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosChannelInstance.get(ALL_CHANNEL_API);
        setData(response.data);
      } catch (error) {
        toast.error("Error fetching channels:", error);
      }
    }
      fetchData();
  
  }, [paginationState, setData, toggle]); // Fetch data on paginationState or setData change

  const headers = [
    { label: "Channel", className: "min-w-24" },
    { label: "Description", className: "min-w-36 max-lg:hidden" },
    { label: "Category", className: "min-w-24" },
    { label: "Created At", className: "min-w-24" },
  ];

  return (
    <CardLayout>
      <Header
        heading="Channel"
        openModal={setCreateModal}
        modalLabel="Create Channel"
        searchPlaceholder="Search Channel"
        filterAndSearchProps={{
          filter,
          setFilter,
          hasSearch: false,
          hasFilter: true,
          toggleFilterValue,
          toggleFilter,
          setToggleFilter,
        }}
      />
      <CLTable containerClassName="" tableClassName="">
        <CLTableHeader headers={headers} hasActions={true} />
        <CLTableBody className="">
          {data?.length > 0 &&
            data.map((item, index) => (
              <CLTableRow key={index} className="">
                <CLTableCell className="" text={item?.name} />
                <CLTableCell
                  className="max-lg:hidden"
                  text={item?.description}
                />
                <CLTableCell
                  className=""
                  text={item?.isPrivate ? "Private" : "Public"}
                />
                <CLTableCell className="" text={item?.createdAt} />
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
                        navigate(`/main/channel/members/${item?._id}`, {
                          state: item,
                        });
                      },
                      btnProps: {
                        icon: TbUsersGroup,
                        tooltipText: 'Channel Members',
                        toolTipContainerClassName:
                          '!text-pink-300  hover:!bg-pink-300 hover:!text-white ',
                        toolTipClassName: 'hover:!text-white ',
                      },
                    },
                  ]}
                />
              </CLTableRow>
            ))}
        </CLTableBody>
      </CLTable>
      <CLTableFooter
        dataLabel="Channel"
        paginationState={paginationState}
        paginationDispatch={setPaginationState}
      />
      <Modal
        isOpen={createModal}
        onClose={setCreateModal}
        title={"Create Channel"}
      >
        <CreateCourse
          setCreateModal={setCreateModal}
          toggleFetch={setToggle}
        />
      </Modal>
      <Modal isOpen={editModal} onClose={setEditModal} title={"Update Channel"}>
        <UpdateCourse
          setEditModal={setEditModal}
          id={target?._id}
          toggleFetch={toggleFetch}
        />
      </Modal>
    </CardLayout>
  );
}

export default Channels;
