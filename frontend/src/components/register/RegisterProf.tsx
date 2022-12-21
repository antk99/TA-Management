import "../../App.css";
import "../../style/login.css";
import DropDownStyle from "../../style/DropDownStyle";
import Select from "react-select"

const registerProf = props => {
    const faculties = ["Science", "Engineering", "Arts"];
    const departments = ["Computer Science", "Mathematics", "Physics"];

    return (<>
        <h6 style={{ paddingTop: "20px" }}>Professor Information:</h6>
        <p className="register-title">Select course(s) you are lecturing:</p>
        <div className="form-group">
            <Select
                styles={DropDownStyle}
                options={props.allCourses.map((course: any) => { return { value: course, label: course } })}
                isMulti
                isClearable={true}
                isSearchable={true}
                onChange={(e: any) => { props.setProfCourses((e.map((o: any) => o["value"]))) }}
                placeholder="Select Courses..."
            />
        </div>
        <p className="register-title">Select Faculty:</p>
        <div className="form-group">
            <Select
                styles={DropDownStyle}
                options={faculties.map((faculty: any) => { return { value: faculty, label: faculty } })}
                isSearchable={true}
                onChange={(e: any) => { props.setFaculty(e["value"]) }}
            />
        </div>
        <p className="register-title">Select Department:</p>
        <div className="form-group">
            <Select
                styles={DropDownStyle}
                options={departments.map((dep: any) => { return { value: dep, label: dep } })}
                isSearchable={true}
                onChange={(e: any) => { props.setDept(e["value"]) }}
            />
        </div>
    </>);
};

export default registerProf;