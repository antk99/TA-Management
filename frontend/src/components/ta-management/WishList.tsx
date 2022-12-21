import { AddBoxRounded } from "@mui/icons-material";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { UserContext } from "../../App";
import { CourseTA } from "../../classes/CourseTA";
import { Wishlist } from "../../classes/Wishlist";
import getFullyQualifiedUrl from "../../helpers/host";
import { useHttp } from "../../hooks/useHttp";
import "../../style/course.css";
import PerformanceLogForm from "./forms/PerformanceLogForm";
import { CourseContext } from "./ManageTAs";

const WishList = () => {
    const { course } = useContext(CourseContext);
    const { user } = React.useContext(UserContext);

    const [wishlists, setWishlists] = useState<Wishlist[]>([]);

    // fetch wishlists
    const { isLoading: isWishlistsLoading, error: isWishlistsError, sendRequest: getWishlists } = useHttp(
        { url: "/api/wishlist/" + course.instructorEmail },
        (data) => { setWishlists(data.wishlist) },
        user.token
    );

    const handleAddTaToWishlist = async (ta: CourseTA) => {
        const response = await fetch(getFullyQualifiedUrl("/api/wishlist/add"), {
            method: "POST",
            headers: { "Authorization": "Bearer " + user.token, "Content-Type": "application/json" },
            body: JSON.stringify({ profEmail: course.instructorEmail, taStudentID: ta.studentID, courseNumber: course.courseNumber, termFor: course.term, termYearFor: course.year })
        });

        if (!response.ok)
            throw new Error("Could not remove course.");
        else {
            const data = await response.json();
            setWishlists([...wishlists, data.wishlist]);
        }
    };

    const handleRemoveTaFromWishlist = async (ta: CourseTA) => {
        // delete wishlist ONLY for current selected course
        const wishListId = wishlists.find(wishlist =>
            wishlist.taStudentID === ta.studentID && wishlist.courseNumber === course.courseNumber &&
            wishlist.termFor === course.term && wishlist.termYearFor === `${course.year}`)._id;
        const response = await fetch(getFullyQualifiedUrl("/api/wishlist/delete/" + wishListId), {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + user.token, "Content-Type": "application/json" },
        });

        if (!response.ok)
            throw new Error("Could not remove course.");
        else {
            setWishlists(wishlists.filter(wishlist => wishlist && wishlist.taStudentID !== ta.studentID));
        }
    }

    const taBelongsToWishList = (ta: CourseTA) => {
        return wishlists.some(wishlist =>
            wishlist.taStudentID === ta.studentID && wishlist.courseNumber === course.courseNumber &&
            wishlist.termFor === course.term && wishlist.termYearFor === `${course.year}`);
    }

    useEffect(() => {
        getWishlists();
    }, [course]);

    return (
        <div className="mt-2">
            <div className="d-flex flex-column align-items-start">
                <Card className="taInfoCard w-100">
                    <Card.Body>

                        {course.courseTAs.map((ta, i) => (
                            <div key={i} className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h4>{ta.fullName}</h4>
                                    <p className="m-0">{ta.email}</p>
                                </div>
                                {taBelongsToWishList(ta) ?
                                    <Button variant="outline-danger" onClick={() => handleRemoveTaFromWishlist(ta)}>Remove from wishlist</Button> :
                                    <Button onClick={() => handleAddTaToWishlist(ta)} variant="primary" className="d-flex align-items-center">
                                        <AddBoxRounded />
                                        <span className="ps-2">Add to wish-list</span>
                                    </Button>
                                }
                            </div>
                        ))}
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default WishList;
