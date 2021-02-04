import React from "react"
import { Button, Drawer } from '@material-ui/core';


const DrawerItem = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <div>
      <Drawer anchor="left" open={isOpen} onClose={onClose}>
        {children}
        <Button
          variant="outlined"
          color="primary"
          style={{ margin: '15px 15px 15px 35px' }}
          onClick={onClose}
        >
          Close
        </Button>
        <div style={{ margin: '40px' }}>
          <a href="https://github.com/charly1/HackEncodeClub" target="_blank" rel="noopener noreferrer">
            DApp source code repo
          </a>
        </div>
      </Drawer>
    </div>
  );
};

export default DrawerItem;
