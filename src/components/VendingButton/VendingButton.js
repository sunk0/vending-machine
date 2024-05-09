import React from "react";
import Button from "@mui/material/Button";
import styled from "styled-components";

const Item = styled(Button)(() => ({
  flexGrow: 1,
}));

const VendingButton = ({ action, item, disabled }) => {
  return (
    <Item disabled={disabled} variant="contained" onClick={action}>
      {item}
    </Item>
  );
};

export default VendingButton;
