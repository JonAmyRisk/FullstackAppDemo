import { useState } from "react";
import UsersRead from "../../components/UsersRead"
import UsersWrite from "../../components/UsersWrite";
import { Box } from "@mui/material";

export default function Users() {

  const [refreshKey, setRefreshKey] = useState(0);

  const handleUsersChanged = () => {
    setRefreshKey((k) => k + 1);
  };

  return <Box>
            <UsersRead refreshKey={refreshKey}/>
            <UsersWrite onSuccess={handleUsersChanged}/>
        </Box>;
}