import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    const token = req.cookies['token'];
    const formattedToken = token ? token.replace('Bearer ', '') : null;

    if (!formattedToken) {
        return res.status(403).json({ message: "Authentication token is required" });
    }

    try {
        const decoded = jwt.verify(formattedToken, process.env.JWT_SECRET || 'Secret Key');
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};



export default authenticate;

