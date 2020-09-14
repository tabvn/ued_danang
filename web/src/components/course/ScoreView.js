import React from "react";
import {Table} from "antd";
import {initScoreConfigure} from "./ScoreConfigureButton";
import {getTitle} from "./ScoreConfigure";

const ScoreView = (props) => {
    const {score, configure, course} = props;
    let columns = [];
    let data = configure ? configure : initScoreConfigure();
    for (let i = 0; i < data.length; i++) {
        if (data[i].status) {
            columns = [
                ...columns,
                {
                    title: getTitle(data[i]),
                    render: (text, record) => <div>{record[data[i].name]}</div>,
                },
            ];
        }
    }
    columns = [
        ...columns,
        {
            title: "Tổng kết hệ số 10",
            dataIndex: "score",
        },
    ];
    return <Table pagination={false} columns={columns} dataSource={[score]}/>;
};

export default ScoreView;
