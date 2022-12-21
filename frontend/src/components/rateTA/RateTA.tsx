import React, { useContext, useState } from "react";
import SelectCourse from "./SelectCourse";
import SelectTA from "./SelectTA";
import "../../style/userTable.css";
import "../../style/rateTA.css";
import { UserTypes } from "../../enums/UserTypes";
import { Container } from "react-bootstrap";
import { ProfileContext } from "../../pages/Dashboard";

const RateTA = () => {
  const [selectCourse, setSelectCourse] = useState("");
  const { profile } = useContext(ProfileContext);

  return (<>{
    profile == UserTypes.Student ?
      <div>
        {selectCourse != "" ?
          <SelectTA
            courseCode={selectCourse.split(" ")[0] + " " + selectCourse.split(" ")[1]}
            courseTerm={selectCourse.split(" ")[2]}
            courseYear={selectCourse.split(" ")[3]}
            courseId={selectCourse.split(" ")[4]}
            setSelectCourse={setSelectCourse}
          />
          :
          <SelectCourse setSelectCourse={setSelectCourse} />
        }
      </div> : 
      <Container className="mt-3">
        <div className="rowC">
          <h2>Must be registered as a student to rate TAs </h2>
        </div>
      </Container>
  }</>);
};

export default RateTA;
