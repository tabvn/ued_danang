import React, { useState } from "react";
import { Button, Input } from "antd";
import styled from "styled-components";
import { EditOutlined } from "@ant-design/icons";
import OutsideClickHandler from "react-outside-click-handler";
import { gql, useMutation } from "@apollo/client";

const Container = styled.div`
  .value {
    display: block;
    width: 100%;
    min-width: 200px;
  }
`;

const updateTeacherNoteMutation = gql`
  mutation updateTeacherNote($courseId: ID!, $studentId: ID!, $note: String!) {
    updateTeacherNote(courseId: $courseId, studentId: $studentId, note: $note)
  }
`;
const TeacherNoteInput = (props) => {
  const [value, setValue] = useState(props.value);
  const [edit, setEdit] = useState(false);
  const [updateTeacherNote] = useMutation(updateTeacherNoteMutation);
  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        if (edit) {
          setEdit(false);
          updateTeacherNote({
            variables: {
              courseId: props.courseId,
              studentId: props.studentId,
              note: value,
            },
          });
        }
      }}
    >
      <Container
        onClick={() => {
          if (!edit) {
            setEdit(true);
          }
        }}
      >
        {edit ? (
          <Input.TextArea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        ) : (
          <div className="value">
            {value} <Button size="small" type="link" icon={<EditOutlined />} />
          </div>
        )}
      </Container>
    </OutsideClickHandler>
  );
};

export default TeacherNoteInput;
