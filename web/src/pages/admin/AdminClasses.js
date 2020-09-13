import React from "react";
import { PageHeader } from "antd";
import ListClasses from "../../components/classes/ListClasses";

const AdminClasses = () => {
  return (
    <div>
      <PageHeader className="site-page-header" title="Lớp học" />
      <ListClasses />
    </div>
  );
};

export default AdminClasses;
