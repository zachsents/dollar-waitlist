/** @type {import("next").NextConfig} */
module.exports = {
    reactStrictMode: true,
    transpilePackages: [],
    // output: "export",
    productionBrowserSourceMaps: true,
    redirects: async () => {
        return [
            {
                source: "/:path((?!waitlist/dollar-waitlist(?:/|$)).*)",
                destination: "/waitlist/dollar-waitlist",
                permanent: false,
            },
        ]
    }
}
