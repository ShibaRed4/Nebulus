import { t } from "elysia"

// Corresponds to GET /api/users
export async function get({ query }) {
  console.log("Handler: GET /api/users");
  return "Hello World"
}

// This function will be ignored by the router
function helperFunction() {
  console.log("Just a helper");
}
