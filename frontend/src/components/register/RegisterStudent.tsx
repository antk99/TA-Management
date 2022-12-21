import "../../App.css";
import "../../style/login.css";
import { Form } from "react-bootstrap";
import Select from "react-select"
import DropDownStyle from "../../style/DropDownStyle";

const registerStudent = props => {
    return(<>
        <h6 style={{ paddingTop: "20px" }}>Student Information:</h6>
        <p className="register-title">Student Number:</p>
        <div className="form-group">
            <Form.Control required
                type="text"
                name="studentNumber"
                id="studentNumber"
                onChange={(e) => props.setStudentNumber(Number(e.target.value))}
            />
        </div>

        <p className="register-title">Select course(s) you are attending:</p>
        <div className="form-group">
            <Select
                styles={DropDownStyle}
                options={props.allCourses.map((course: any) => { return { value: course, label: course } })}
                isMulti
                isClearable={true}
                isSearchable={true}
                onChange={(e: any) => { props.setStudentCourses((e.map((o: any) => o["value"]))) }}
                placeholder="Select Courses..."
            />
        </div>
    </>);

};

export default registerStudent;