import jwt from 'jsonwebtoken';
require('dotenv').config();

// for development purposes, use this secret
export const defaultSecret = "6w1eaeY9#ijgE%rwT$8e9cmEKkZwmE2b";

if (!process.env.SECRET)
    console.log("SECRET not set in env file, using default secret");
const SECRET = process.env.SECRET as string || defaultSecret;

const generateToken = (id: string) => {
    const token = jwt.sign({ id }, SECRET);
    return token;
}

export default generateToken;