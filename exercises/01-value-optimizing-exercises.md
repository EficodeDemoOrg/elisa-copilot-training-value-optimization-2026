# 🚀 Copilot value Optimizing - Exercises

In these exercises, you will:
* Learn how to track various value-optimizing figures
* Understand how to inspect your session and prompt details
* Get tips on how to optimize your AI credit usage

## ✅ Prerequisites

* Copilot configured in your IDE

## 📊 Exercise 1.1: Tracking Token and Context Window Usage

1. **Session info:** Issue any simple prompt. As soon as the prompt is finished, there should be a circular icon in the bottom-right corner of the chat panel. Click it to reveal the session info and examine its contents. This information applies to the whole session, not a single prompt.
1. **AI credits consumed in a prompt:** Issue another prompt in the same session. After it is finished, hover over the response section of the latest prompt at the bottom of the chat panel. Information on the model used and the AI credits consumed for this particular prompt, rather than the whole session, should appear.
1. **Remaining AI Credits:** Click the small Copilot icon in the VS Code status bar to see how many AI credits you have left in this billing cycle and when the cycle resets. Alternatively, browse to github.com, open your profile, select Copilot => Features, and check the "Usage in this cycle" section.
1. **Copilot CLI commands:** if you are using Copilot CLI, open it in one of the projects you're using it with. Try the following commands:
    * `/chronicle cost-tips` for tips to reduce token usage and cost
    * `/usage` for session usage metrics and statistics
    * `/context` for a breakdown of the context window usage
1. **Chat Debug View:** The Chat Debug view shows the request and response details for each model interaction. Use it to verify which instructions, context, messages, and tool definitions reached the model. Click the three dots at the top of the chat panel and select "Open Chat Debug View". You should be able to see your prompts and related tool calls and model requests, plus detailed information about each of them. Click one of the model requests (the ones with the Copilot icons) to open a detailed breakdown of the metadata, system messages, user messages, and responses.


## 🥗 Exercise 1.2: Context Diet

Let's run an experiment in which we try to cut AI credit consumption by altering the prompt, enabled tools, and chat mode.

1. Close all file tabs in VS Code
1. Run a prompt with the following parameters:
    * Model: `GPT 5.6 Terra` or similar mid-tier model
    * Chat mode: `Agent`
    * Prompt: `Analyse this project for unit test improvement opportunities.`
1. Run a prompt with the following parameters:
    * Model: `GPT 5.6 Terra` or similar mid-tier model
    * Chat mode: `Ask`
    * Enabled tools: `Only read/readFile`. Disable everything else and **save the changes by clicking Ok.**
    * Prompt: `Analyse this project's backend in #apps/server/src for unit test improvement opportunities. Be concise.`
1. Note the difference in AI credit consumption in Session Info. How large was the percentage difference?
1. Check the Context Window utilization in both sessions using Session Info. Pay attention to the overall context window utilization rate and Tool Definitions figures. Are there significant differences?

## 🗜️ Exercise 1.3: Proactive Compression

1. Activate the first session from the previous exercise.
1. In Session Info, note how much of the context window is in use.
1. Run `/compact`.
1. Check the context window utilization in Session Info again. Was there a significant change?

## 🧪 Exercise 1.4: Same Task, Three Prompts

There's a broken unit test in the project. Let's try to fix it using three different prompts.

1. First run the unit tests and confirm that one of them is broken.
1. Make sure the following are selected in the chat panel:
    * Session target: `Local`
    * Set agent: `Agent`
    * Model: one of the mid-tier models, e.g. `GPT 5.6 Terra`
1. Close all file tabs in VS Code.
1. Issue the following prompts, **each time in a separate session**, and note how many AI credits each consumes in Session Info. **Discard the changes made by Copilot after each prompt.**
    1. Issue the following prompt:
    ```
    Fix broken tests
    ```
    1. Issue the following prompt:
    ```
    Fix the broken unit tests #terminalLastCommand
    ```
    1. For the final prompt, open the file board.test.ts, activate the broken test `combines search and label filters`, then prompt:
    ```
    Fix this broken unit test #terminalLastCommand
    ```
1. Compare the AI credits consumed in each session. How large was the percentage difference between the cheapest and most expensive sessions?

## ⚡ Exercise 1.5: Examining Cache Performance

1. Enable Agent Debug Log in the VS Code settings. Open Settings and search for `github.copilot.chat.agentDebugLog.fileLogging.enabled`.
1. Open the Command Palette with `cmd+shift+P` and execute the `Developer: Reload Window` command.
1. Open the Command Palette again and execute the `Developer: Open Agent Debug Logs` command. It should say "Send a chat message to get started".
1. Make sure the following are selected in the chat panel:
    * Session target: `Local`
    * Set agent: `Ask`
    * Model: one of the light weight models, e.g. `Claude Haiku 4.5`

1. Now let's execute the following prompt:
    ```text
    What unit test framework is used in this project?
    ```
    In the Agent Debug Logs, choose the session that you just created with the prompt above and select `Cache Explorer`. The Cache Explorer side panel lists model turns grouped by user request. Each turn can show the cache hit percentage, duration, model name, and timestamp. Select a turn to compare its request with the preceding request.
1. Make another prompt in the same session:
    ```text
    What unit testing framework is used in this project?
    ```
1. Make another prompt in the same session:
    ```text
    Is this the recommended unit testing framework for this type of a project?
    ```
    Examine the cache hit rates in the turns of this prompt.
1. Make yet another prompt in the same session:
    ```text
    How can I run unit tests in this project?
    ```
    Examine the cache hit rates in the turns of this prompt. You should see high cache usage in at least some of the turns.

1. Let's deliberately produce a cache miss by changing the model. Change the model to another low-cost model, e.g. GPT-5 mini. Then execute the same prompt again:
    ```text
    How can I run unit tests in this project?
    ```
    Check the cache hit rates in the turns of the last prompt. You should see a report of a cache miss due to the changed model.

