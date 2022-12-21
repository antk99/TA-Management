import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Modal } from "react-bootstrap";
import LabelledTextbox from "../admin/LabelledTextbox";
import { UserContext } from "../../App";
import getFullyQualifiedURL from "../../helpers/host";

function RateTAForm({ taName, taStdNum, courseCode }: { taName: string, taStdNum: string, courseCode: string, }) {
  const [show, setShow] = useState(false);
  const [reviews, setReviews] = useState<any>([]);
  const [comment, setComment] = useState<string>("");
  const [rating, setRating] = useState(0);
  const { user } = React.useContext(UserContext);
  const commentLength = 1000;
  const months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

  const convertScoreToStars = (score: number) => {
    return <div style={{ color: "#FCD53F", float: "left", fontSize: "20px", marginTop: "-3px" }}>
      {[...Array(score)].map((_) =>
        <>&#9733;</>
      )}
    </div>
  };

  const formatDate = (date: String) => {
    let dateCompnts = date.split("T")[0].split("-");
    return months[parseInt(dateCompnts[1]) - 1] + " " + dateCompnts[2] + ", " + dateCompnts[0];
  }

  const StarRating = () => {
    const [hover, setHover] = useState(rating);

    return (
      <div>
        {[...Array(6)].map((_, index) => {
          if (index > 0) {
            return (<span
              className={index <= hover ? "fill" : "empty"}
              onMouseEnter={() => setHover(index)}
              onClick={() => { setRating(index) }}
              onMouseLeave={() => setHover(rating)}
            >
              &#9733;
            </span>);
          }
        })}
      </div>
    );
  };

  const clearForm = () => {
    setRating(0);
    setComment("");
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch(getFullyQualifiedURL("/api/rating/studTaCourseRating"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          authorUserId: user.id,
          taStudentID: taStdNum,
          courseNumber: courseCode
        })
      });
      const data = await res.json();
      const reviewObject = [];
      if (!data || !data.ratings) return;

      for (const d of data.ratings) {
        let item: { [key: string]: any } = {
          prevId: d._id,
          prevDate: formatDate(d.createdAt),
          prevRating: d.score,
          prevComment: d.comment,
        };

        reviewObject.push(item);
      }
      setReviews(reviewObject);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (id: string) => {
    try {
      const response = await fetch(getFullyQualifiedURL("/api/rating/delete/") + (id), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
      });

      if (response.status == 200) {
        if (reviews.length > 1) {
          fetchReviews();
        } else setReviews([]);
      }
    } catch (e) {
      console.log(e)
    }

  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating < 1) {
      return;
    }

    try {
      const res = await fetch(getFullyQualifiedURL("/api/rating/add"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          authorUserId: user.id,
          taStudentID: taStdNum,
          courseNumber: courseCode,
          score: rating,
          comment: comment,
        }),
      });
      if (res.status === 200) {
        clearForm();
      }
    } catch (err) {
      console.log(err);
    }

    fetchReviews();
  };

  return (
    <div>
      <Button variant="light" onClick={() => setShow(true)} style={{ margin: "5px" }}>
        Rate
      </Button>

      <Modal show={show} onHide={() => setShow(false)}
        style={{ maxHeight: "80vh" }}
        dialogClassName="modal-lg"
        aria-labelledby="example-custom-modal-styling-title">

        <Modal.Header closeButton >
          <Modal.Title id="example-custom-modal-styling-title">Submit a rating for {taName}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row><Col>
              <StarRating />
            </Col></Row>

            <Row><Col>
              <textarea
                placeholder="Additional comments..."
                value={comment}
                onChange={(e) => { if (e.target.value.length <= commentLength) { setComment(e.target.value) } }}
                className="form-control"
                rows={3}
              />
            </Col></Row>

            <Button className="mt-3" variant="light" type="submit">
              Submit
            </Button>

          </Form>

          <Row><Col>
            {reviews.slice(0).reverse().map((review: any, index: any) => {
              return <div style={{ paddingTop: "20px", display:"inline-block", width:"100%" }}>
                <LabelledTextbox 
                  key={index} 
                  label={<>{convertScoreToStars(review.prevRating)}<span> - {review.prevDate}</span></>} 
                  value={review.prevComment} 
                />
                <div onClick={() => handleDeleteReview(review.prevId)} style={{ float:"right", color: "firebrick", paddingRight: "10px", cursor: "pointer" }}>delete</div>
              </div>
            })}

          </Col></Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RateTAForm;
