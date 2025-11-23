---
argument-hint: [data-model]
description: Import data model, and create JSON schema
model: sonnet[1m]
---

# Goal of this command
Your goal is to interactively create a JSON schema from the user provided data model.

# Execution steps
1) **INPUT VALIDATION** Check that you have been provided with at least $1 (file containing data model / description of data model). If not, complain immediately and abort.
2) **DEVELOP HIGH LEVEL UNDERSTANDING** Read the user provided data model in its entirety all at once. It can be descriptive or in code, or both. Ask the user as many questions as you need to understand the desired model at a high level. Avoid nitty-gritty questions such as field level clarification, etc. 
3) **CREATE DRAFT JSON SCHEMA** Write the JSON schema into a the @documentation/specifications/data-model.md markdown file. The files should contain the data model first formatted as code, followed by necessary explanations as long as they are required by an AI reading the file in the future. 
4) **ASK FOR HUMAN REVIEW** Ask the user to open the file and review the data model. Take their input, and at each step ask if there is more input, or if you can move on to the next step of providing suggestions.
5) **PROVIDE SUGGESTIONS** Review the data model and provide a detailed list of suggestions. Iteratively work through these suggestions with the user, asking for approval at every step.

Congratulations, you two have now created something beautiful for future AIs to consume.