# Principles

From [Pajamas Principles](https://design.gitlab.com/get-started/principles/).

Principles are a shared bar for product output (not process). North star: **sophisticated simplicity** — streamline complex workflows; avoid gimmicks; keep users on what matters.

## 1. Design for natural developer flow

Enable seamless movement through tasks without context switching.

Ask: _Are we maintaining a seamless workflow without context switches?_

- Prioritize workflow continuity over isolated features
- Connect related tasks across modules
- Keep context as the user moves

**Pass:** From a failed run, user reaches the related record and next action without copying IDs.  
**Fail:** User must open a new section and re-find the same object manually.

## 2. Start simple, reveal complexity gradually

Show what users need now; make advanced capability discoverable when needed.

Ask: _Is the simple version immediately useful, with advanced features discoverable?_

- Zero-config path for common cases
- Clear path from beginner → advanced
- Hide complexity without blocking power users

Pair with [progressive disclosure](https://design.gitlab.com/patterns/progressive-disclosure):

- Distinguish primary vs secondary actions
- Use clear triggers (button, link, More, accordion, drawer)
- Avoid three-or-more nested disclosure levels

## 3. Make everything feel like one product

Consistent patterns so learning transfers.

Ask: _Does this feel like part of one unified product?_

- Shared design system / components
- Consistent terminology and concepts
- Predictable interactions (filters, empty states, nav depth)

**Pass:** Same sidebar depth and filter habits work in Bug Reports, Help, Feature Requests, Feedback, Guides, and Discussions.  
**Fail:** Each feature invents its own nav labels, status words, or layout chrome.

## 4. Make every interaction feel instant

Design for speed from the start.

Ask: _Will every interaction feel immediate, even at scale?_

- Sub-second response for common actions
- Progressive loading for heavy work
- Optimistic UI where safe

**Pass:** List/detail chrome stays interactive while secondary data loads.  
**Fail:** Whole shell blocks on a non-critical request.

## Applying in reviews

For each change, answer the four Ask questions in one short paragraph. If any answer is no, fix before polish.
