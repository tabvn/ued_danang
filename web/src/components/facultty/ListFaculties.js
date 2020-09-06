import React, {useState} from 'react';
import {useQuery,useMutation} from "@apollo/react-hooks";
import {Button, Drawer, Form, Input, notification, Table} from "antd";
import {GET_FACULTIES} from "../../graphqls/query/faculties";
import {gql} from "apollo-boost";
const createFacultyMutation = gql`
mutation createFaculty($input: FacultyInput!){
	createFaculty(input: $input){
		id
		name
	}
}
`
const ListFaculties = () => {
	const [visible, setVisible] = useState(false)
	const {loading, error, data, refetch} = useQuery(GET_FACULTIES);
	const [createFaculty] = useMutation(createFacultyMutation)
	const columns = [
		{
			title: 'Tên',
			dataIndex: 'name',
			key: 'name',
		},
	];

	return (
		<div>
			<Button onClick={() => setVisible(true)}>Thêm khoa</Button>
			<Table
				pagination={false}
				loading={loading}
				dataSource={data ? data.faculties : []} columns={columns}/>
			<Drawer
				onClose={() => setVisible(false)}
				title={"Thêm khoa"}
				placement="right"
				width={520}
				visible={visible}>
				<Form onFinish={(values) => {
					createFaculty({
						variables: {
							input: values
						}
					}).then(() => {
						refetch()
						setVisible(false)
					}).catch((e) => {
						setVisible(false)
						notification.error({
							message: "Có lỗi xảy " + e.toLocaleString()
						})
					})
				}}>
					<Form.Item  label={'Tên khoa'} name={"name"} rules={[{required: true, message: "Tên khoa là bắt buộc"}]}>
						<Input />
					</Form.Item>
					<div className={"submit"}>
						<Button htmlType={'submit'}>Thêm khoa</Button>
					</div>
				</Form>
			</Drawer>
		</div>
	);
};

export default ListFaculties;
