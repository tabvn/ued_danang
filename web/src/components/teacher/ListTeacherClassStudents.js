import React from "react";
import { useLazyQuery } from "@apollo/client";
import styled from "styled-components";
import { TEACHER_CLASS_STUDENTS } from "../../graphqls/query/techerStudents";
import { Table } from "antd";
import TeacherClassSelection from "../classes/TeacherClassSelection";

const Container = styled.div`
  .ant-select {
    min-width: 100%;
    margin-bottom: 10px;
  }
  .filter {
    .filter-label {
       margin-right: 0;
    }
  }
  @media(min-width: 991px){
  .ant-select{
    min-width: 300px;
    margin-bottom: 0;
  }
  }
  .filter {
    @media (min-width: 991px) {
      display: flex;
      align-items: center;
      justify-items: center;
      .filter-label{
        margin-right: 10px;
      }
    }
  }
`;
const ListTeacherClassStudents = () => {
  const [getStudents, { loading, data }] = useLazyQuery(TEACHER_CLASS_STUDENTS);

  const columns = [
    {
      title: "Mã SV",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        return <div>{`${record.lastName} ${record.firstName}`}</div>;
      },
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (text, record) => {
        return <div>{record.gender === 0 ? "Nữ" : "Nam"}</div>;
      },
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
    },
  ];
  return (
    <Container>
      <div className={"filter"}>
        <div className="filter-label">Chọn lớp sinh hoạt:</div>
        <TeacherClassSelection
          onChange={(classId) => {
            getStudents({
              variables: {
                classId,
              },
            });
          }}
        />
      </div>
      <Table
        scroll={{ x: 1200 }}
        loading={loading}
        columns={columns}
        dataSource={data ? data.teacherClassStudents : []}
      />
    </Container>
  );
};

export default ListTeacherClassStudents;
