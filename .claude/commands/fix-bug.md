---
argument-hint: [bug description]
description: Fix bugs and update standards if necessary
model: claude-haiku-4-5
---

# Fix bugs and update standards if necessary
The user will pass a bug description. Your job is to:

# Steps to strictly follow:
1) Ask clarifying questions if necessary
2) Suggest a fix, bug ask for approval/feedback before implementing
3) Determine if this kind of bug could be avoided with an update to the engineering standards in @standards
3.1) If so, search for the appropriate standard withing @standards/... subdirectories (look at all files)
3.2) Suggest an addition/modification of the standards and ask the user for approval to make the change