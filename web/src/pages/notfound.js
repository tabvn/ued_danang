import React from "react";
import { Card } from "antd";

const NotFound = () => {
  return (
    <div style={{ display: "flex", width: 500, margin: "30px auto" }}>
      <Card style={{width: '100%'}} title="Lỗi 404">
        <p>Page Not Found!</p>
      </Card>
    </div>
  );
};

export default NotFound;
