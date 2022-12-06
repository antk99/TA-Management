import { ObjectId } from "mongodb";

const objectIdFromString = (id: string): ObjectId => {
    if (!id || id.length !== 24)
        throw new Error("MongoDB ObjectId must be 24 characters long.");
    return new ObjectId(id);
}

export default objectIdFromString;