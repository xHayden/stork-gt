import { withAuth } from "next-auth/middleware"

const authenticatedRoutes = [
    "/api",
    "/logout"
];

const adminOnlyRoutes = [
    // "/api/v1/notifications/create", // these need internal validation checking that the right people can call them
    // "/api/v1/notifications/user",
    // "/api/v1/notifications/id",
    "/api/v1/storks/create",
    "/api/v1/teams/create",
    // "/members/add",
    // "/members/remove",
    "/api/v1/users/create",
]

export default withAuth((req) => {
},
    {
        callbacks: {
            authorized: ({ req, token }) => {
                return !(authenticatedRoutes.some(route => req.url.includes(route)) && token === null) &&
                    !(adminOnlyRoutes.some(route => req.url.includes(route)) && token?.admin != true)
            },
        
        }
    }
)