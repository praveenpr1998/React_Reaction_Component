import { Space, PageHeader, Select, Spin, Typography } from "antd";
import React from "react";
import _ from "lodash";

function Header(props) {
  const { users } = props;
  return (
    <Space className="header" direction="vertical" align="center">
      <PageHeader className="page-header" title="React Reaction Component" />
      {users.isPending ? (
        <Spin tip="Loading Users..." />
      ) : (
        <Space direction="vertical" align="center">
          <Typography.Title type="success" level={4}>
            Active User
          </Typography.Title>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a User"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            value={users.activeUserID}
            onSelect={props.onUserChange}
          >
            {users.payload.data && users.payload.data.length
              ? users.payload.data.map((user) => (
                  <Select.Option key={user.id} value={user.id}>
                    {user.first_name + " " + user.last_name}
                  </Select.Option>
                ))
              : null}
          </Select>
        </Space>
      )}
    </Space>
  );
}

const checkForUserStateChanges = (prevProps, nextProps) => {
  return _.isEqual(prevProps.users, nextProps.users);
};
export default React.memo(Header, checkForUserStateChanges);
