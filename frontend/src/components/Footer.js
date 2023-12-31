import React from "react";
import { Footer as AntFooter } from "antd/lib/layout/layout";

function Footer(props) {
  return (
    <AntFooter>
      <div>
        {props.appName} ©{new Date().getFullYear()}
      </div>
    </AntFooter>
  );
}

export default Footer;
