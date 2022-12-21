import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/mcgill_logo.jpg";
import "../App.css";
import "../style/login.css";
import { Form } from "react-bootstrap";
import { UserTypes } from "../enums/UserTypes";
import RegisterGeneralUser from "../components/register/RegisterGeneralUser";
import getFullyQualifiedURL from "./../helpers/host"
import { padding } from "@mui/system";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    /*const [userId, setUserId] = useState("");
    const regComplete = [0,0,0,0];
    let toCompleteReg = 1;
    const isRegComplete = () => {
        if (regComplete.reduce((sum, e) => sum + e, 0) == toCompleteReg) {
            navigate("/login");
        }
    };*/

    // data collected for all users
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<Array<UserTypes>>([]);

    // data collected for student (also student number for TA)
    const [studentNumber, setStudentNumber] = useState<string>();
    const [studentCourses, setStudentCourses] = useState<Array<string>>([]);

    // TA data
    /*const [taCourses, setTaCourses] = useState<Array<string>>([]);

    // prof data
    const [profCourses, setProfCourses] = useState<Array<string>>([]);
    const [faculty, setFaculty] = useState<string>("");
    const [dept, setDept] = useState<string>("");*/

    const registerStudent = async () => {
        try {
            const res = await fetch(
                getFullyQualifiedURL("/api/users/add-student"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        studentEmail: email,
                        studentID: studentNumber,
                        courses: studentCourses
                    }),
                }
            );

            if (res.status === 200) {
                /*regComplete[1] = 1;
                isRegComplete();*/
                navigate("/login");
                return;
            } else setError("Unable to Register as Student");
        } catch (error) {
            console.error(error);
        }
        setIsRegistering(false);
    }

    /*const registerTA = async () => {
        try {
            const res = await fetch(
                getFullyQualifiedURL("/api/ta/add"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        studentID: studentNumber,
                        currCourses: taCourses,
                        prevCourses: []
                    }),
                }
            );

            if (res.status === 201) {

                try {
                    const res = await fetch(
                        getFullyQualifiedURL("/api/course/addTAs"),
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                courseTA: {
                                    uuid: userId,
                                    fullName: firstName + " " + lastName,
                                    email: email,
                                    responsabilities: [],
                                    officeHours: [],
                                    studentID: studentNumber,
                                },
                                courses: taCourses
                            }),
                        }
                    );

                    if (res.status === 201) {
                        regComplete[2] = 1;
                        isRegComplete();
                        return;
                    } else setError("Unable to Register as CourseTA");
                } catch (error) {
                    console.error(error);
                }

            } else {
                setError("Unable to Register as TA");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const registerProf = async () => {
        try {
            const res = await fetch(
                getFullyQualifiedURL("/api/prof/add"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        profEmail: email,
                        faculty: faculty,
                        department: dept
                    }),
                }
            );

            if (res.status === 201) {
                regComplete[3] = 1;
                isRegComplete();
                return;
            } else setError("Unable to Register as Professor");
        } catch (error) {
            console.error(error);
        }
    }*/

    const hasError = () => {
        let hasError = false;
        if (!email || !password || !lastName || !firstName || role.length <= 0
            || (role.includes(UserTypes.Student) && (!studentNumber || studentCourses.length < 1))
            //|| (role.includes(UserTypes.TA) && (!studentNumber || taCourses.length < 1))
            //|| (role.includes(UserTypes.Professor) && (!faculty || !dept || profCourses.length < 1))
        ) {

            hasError = true;
            setError("Please fill out all the fields");
        }

        if (!email.includes("@") || email.split("@")[1].length < 1) {
            hasError = true;
            setError("Please enter a valid email");
        }

        try {
            parseInt(studentNumber)
        } catch (e) {
            hasError = true;
            setError("Please enter a valid student number");
        }

        return hasError;
    }

    const submitHandler = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setIsRegistering(true);
        let form = document.getElementById('register-form');
        form.scroll(0, 0);
        if (hasError()) {
            setIsRegistering(false);
            return;
        }

        try {
            const res = await fetch(
                getFullyQualifiedURL("/api/users/register"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password,
                        userType: role,
                    }),
                }
            );
            if (res.status === 201) {
                /*toCompleteReg += ([UserTypes.Student, UserTypes.TA, UserTypes.Professor].filter(value => role.includes(value))).length;
                regComplete[0] = 1;
                isRegComplete();*/

                const result = await res.json();
                //setUserId(result._id);

                if (role.includes(UserTypes.Student)) {
                    registerStudent();
                } else {
                    navigate("/login");
                    return;
                }
                //if (role.includes(UserTypes.TA)) registerTA();
                //if (role.includes(UserTypes.Professor)) registerProf();
                return;
            } else {
                setError("Unable to Register User");
            }
        } catch (error) {
            console.error(error);
        }
        setIsRegistering(false);
    };

    return (
        <div className="login" >
            <div className="welcome">
                <Form onSubmit={submitHandler}>
                    <div className="form-inner" id="register-form">
                        <img className="logo" src={logo} alt="mcgill-logo" />
                        {isRegistering ? <h6 style={{ paddingTop: "20px" }}>Registering...</h6> :
                            <>
                                <p className="top">Please fill in your information</p>
                                {error !== "" ? <div className="error"> * {error} </div> : ""}

                                <RegisterGeneralUser
                                    setFirstName={setFirstName}
                                    setLastName={setLastName}
                                    setEmail={setEmail}
                                    setPassword={setPassword}
                                    setRole={setRole}
                                    setStudentNumber={setStudentNumber}
                                    setStudentCourses={setStudentCourses}
                                /*setTaCourses={setTaCourses}
                                setProfCourses={setProfCourses}
                                setFaculty={setFaculty}
                                setDept={setDept}*/
                                />

                                <div className="register-button">
                                    <input style={{ backgroundColor: '#4ab244' }} type="submit" value="Register" />
                                </div>

                                <p className="bottom">
                                    <Link className="links" to="/login">
                                        Back to sign in
                                    </Link>
                                </p>
                            </>}
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Register;
