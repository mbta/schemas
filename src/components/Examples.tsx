import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

type Example = {
  label?: string;
  description?: string | JSX.Element;
  json: any;
};

export default function Examples({
  examples,
}: {
  examples: Example[];
}): JSX.Element {
  if (examples.length === 1 && examples[0].label === undefined) {
    const [{ description, json }] = examples;
    return (
      <>
        {description}
        <CodeBlock language="json">{JSON.stringify(json, null, 2)}</CodeBlock>
      </>
    );
  } else {
    return (
      <Tabs>
        {examples.map(({ label, description, json }, index) => (
          <TabItem
            label={label ?? "Example"}
            value={label ?? `${index}`}
            key={label ?? index}
          >
            {description}
            <CodeBlock language="json">
              {JSON.stringify(json, null, 2)}
            </CodeBlock>
          </TabItem>
        ))}
      </Tabs>
    );
  }
}
