import React, { useEffect, useState } from "react";
import "@progress/kendo-theme-default/dist/all.css";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import axios from "axios";
import "./App.css";
import { Notification } from "@progress/kendo-react-notification";
import useDidUpdeteEffect from "./hooks/useDidUpdeteEffect";
import { RESPONSE_URL } from "../src/constants/responseURL";

interface IUser {
  id: number;
  username: string;
  fullname: string;
  last_login: string;
  enabled: boolean;
}

interface ISort {
  dir: "asc" | "desc" | undefined;
  field: string;
}
interface IUknown {
  [key: string]: any;
}
interface IPagination {
  skip: number;
  take: number;
}

const initialSort: ISort[] = [
  {
    dir: "asc",
    field: "username",
  },
];

const initialDataState: IPagination = {
  skip: 0,
  take: 10,
};

const EnabledCell = (props: any) => {
  return <td>{props.dataItem[props.field] ? "Yes" : "No"}</td>;
};

const DatedCell = (props: any) => {
  const date: Date = new Date(props.dataItem[props.field]);
  const arrDate = date.toString().split(" ");
  const [dayWeek, month, day, year] = arrDate;
  const stringDate: string = `${month} ${day} ${year}`;
  return <td>{stringDate}</td>;
};

function App() {
  const [errorRequest, setErrorRequest] = useState(false);

  const responseAndDispalyUsers = (url: string) => {
    axios
      .get(url)
      .then((response) => setTimeout(() => setUsers(response.data), 1000))
      .catch((e) => {
        console.error(e.message);
        setErrorRequest(true);
      });
  };

  const [users, setUsers] = useState<IUser[] | []>([]);
  useEffect(() => {
    responseAndDispalyUsers(`${RESPONSE_URL}/users`);
  }, []);

  const [sort, setSort] = useState<ISort[]>(initialSort);
  const [page, setPage] = React.useState<IPagination>(initialDataState);
  const pageChange = (event: IUknown) => {
    setPage(event.page);
  };
  return (
    <div className="App">
      <div className="wrapp">
        <h2>User List</h2>
        <Grid
          data={orderBy(users, sort)}
          style={{ width: "100%" }}
          sortable={true}
          sort={sort}
          pageable={true}
          pageSize={10}
          onSortChange={(e: IUknown) => {
            setSort(e.sort);
          }}
        >
          <GridColumn width="250px" field="username" title="Username" />
          <GridColumn width="250px" field="full_name" title="Full name" />
          <GridColumn
            width="250px"
            field="last_login"
            title="Last login"
            cell={DatedCell}
          />
          <GridColumn
            width="250px"
            field="enabled"
            title="Enabled"
            cell={EnabledCell}
          />
        </Grid>
      </div>
      {errorRequest && (
        <Notification
          type={{
            style: "error",
            icon: true,
          }}
          style={{
            position: "fixed",
            margin: "10px",
            bottom: "0",
          }}
          closable={true}
          onClose={() => setErrorRequest(false)}
        >
          <span>Error request</span>
        </Notification>
      )}
    </div>
  );
}

export default App;
