import React, { useContext, useState, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown, Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../assets/images/mcgill_logo.jpg";
import "../style/subTopbar.css";
import { UserContext } from "../App";
import { UserTypes } from "../enums/UserTypes";
import ManageProfessors from "../components/sysop/ManageProfessors";
import ManageCourses from "../components/sysop/ManageCourses";
import ManageUsers from "../components/sysop/ManageUsers";
import { emptyUser } from "../classes/User";
import TACourseHistory from "../components/admin/TACourseHistory";
import TAAdmin from "../components/admin/TAAdmin";


// these don't need to be in the component since they don't change
const adminTabs = ["TA Admin"];
const managementTabs = []; // TODO: add blue tabs here
const rateTabs = ["Rate TA"];
const sysopTabs = ["Professors", "Courses", "Users"];

const tabsPerProfile = new Map<UserTypes, Array<string>>([
  [UserTypes.Admin, [...adminTabs, ...managementTabs, ...rateTabs]],
  [UserTypes.Professor, [...managementTabs, ...rateTabs]],
  [UserTypes.Student, [...rateTabs]],
  [UserTypes.Sysop, [...sysopTabs, ...adminTabs, ...managementTabs, ...rateTabs]],
  [UserTypes.TA, [...managementTabs, ...rateTabs]]
]);

// TODO: add new tab names linked to corresponding components here
const tabNamesToJSX = new Map<string, JSX.Element>([
  ["Professors", <ManageProfessors />],
  ["Courses", <ManageCourses />],
  ["Users", <ManageUsers />],
  ["TA Admin", <TAAdmin />]
]);

export function Dashboard() {

  const navigate = useNavigate();
  /**
   * Get list of user's profiles/types
   * @TODO Retrieve this information from the actual global user state
   */
  const { user, setUser } = useContext(UserContext);

  // Set a default profile
  const [currentProfile, setCurrentProfile] = useState<UserTypes>(
    UserTypes.Sysop
  );

  // Set the default array of tabs relative to our default profile
  const [currentTabs, setCurrentTabs] = useState<Array<string>>(
    tabsPerProfile.get(currentProfile)!
  );

  // On nav bar selection, this function sets the new current profile and associated tabs.
  function handleNavClick(profile: UserTypes): void {
    setCurrentProfile(profile);
    setCurrentTabs(tabsPerProfile.get(profile)!);
  }

  function handleLogout(): void {
    // remove token from local storage
    localStorage.removeItem("user");

    // set user state
    setUser(emptyUser);

    navigate("/logout");
  }

  // Render nav dropdown options and nav tabs based on state above
  return (
    <div>
      <Navbar expand="lg">
        <Container>
          <img className="logo" src={logo} alt="mcgill-logo" />
          <Nav className="me-auto">
            <NavDropdown title={currentProfile} id="basic-nav-dropdown">
              {user.userType.map((profile) => (
                <NavDropdown.Item
                  key={profile.toString()}
                  onClick={() => {
                    handleNavClick(profile);
                  }}
                >
                  {profile}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
          <button className="logout" onClick={() => handleLogout()}>
            <LogoutIcon />
          </button>
        </Container>
      </Navbar>
      <Container>
        <Tabs
          defaultActiveKey="0"
          transition={false}
          id="noanim-tab"
          className="sub"
        >
          {currentTabs.map((currentTabName, i) => (
            <Tab className="sub" key={i} eventKey={i} title={currentTabName}>
              {tabNamesToJSX.get(currentTabName)}
            </Tab>
          ))}
        </Tabs>
      </Container>
    </div>
  );
}

export default Dashboard;
