import jwt from "jsonwebtoken"
import { serialize, parse } from "cookie"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const TOKEN_NAME = "auth_token"

// Generate JWT token
export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Create auth cookie
export function createAuthCookie(token) {
  return serialize(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

// Remove auth cookie
export function removeAuthCookie() {
  return serialize(TOKEN_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: -1,
    path: "/",
  })
}

// Get token from cookies
export function getTokenFromCookies(req) {
  const cookies = parse(req.headers.cookie || "")
  return cookies[TOKEN_NAME]
}

// Get user from request
export function getUserFromRequest(req) {
  const token = getTokenFromCookies(req)
  if (!token) return null
  return verifyToken(token)
}

// Middleware to protect routes
export function requireAuth(handler) {
  return async (req, res) => {
    const user = getUserFromRequest(req)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Non authentifié",
      })
    }

    req.user = user
    return handler(req, res)
  }
}

// Middleware to require admin role
export function requireAdmin(handler) {
  return requireAuth(async (req, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Accès refusé - Admin requis",
      })
    }

    return handler(req, res)
  })
}
