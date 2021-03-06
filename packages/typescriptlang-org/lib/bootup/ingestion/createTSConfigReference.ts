const path = require(`path`)
const fs = require(`fs`)

import { NodePluginArgs, CreatePagesArgs } from "gatsby"

export const createTSConfigReference = async (
  graphql: CreatePagesArgs["graphql"],
  createPage: NodePluginArgs["actions"]["createPage"]
) => {
  const tsConfigRefPage = path.resolve(`./src/templates/tsconfigReference.tsx`)
  const result = await graphql(`
    query GetAllHandbookDocs {
      allFile(
        filter: {
          sourceInstanceName: { eq: "tsconfig-reference" }
          ext: { eq: ".md" }
        }
      ) {
        nodes {
          name
          modifiedTime
          absolutePath
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const anyData = result.data as any
  const docs = anyData.allFile.nodes

  docs.forEach(element => {
    const categoriesForLang = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "tsconfig-reference",
      "output",
      element.name + ".json"
    )

    // Support urls being consistent with the current infra, e.g. en with no prefix
    if (element.name === "en") {
      createPage({
        path: "/tsconfig",
        component: tsConfigRefPage,
        context: {
          locale: element.name,
          tsconfigMDPath: element.absolutePath,
          categoriesPath: categoriesForLang,
        },
      })
    }

    createPage({
      path: element.name + "/tsconfig",
      component: tsConfigRefPage,
      context: {
        locale: element.name,
        tsconfigMDPath: element.absolutePath,
        categoriesPath: categoriesForLang,
      },
    })
  })
}
