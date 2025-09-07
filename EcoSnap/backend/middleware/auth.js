const { createClerkClient } = require('@clerk/backend');

const clerkClient = createClerkClient({ 
  secretKey: process.env.CLERK_SECRET_KEY 
});

const authenticateRequest = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : req.headers["clerk-session"];//authHeader.substring(7); // Remove "Bearer " prefix working
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    // Verify the token with Clerk
    const session = await clerkClient.sessions.verifySession(token);
    
    if (!session) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user details from Clerk
    const user = await clerkClient.users.getUser(session.userId);
    
    // Attach user information to the request
    req.user = {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress||null,
      //name: `${user.firstName} ${user.lastName}`.trim() //correct working
      name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "Unknown User",
      role: user.publicMetadata?.role || "donor" // optional by gpt
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = { authenticateRequest };