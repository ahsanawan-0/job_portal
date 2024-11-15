const TestLink = require('../models/definations/TestLinkSchema'); 

const validateTestLink = async (req, res, next) => {
    const { token } = req.query; 
    console.log("Query Parameters:", req.query); // Debugging line

console.log("token",token)
    try {
        const testLinkEntry = await TestLink.findOne({ token });

        if (!testLinkEntry) {
            return res.status(404).json({ message: "Invalid or expired link." });
        }

        if (testLinkEntry.used) {
            return res.status(400).json({ message: "This link has already been used." });
        }

        if (Date.now() > testLinkEntry.expiresAt) {
            return res.status(400).json({ message: "This link has expired." });
        }

        testLinkEntry.used = true;
        await testLinkEntry.save();

        
        req.testLinkEntry = testLinkEntry;

      
        next();
    } catch (error) {
        console.error("Error validating test link:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = validateTestLink;