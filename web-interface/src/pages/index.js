import React from "react"
import LayoutView from "../components/entrypoint";

const Page = () => {
  return (
    <main>
      <title>Zucchini Web UI</title>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <LayoutView 
        primColor="#3f51b5"
        primLight="#757de8"
        btnColor="#3f51b5"
      />
    </main>
  )
}

export default Page;
