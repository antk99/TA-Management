import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import LabelledTextbox from "./LabelledTextbox";
import TAInfoCard from "./TAInfoCard";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

type Wishlist = {
    _id: string;
    profName: string;
    profEmail: string;
    taStudentID: string;
    courseNumber: string;
    termFor: string;
    termYearFor: string;
};

type props = {
    wishlists: Array<Wishlist>;
};

const TAInfoWishlistSection = ({ wishlists }: props) => {
    const hasWishlistMembership = wishlists.length > 0;

    // set of unique prof names
    const wishlistProfsUnique = new Set<string>(wishlists.map(wishlist => wishlist.profName));

    // map of prof name to tooltip text
    const profWishlistTooltips = {};

    // create tooltip text for each prof as:
    // courseNumber1 (termFor1 yearFor1)
    wishlistProfsUnique.forEach(profName => {
        const profWishlists = wishlists.filter(wishlist => wishlist.profName === profName);
        profWishlistTooltips[profName] = (
            <>
                {profWishlists.map(wishlist => (
                    <div key={wishlist._id}>
                        {wishlist.courseNumber + " (" + wishlist.termFor + " " + wishlist.termYearFor + ")"}
                        <br />
                    </div>
                ))}
            </>
        );
    });

    const title = (
        <>
            Professor Wishlists&nbsp;
            <OverlayTrigger placement='top'
                overlay={<Tooltip>These are the professors that have this TA on their wishlist.</Tooltip>}>
                <InfoOutlinedIcon fontSize='small' />
            </OverlayTrigger>
        </>
    );

    return (
        <TAInfoCard title={title} style={{ width: '50%' }}>
            <div className="wishlistProfessors">
                {hasWishlistMembership && Array.from(wishlistProfsUnique.values()).map(profName => (
                    <OverlayTrigger key={profName} placement='top' overlay={<Tooltip>{profWishlistTooltips[profName]}</Tooltip>}>
                        <span><LabelledTextbox value={profName} /></span>
                    </OverlayTrigger>
                ))}

                {!hasWishlistMembership && "No professors have this student on their wishlist."}
            </div>
        </TAInfoCard>
    );
};

export default TAInfoWishlistSection;