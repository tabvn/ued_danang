import React from 'react';
import {useQuery} from "@apollo/react-hooks";
import {GET_CLASSES} from "../../graphqls/query/classes";
import {Col, Row, Select} from "antd";
import styled from "styled-components";

const Container = styled.div `
margin-top: 10px;
`
const StudentFilter = (props) => {
	const {loading, error, data, refetch} = useQuery(GET_CLASSES, {
		variables: {
			filter: {
				limit: 200,
				offset:0,
			}
		},
	});

	const classes = data ? data.classes.nodes : []
	return (
		<Container>
			<Row>
				<Col span={5}>
					<span>Chọn lớp: </span>
					<Select onChange={(v) => {
						props.onChange({
							classId: v,
						})
					}} style={{minWidth:200}}>
						{
							classes.map((c, index) => (
								<Select.Option key={index} value={c.id}>{c.name}</Select.Option>
							))
						}
					</Select>
				</Col>
			</Row>
		</Container>
	);
};

export default StudentFilter;
