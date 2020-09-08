import React, {useState} from 'react';
import {DownloadOutlined} from "@ant-design/icons";
import {Button, notification} from "antd";
import {useMutation} from "@apollo/react-hooks";
import {gql} from "apollo-boost";
import {API_URL, APP_URL} from "../../config";

const exportCourseStudentsMutation = gql`
	mutation exportCourseStudents($courseId: ID!){
		exportCourseStudents(courseId: $courseId)
	}
`
const ExportCourseStudentsButton = (props) => {
    const [loading, setLoading] = useState(false)
    const [exportCourseStudents] = useMutation(exportCourseStudentsMutation)
    return (
        <Button loading={loading} onClick={() => {
            setLoading(true)
            exportCourseStudents({
                variables: {
                    courseId: props.courseId
                }
            }).then((res) => {
                setLoading(false)
                window.location.href = API_URL + '/storage/'+res.data.exportCourseStudents
            }).catch((e) => {
                setLoading(false)
                notification.error({message: `Có lỗi xảy ra: ${e.toString()}`})
            })
        }} style={{marginLeft: 10}} icon={<DownloadOutlined/>}>
            Tải về dạng excel
        </Button>
    );
};

export default ExportCourseStudentsButton;
