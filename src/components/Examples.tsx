import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

function ExampleTab(props: { example: object }): JSX.Element {
  return (
    <CodeBlock language="json">
      {JSON.stringify(props.example, null, 2)}
    </CodeBlock>
  );
}
export default function Examples(props: { examples: object }): JSX.Element {
  const examples = Object.entries(props.examples);
  return (
    <Tabs>
      {examples.map(([name, example]) => (
        <TabItem label={name} value={name} key={name}>
          <ExampleTab example={example} />
        </TabItem>
      ))}
    </Tabs>
  );
}
