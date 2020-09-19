import React, {useCallback, useState} from "react";
import { useQuery } from "@apollo/client";
import { GET_CLASSES } from "../../graphqls/query/classes";
import { Card, Col, Input, Row, Select } from "antd";
import styled from "styled-components";
import Years from "../classes/years";
import {debounce} from 'lodash'
const Container = styled.div`
  margin-top: 10px;
  .filter-row {
    .ant-col {
      @media (min-width: 991px) {
        display: flex;
        align-items: center;
        .label {
          margin-right: 5px;
        }
      }
    }
    @media (max-width: 768px) {
      .ant-col{
        padding-bottom: 15px;
        width: 100%;
        .ant-select{
          width: 100%;
        }
      }
      .search-col {
        width: 100%;
      }
    }
  }
`;



const StudentFilter = (props) => {
  const [year, setYear] = useState(null);
  const [search,setSearch] = useState("")
  const { loading, error, data, refetch } = useQuery(GET_CLASSES, {
    variables: {
      filter: {
        limit: 200,
        offset: 0,
        year: year,
      },
    },
  });
  const classes = data ? data.classes.nodes : [];
  const notifySearch = (v) => {
    props.onChange({
      search: v
    })
  }
  const debouncedSearch = debounce(notifySearch, 300);
  return (
    <Container>
      <Card title={"Tuỳ chọn"}>
        <Row
          className={"filter-row"}
          gutter={15}
          style={{ alignItems: "center" }}
        >
          <Col>
            <div className={"label"}>Chọn khoá:</div>
            <Years
              onChange={(year) => {
                setYear(year);
                props.onChange({
                  year: year
                })
              }}
            />
          </Col>
          <Col>
            <div className={"label"}>Chọn lớp:</div>
            <Select
              loading={loading}
              onChange={(v) => {
                props.onChange({
                  classId: v,
                });
              }}
              style={{ minWidth: 200 }}
            >
              {classes.map((c, index) => (
                <Select.Option key={index} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
          <Col className={"search-col"}>
            <div className="label">
              <Input.Search value={search} onChange={(e) => {
                setSearch(e.target.value)
                debouncedSearch(e.target.value)
              }} placeholder={"Tìm kiếm"} />
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default StudentFilter;
