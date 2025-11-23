---
name: convert-json-schema-to-mermaid-chart
description: Takes a data model providede as JSON schema and converts it to mermaid chart code
---

# Convert JSON schema to Mermain chart code

A user, agent, or command may provide a data model as JSON schema and ask you to convert it into mermaid chart code. You will take the input provided and return the mermaid code.

## Examples
- "Please convert the provided data model into Mermaid"
- "The following file will contain JSON schema code that I want you to convert to a Mermaid chart"

## Guidelines
- This skill is specific to data models and you should use the appropriate diagram types
- Only output Mermaid code
- Attempt to optimize the graph for vertical scrolling
- Test your code by generating an SVG file from the model

## How to test your Mermaid code
1) Install the Mermaid CLI globally: `npm install -g @mermaid-js/mermaid-cli`
2) Run it with the `mmdc` command, trying to convert your generated Mermaid code into an image to see if it works