import type { NextConfig } from "next";

// The app and its node_modules live in `frontend`. Use the directory from
// which `npm run dev` is executed so Turbopack does not resolve dependencies
// from the parent repository directory on Windows.
const projectRoot = process.cwd();

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
