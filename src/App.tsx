import React, { useEffect, useState } from "react";
import "@progress/kendo-theme-default/dist/all.css";
import { process } from "@progress/kendo-data-query";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import axios from "axios";
import "./App.css";
import { Notification } from "@progress/kendo-react-notification";
import { RadioButton } from "@progress/kendo-react-inputs";
import useDidUpdeteEffect from "./hooks/useDidUpdeteEffect";

interface IUser {
  id: number;
  username: string;
  fullname: string;
  last_login: string;
  enabled: boolean;
}

const EnabledCell = (props: any) => {
  return <td>{props.dataItem[props.field] ? "Yes" : "No"}</td>;
};

const DatedCell = (props: any) => {
  const date: Date = new Date(props.dataItem[props.field]);
  const arrDate = date.toString().split(" ");
  const stringDate: string = `${arrDate[1]} ${arrDate[2]} ${arrDate[3]}`;
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
    responseAndDispalyUsers("http://localhost:3000/users");
  }, []);

  const [activeFilter, setActiveFilter] = useState("without");
  const changeActiveFilter = (filter: string) => () => setActiveFilter(filter);

  useDidUpdeteEffect(() => {
    switch (activeFilter) {
      case "without":
        responseAndDispalyUsers("http://localhost:3000/users");
        break;
      case "username":
        responseAndDispalyUsers(
          "http://localhost:3000/users?_sort=username&order=desc"
        );
        break;
      case "full_name":
        responseAndDispalyUsers(
          "http://localhost:3000/users?_sort=full_name&order=desc"
        );
        break;
      case "last_login":
        responseAndDispalyUsers(
          "http://localhost:3000/users?_sort=last_login&order=desc"
        );
        break;
      case "enabled":
        responseAndDispalyUsers(
          "http://localhost:3000/users?_sort=enabled&order=asc"
        );
    }
  }, [activeFilter]);

  const radiosData = [
    {
      label: "Without a filter",
      value: "without",
    },
    {
      label: "By username",
      value: "username",
    },
    {
      label: "By full name",
      value: "full_name",
    },
    {
      label: "By last login",
      value: "last_login",
    },
    {
      label: "By enabled",
      value: "enabled",
    },
  ];
  return (
    <div className="App">
      <div className="wrapp">
        <h2>User List</h2>
        <div className="filters">
          <p>Filter:</p>
          {radiosData.map((el) => (
            <div style={{ marginBottom: "10px" }}>
              <RadioButton
                name="filter"
                value={el.value}
                checked={activeFilter === el.value}
                label={el.label}
                onChange={changeActiveFilter(el.value)}
              />
              <br />
            </div>
          ))}
        </div>
        <Grid data={users} style={{ width: "100%" }}>
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
