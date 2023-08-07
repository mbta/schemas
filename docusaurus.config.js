// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

let githubOrganization = "mbta";
let githubProject = "schemas";
if (process.env.GITHUB_REPOSITORY) {
  [githubOrganization, githubProject] =
    process.env.GITHUB_REPOSITORY.split("/");
}

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "MBTA Event Schemas",
  tagline: "",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: process.env.GITHUB_ORIGIN || "http://localhost:3000",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.GITHUB_BASE || "/",

  // GitHub pages deployment config.
  organizationName: githubOrganization,
  projectName: githubProject, // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  staticDirectories: ["static"],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarCollapsed: false,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: `https://github.com/${githubOrganization}/${githubProject}/tree/main/`,
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themes: [["docusaurus-json-schema-plugin", {}]],
  plugins: ["./src/plugins/deref-json-schemas"],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "Schemas",
        logo: {
          alt: "MBTA",
          src: "img/logo.png",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "eventsSidebar",
            position: "left",
            label: "Events",
          },
          {
            href: `https://github.com/${githubOrganization}/${githubProject}`,
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Events",
                to: "/events",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: `https://github.com/${githubOrganization}/${githubProject}`,
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} MBTA. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
