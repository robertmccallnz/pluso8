// Define route types
export interface Route {
  path: string;
  title: string;
  protected?: boolean;
}

// Define routes
export const routes: Route[] = [
  { path: "/", title: "Home" },
  { path: "/login", title: "Login" },
  { path: "/register", title: "Register" },
  { path: "/dashboard", title: "Dashboard", protected: true },
  { path: "/profile", title: "Profile", protected: true },
  { path: "/settings", title: "Settings", protected: true },
];

// Helper functions
export function getRouteTitle(path: string): string {
  const route = routes.find(r => r.path === path);
  return route?.title || "Pluso";
}

export function isProtectedRoute(path: string): boolean {
  const route = routes.find(r => r.path === path);
  return route?.protected || false;
}
