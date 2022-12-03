import { Dropdown, DropdownButton } from "react-bootstrap";
import AdminButton from "./AdminButton";
import "../../style/taInfoPage.css";
import React from "react";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const TAActionsBar = ({ isAtBottom, currCourses, modifyCurrCourses }: { isAtBottom: boolean, currCourses: Array<string>, modifyCurrCourses: Function }) => {

    const courseAddInputRef = React.useRef<HTMLInputElement>();

    const handleAddCourseSubmit = (e) => {
        e.preventDefault();
        addToCourse();
    };

    const addToCourse = () => {
        if (courseAddInputRef.current) {
            modifyCurrCourses([...currCourses, courseAddInputRef.current.value]);
            courseAddInputRef.current.value = "";
        };
    };

    const removeFromCourse = (courseToRemove) => {
        modifyCurrCourses(
            currCourses.filter((course) => course !== courseToRemove)
        );
    };


    return (
        <>
            <div className={`taActionsBackdrop ${!isAtBottom && "realBackdrop"}`}></div>
            <div className="taActionsBackdrop containerBackdrop">
                <div className="taActionsBar">
                    <DropdownButton style={{ display: "flex", flexDirection: "row" }} variant="primary greenDropdown" title="Add To Course">
                        <form onSubmit={handleAddCourseSubmit}>
                            <input className="adminDropdownInput actionsBarCourseInput" type="text" placeholder={`Enter course`} ref={courseAddInputRef} />
                            <ArrowForwardIosIcon className="actionsBarCourseInputSubmit" style={{ paddingBottom: "5px" }} onClick={addToCourse} />
                        </form>
                    </DropdownButton>
                    <DropdownButton variant="primary redDropdown" title="Remove From Course">
                        {currCourses.map((course, i) => {
                            return <Dropdown.Item onClick={() => removeFromCourse(course)} key={i}>{course}</Dropdown.Item>
                        })}
                    </DropdownButton>
                </div>
            </div>
        </>
    );
}

export default TAActionsBar;