import React, { useEffect } from "react";
import "../../style/course.css";
import { Container } from "react-bootstrap";
import { Course } from "../../classes/Course";

const SelectCourses = ({ courses, setSelectedCourseId }) => {
  const [images, setImages] = React.useState([]);
  const IMAGES_IDS = [10, 11, 12, 13, 28, 29, 43, 46, 49, 62, 74, 164, 179, 177, 182, 191, 199]

  const getRandomImageId = () => {
    return IMAGES_IDS[Math.floor(Math.random() * IMAGES_IDS.length)];
  };

  const getUniqueRandomImageIds = (count: number) => {
    const ids = [];
    while (ids.length < count) {
      const id = getRandomImageId();
      if (!ids.includes(id)) {
        ids.push(id);
      }
    }
    return ids;
  }

  const getRandomImage = () => {
    return `https://picsum.photos/id/${getRandomImageId()}/720/420?blur=2`;
  }
  
  const getRandomImages = (count: number) => {
    const ids = getUniqueRandomImageIds(count);
    return ids.map(id => `https://picsum.photos/id/${id}/720/420?blur=2`);
  }

  useEffect(() => {
    const images = getRandomImages(courses.length);
    setImages(images);
  }, [courses])



  return (
      <Container className="mt-3">
        <div className="rowC">
          {courses.length > 0 &&
            <h2 style={{ marginBottom: "20px" }}>Select a course</h2> 
          }
          {courses.length === 0 &&
            <h2 style={{ marginBottom: "20px" }}>You are currently not registered in any course.</h2> 
          }
        </div>
        <div className="select__courses">
         {courses.map((course: Course, i) => (
            <div onClick={() => setSelectedCourseId(course.id)} className="select__course__card" key={course.courseNumber}>
              <div className="select__course__header" style={{ backgroundImage: `url(${ images[i] })` }}>
                <div className="select__course__header__content">
                  <p className="select__course__number">{course.courseNumber}</p>
                </div>
              </div>
              <div className="select__course__content">
                <p className="select__course__title">{course.courseName}</p>
                <p className="select__course__term">{`${course.term} ${course.year} \u2022 ${course.instructorName}`}</p>
              </div>
            </div>
         ))} 
        </div>
      </Container>
  );
};

export default SelectCourses;
