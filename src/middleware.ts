import { withAuth } from "next-auth/middleware"

const authenticatedRoutes = [
    "/api/v1/",
    "/logout"
  ];

export default withAuth((req) => {
        
    },
    {
        callbacks: {
            authorized: ({ req, token }) => {
                return !(authenticatedRoutes.some(route => req.url.startsWith(route)) && token === null)
            }
        }
    }
)