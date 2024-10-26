import React from "react";
// import {
//   CLTable, CLTableActionButton, CLTableActionButtons, CLTableBody, CLTableCell, CLTableDate, CLTableDateTimeCell, CLTableHead, CLTableHeader, CLTableImageCell, CLTableRow, CLTableTime, Header,
// } from "@antopolis/admin-component-library/dist/elements";
// import { CardLayout } from "@antopolis/admin-component-library/dist/layout";
// import { useEntityState } from "@antopolis/admin-component-library/dist/hooks";
import {
  CLTable, CLTableActionButton, CLTableActionButtons, CLTableBody, CLTableCell, CLTableDate, CLTableDateTimeCell, CLTableHead, CLTableHeader, CLTableImageCell, CLTableRow, CLTableTime, Header,CLTableFooter
} from "@antopolis/admin-component-library/src/Components/Elements/Elements";
import { CardLayout } from "@antopolis/admin-component-library/src/Layouts/Layouts";
import { useEntityState } from "@antopolis/admin-component-library/src/Hooks/Hooks";

// const tabs = [
//   { value: "active", label: "Active" },
//   { value: "archived", label: "Archived" },
//   { value: "invited", label: "Invited" },
// ];

function Test() {
  const [modal, setModal] = React.useState(false);
  const { data, setViewModal } = useEntityState();

  const headers = [
    { label: "", className: "min-w-32" },
    { label: "Name", className: "min-w-32" },
    { label: "Email", className: "min-w-36 max-lg:hidden" },
    { label: "DateTime", className: "min-w-36 max-lg:hidden" },
    { label: "Date", className: "min-w-36 max-lg:hidden" },
    { label: "Time", className: "min-w-36 max-lg:hidden" },
  ];

  return (
    <CardLayout className="bg-slate-800 grid grid-flow-col auto-rows-max space-y-2">
      <Header
        label="Venture Table"
        // tabs={tabs}
        openModal={setViewModal}
        modalLabel="Venture Modal"
        searchPlaceholder="Search Venture"
      />

      <CLTable containerClassName="" tableClassName="">
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
        <CLTableBody className="">
          <CLTableRow className="">
            <CLTableImageCell url="" altText="" className="" />
            <CLTableCell className="">Name</CLTableCell>
            <CLTableCell className="" text="email@email.com" />
            <CLTableDateTimeCell className="" date={new Date()} />
            <CLTableDate className="" date={new Date()} />
            <CLTableTime className="" date={new Date()} />
            <CLTableActionButtons
              isActive={data?.isActive || true}
              target={"MyTarget"}
            />
          </CLTableRow>
        </CLTableBody>
      </CLTable>
      <CLTableFooter dataLabel="Venture Data" hasPagination={false} />
    </CardLayout>
  );
}

export default Test;
