import React from "react";
import PropTypes from "prop-types";
import {Button, Form, Input} from "antd";
import {LOGIN_MUTATION} from "../graphqls/mutation/login";
import {useMutation} from "@apollo/react-hooks";
import {useAppValue} from "../context";

const layout = {
    labelCol: {span: 24},
    wrapperCol: {span: 24},
};
const tailLayout = {
    wrapperCol: {span: 24},
};

const LoginForm = ({onDone, onError}) => {
    const [, dispatch] = useAppValue();
    const [login, {loading}] = useMutation(LOGIN_MUTATION);
    const onFinish = (values) => {
        login({
            variables: values,
            update: (proxy, {data}) => {
                dispatch({
                    type: "login",
                    payload: data.login,
                });
                onDone(data.login);
            },
        }).catch((e) => {
            if (onError) {
                onError(e);
            }
        });
    };
    return (
        <div>
            <Form
                {...layout}
                name="basic"
                initialValues={{remember: true}}
                onFinish={onFinish}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            type: "email",
                            message: "Địa chỉ email không đúng định dạng",
                        },
                        {required: true, message: "Vui lòng nhập địa chỉ email của bạn"},
                    ]}
                >
                    <Input type="email"/>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true, message: "Vui lòng nhập mật khẩu của bạn"}]}
                >
                    <Input.Password/>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button
                        style={{width: "100%", marginTop: 20}}
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

LoginForm.propTypes = {
    onDone: PropTypes.func,
    onError: PropTypes.func,
};

export default LoginForm;
