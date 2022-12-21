import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/mcgill_logo.jpg";
import "../../App.css";
import "../../style/login.css";
import { Row, Form, Col } from "react-bootstrap";
import { UserTypes } from "../../enums/UserTypes";
import Select from "react-select"
import RegisterStudent from "./RegisterStudent";
import RegisterTA from "./RegisterTA";
import RegisterProf from "./RegisterProf";

const RegisterGeneralUser = props => {
    const [allCourses, setAllCourses] = useState<Array<String> & any>([]);
    const fetchAllCourses = async () => {
        try {
            const res = await fetch("http://127.0.0.1:3000/api/course");
            const data = await res.json();
            const courses = [];
            for (const d of data.courses) {
                courses.push(d.courseNumber);
            }
            setAllCourses(courses);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        fetchAllCourses();
    }, []);
    const [role, setRole] = useState<Array<UserTypes>>([]);
    const [studentChecked, setStudentChecked] = useState(false);
    const additionalFields = new Map<UserTypes, JSX.Element>([
        [UserTypes.Student, <RegisterStudent
            setStudentNumber={props.setStudentNumber}
            setStudentCourses={props.setStudentCourses}
            allCourses={allCourses}
        />],
        [UserTypes.TA, <RegisterTA
            setStudentNumber={props.setStudentNumber}
            setTaCourses={props.setTaCourses}
            studentChecked={studentChecked}
            allCourses={allCourses}
        />],
        [UserTypes.Professor, <RegisterProf
            setProfCourses={props.setProfCourses}
            setFaculty={props.setFaculty}
            setDept={props.setDept}
            allCourses={allCourses}
        />]
    ]);


    function handleRoleCheckbox(e: any) {
        let existingUserTypes: UserTypes[] = [...role];
        if (e.target.checked) {
            if (e.target.value == UserTypes.Student) setStudentChecked(true);
            existingUserTypes.push(e.target.value);
        } else {
            if (e.target.value == UserTypes.Student) setStudentChecked(false);
            const index = existingUserTypes.indexOf(e.target.value);
            existingUserTypes.splice(index, 1);
        }
        props.setRole(existingUserTypes);
        setRole(existingUserTypes);
    }

    return (<>
        <p className="register-title">First Name:</p>
        <div className="form-group">
            <Form.Control required
                type="text"
                name="firstName"
                id="firstName"
                onChange={(e) => props.setFirstName(e.target.value)}
            />
        </div>

        <p className="register-title">Last Name:</p>
        <div className="form-group">
            <Form.Control required
                type="text"
                name="lastName"
                id="lastName"
                onChange={(e) => props.setLastName(e.target.value)}
            />
        </div>

        <p className="register-title">Email:</p>
        <div className="form-group">
            <Form.Control required
                type="text"
                name="email"
                id="email"
                placeholder="first.last@mail.mcgill.ca"
                onChange={(e) => props.setEmail(e.target.value)}
            />
        </div>

        <p className="register-title">Password:</p>
        <div className="form-group">
            <Form.Control required
                type="password"
                name="password"
                id="password"
                onChange={(e) => props.setPassword(e.target.value)}
            />
        </div>

        <p className="register-title">Select your role(s):</p>

        <Row>
            <Col>
                <Form.Check inline type="checkbox" label="Student" value={UserTypes.Student} onChange={handleRoleCheckbox} />
            </Col>
            <Col>
                <Form.Check inline type="checkbox" label="Professor" value={UserTypes.Professor} onChange={handleRoleCheckbox} />
            </Col>
            <Col></Col>
        </Row>
        <Row>
            <Col>
                <Form.Check inline type="checkbox" label="TA" value={UserTypes.TA} onChange={handleRoleCheckbox} />
            </Col>
            <Col>
                <Form.Check inline type="checkbox" label="Admin" value={UserTypes.Admin} onChange={handleRoleCheckbox} />
            </Col>
            <Col></Col>
        </Row>
        <Row>
            <Col>
                <Form.Check inline type="checkbox" label="Sysop" value={UserTypes.Sysop} onChange={handleRoleCheckbox} />
            </Col>
            <Col></Col>
            <Col></Col>
        </Row>

        {role.map((type, index) => {
            if ([UserTypes.Student, UserTypes.TA, UserTypes.Professor].includes(type)) {
                return <div key={index}>{additionalFields.get(type)}</div>
            }
        })}
    </>);

};

export default RegisterGeneralUser;