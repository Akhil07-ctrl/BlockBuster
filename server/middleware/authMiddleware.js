const adminAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const adminSecret = process.env.ADMIN_API_KEY;

    // Check if API key is provided and matches the environment variable
    if (!apiKey || apiKey !== adminSecret) {
        res.status(401);
        throw new Error('Not authorized as admin. Invalid or missing API Key.');
    }

    next();
};

module.exports = { adminAuth };
