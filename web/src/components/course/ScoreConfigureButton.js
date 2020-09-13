import React, { useState } from "react";
import { Button, Modal, notification } from "antd";
import ScoreConfigure from "./ScoreConfigure";
import { SettingOutlined } from "@ant-design/icons";
import { useMutation,gql} from "@apollo/client";

export const initScoreConfigure = () => {
  return [
    {
      name: "score1",
      value: 0.2,
      status: true,
    },
    {
      name: "score2",
      value: 0.2,
      status: false,
    },
    {
      name: "score3",
      value: 0.3,
      status: true,
    },
    {
      name: "score4",
      value: 0.5,
      status: true,
    },
  ];
};

const updateCourseScoreConfigureMutation = gql`
  mutation updateCourseScoreConfigure(
    $courseId: ID!
    $configure: [ScoreConfigureItem!]!
  ) {
    updateCourseScoreConfigure(courseId: $courseId, configure: $configure)
  }
`;
const ScoreConfigureButton = (props) => {
  const [visible, setVisible] = useState(false);
  const [editConfigure, setEditConfigure] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateCourseScoreConfigure] = useMutation(
    updateCourseScoreConfigureMutation
  );
  return (
    <>
      <Button
        icon={<SettingOutlined />}
        onClick={() => setVisible(true)}
        style={{ marginLeft: 10 }}
      >
        Thay đổi cấu hình điểm học phần
      </Button>
      {visible && (
        <Modal
          onOk={() => {
            let data = editConfigure;
            if (!data) {
              data = initScoreConfigure();
            }
            let sum = 0;
            for (let i = 0; i < data.length; i++) {
              if (data[i].status) {
                sum += data[i].value;
              }
            }
            if (sum !== 1) {
              notification.error({ message: "Hệ số điểm phải có tổng = 1" });
              return;
            }
            setLoading(true);
            updateCourseScoreConfigure({
              variables: {
                courseId: props.course.id,
                configure: editConfigure,
              },
            })
              .then(() => {
                setLoading(false);
                setVisible(false);
                if (props.onChange) {
                  props.onChange(editConfigure);
                }
              })
              .catch((e) => {
                setLoading(false)
                notification.error({
                  message: `Có lỗi xảy ra: ${e.toString()}`,
                });
              });
          }}
          okText={"Lưu thay đổi"}
          cancelText={"Huỷ"}
          onCancel={() => {
            setVisible(false);
          }}
          okButtonProps={{
            loading: loading,
          }}
          visible={true}
          title={`Cấu hình điểm học phần: ${props.course.code} - ${props.course.title}`}
        >
          <ScoreConfigure
            value={
              props.course.scoreConfigure
                ? props.course.scoreConfigure
                : initScoreConfigure()
            }
            onChange={(values) => {
              setEditConfigure(values);
            }}
          />
        </Modal>
      )}
    </>
  );
};

export default ScoreConfigureButton;
