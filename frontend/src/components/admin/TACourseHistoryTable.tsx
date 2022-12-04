import React from "react";
import { Container, DropdownButton } from "react-bootstrap";
import { TA } from "../../classes/TA";
import ImportForm from "../sysop/ImportForm";
import TARow from "./TARow";
import "../../style/taTable.css";
import FilterButton from "./FilterButton";
import LabelledTextbox from "./LabelledTextbox";

const TACourseHistory = ({ TAs, focusStudent }: { TAs: Array<TA>, focusStudent: Function }) => {
    const [nameFilter, setNameFilter] = React.useState<string>("");
    const [emailFilter, setEmailFilter] = React.useState<string>("");
    const [idFilter, setIdFilter] = React.useState<string>("");
    const [currCourseFilter, setCurrCourseFilter] = React.useState<string>("");
    const [prevCourseFilter, setPrevCourseFilter] = React.useState<string>("");

    const allFilters = [
        { filterValue: nameFilter, setFilter: setNameFilter, taKey: "name", name: "Name" },
        { filterValue: emailFilter, setFilter: setEmailFilter, taKey: "email", name: "Email" },
        { filterValue: idFilter, setFilter: setIdFilter, taKey: "studentID", name: "ID" },
        { filterValue: currCourseFilter, setFilter: setCurrCourseFilter, taKey: "currCourses", name: "Current Courses", isArr: true },
        { filterValue: prevCourseFilter, setFilter: setPrevCourseFilter, taKey: "prevCourses", name: "Previous Courses", isArr: true },
    ]

    const filteredTAs = TAs.filter((ta: TA) => {
        return (
            allFilters.every((filter) => {
                let s = ta[filter.taKey];
                if (filter.isArr)
                    s = s.join(" ");
                return s.toLowerCase().includes(filter.filterValue.toLowerCase());
            }));
    });

    const resetAllFilters = () => {
        allFilters.forEach((filter) => {
            filter.setFilter("");
        });
    };

    const isFiltered = nameFilter !== "" || emailFilter !== "" || idFilter !== "" || currCourseFilter !== "" || prevCourseFilter !== "";

    return (
        <>
            <ImportForm taskName="TA Cohort Information" uploadUrl="http://127.0.0.1:3000/api/users/upload" />
            <Container className="mt-3">
                <div className="rowC">
                    <h2 style={{ marginBottom: "20px" }}>TA Course History</h2>
                </div>

                <div className="appliedFilters">
                    {isFiltered && <FilterButton filterValue="Reset Filters" isFilterDisabled={!isFiltered} resetFilter={resetAllFilters} />}

                    {allFilters.map((filter, i) => {
                        return (
                            filter.filterValue &&
                            <FilterButton key={i} filterValue={filter.filterValue} resetFilter={() => filter.setFilter("")} isFilterDisabled={false} />
                        )
                    })}
                </div>

                <div id="taCourseInfoTable">
                    <table>
                        <thead>
                            <tr>
                                <th className="column0"></th>

                                {allFilters.map((filter, i) => {
                                    return (
                                        <th key={i} className={`column${i + 1}`}>
                                            <DropdownButton className="taTableFilter" variant="secondary" title={filter.name}>
                                                <input className="adminDropdownInput" type="text" placeholder={`Enter ${filter.name.toLowerCase()}`}
                                                    value={filter.filterValue} onChange={e => filter.setFilter(e.target.value)} />
                                            </DropdownButton>
                                        </th>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTAs.map((ta: TA, i: number) => {
                                if (ta) {
                                    return <TARow key={i} ta={ta} focusStudent={focusStudent} />;
                                }
                                return null;
                            })}
                        </tbody>
                    </table>
                </div>
            </Container>
        </>
    );
};

export default TACourseHistory;