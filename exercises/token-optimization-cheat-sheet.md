## GitHub Copilot Token Optimization cheat sheet:

LLMs are stateless. This means that during an AI session, the historical context is always added to the current prompt. In other words, the context (and therefore token count) increases with every round trip to the LLM. Here are some tips to help you maximize the value you get per token.


### 💡 The Core Philosophy

* **Less Context = More Value:** A common misconception is that more context leads to better outputs. Usually, decreasing the token cost increases the value/accuracy of the agent's output.
* 
* **Provide as little context as possible**, but as much as required. Think "less noise, more relevance".

* **Don't count tokens; make every token count!** 


### 🛠️ Practical Controls & Settings

* **Use "Auto Mode" for Model Selection:** Let Copilot choose the right model for the task. This is the most optimal route for token cost and comes with a **10% discount** AI Credit costs.

* **Match Model Tier to Task Complexity:** When you need to control the model usage:

* *Deep Reasoning/Planning:* Large models (e.g., Claude Opus, GPT-5.5).

* *Implementation:* Mid-tier models (e.g., Claude Sonnet, GPT-5.4).

* *Repetitive Tasks/Quick Edits:* Low-tier models (e.g., Claude Haiku, GPT-mini).

* **Clear Context Between Tasks:** Start a new chat or use the commands **`/compact`** or **`/clear`** to avoid bloated session history.

* **Minimize Enabled Tools (MCPs):**
    * Tool descriptions add overhead to the context window.
    * Review and selectively focus your agent tools; a focused tool selection (e.g., cutting down from 71 to 29 enabled tools) can save up to **1/3 of AI credits** for a single query. 
    * Excess tools can lead the agent off on a tangent or allow unnecessary permissions.
    * MCP itself does not use AI credits, but its description, tools, and any output will be added to session's context.


### ✍️ Prompt and Context Engineering Guidelines

* **Add "Be Concise":** Including this directive in your instructions is proven to optimize output token length significantly.

* **Define Completion and Stopping Points:** Be precise in your prompt guidelines and explicitly lay out conditions for stopping (e.g., *"Stop when the test passes"*) to avoid unecessary loops.

* **Only Attach Relevant Files:** Manually add only the files **necessary** for the immediate task instead of sending the entire codebase to the LLM.

* **Maintain Concise Instruction Files:** Since they are sent with every request to the LLM, keep `.github/copilot-instructions.md` or `AGENT.md` files short, clear, and updated frequently to keep them relevant to the changing needs of the project.

* **Wrap instructions in skills:** Only the description is added to the context until the agent needs the tool defined in that skill.


### 🔄 Workflow Optimization (Divide & Conquer)

* **Work in Phases:** Break long, complex tasks down sequentially into separate phases: **Research → Plan → Implement**.

* **Discard Context Between Phases:** Save output relevant for the subsequent phase in a markdown file. e.g Planning -> PLAN.md which can be fed to a fresh session for implementation. This can also be a lifesaver if a session gets interupted.

* **Leverage Subagents:** Use subagents for independent tasks.
    * Their isolated execution context keeps your main session context clean and stops token accumulation from polluting your primary chat.
    * They can be assigned models most appropriate for their tasks.

* **Avoid Agent Context Biases:** Models give lower weight to different sections of large contexts. Keep your context window utilization below 40% as sub-40 yields the most clarity in responses.

* **Wrap common functions in custom agents** If there are certain tasks your team does regularly, make a custom agent for that activity to increase consistency and control.


### 🤖 Custom Agents Architecture & Optimization

* **Enforce Strict Single-Responsibility Scoping**
    * **Minimize context cross-fertilization:** Keep agents highly isolated. A "Database Agent" shouldn't know or care about UI styling tokens; Domain separation blocks irrelevant context from polluting the prompt.
    * **Prevent cross-agent token contamination:** Avoid chaining too many custom agents together in a single loop, as the meta-instructions and system prompts of multiple agents combined will compound your base token overhead significantly.

* **Align the Agent’s Brain to its Scope**
    * **Specify appropriate model for the agent's tasks:** Match the custom agent's underlying LLM to its exact operational layer. Don't waste expensive, high-token reasoning models on a custom agent designed purely for regex generation or simple code formatting.
    * **Hardcode task-specific constraints:** Embed strict stopping criteria directly into the custom agent's system prompt (e.g., *"Output code blocks only, no conversational filler"*) to avoid stop output token waste at the source.

* **Prune the Agent's Context**
    * **Restrict default tool access:** Only grant a custom agent access to the specific tools (MCPs or CLI commands) it absolutely needs. Giving a custom agent access to a broad toolset loads the context window with descriptions and can lead the agent astray.
    * **Compress structural inputs:** When a task requires input from large files or schemas as base knowledge, feed it a minified or skeletonized version (like abstract syntax trees or TypeScript interfaces).


### 💻 Power User Tips

* **Filter Data at the Source:** Write script wrappers to trim API payloads (e.g., extracting only specific fields from a GitHub API response) before passing them into the agent.

* **Bundle commands:** Combine commands into a single script to lower the number of return journeys to LLM.

* **Optimize Shell Output:** Use specialized tools like **RTK (Rust Token Killer)** or home-made scripts to intercept and trim verbose CLI output (such as build or unit test logs) down to agent-relevant data only. RTK contributes **up to 90% fewer tokens** from logs and other output to the context window.

* **Implement Deterministic Controls Early:**  For multistep agent flows, accuracy decreases per step. To reduce the level of decay, enforce usage of localized tests, linters, and static scanners. Letting an agent iterate freely can burn large amounts of tokens on repetitive, loop-driven debugging cycles.

* **Review debug logs:**  There are chat and agent debug logs for Github Copilot. Review the logs to:
    * see the token counts from input, cache and output 
    * understand how tools and system prompts affect the context
    * see how many return journeys to the LLM even a simple request takes
    * analyze the effects of your prompts and customizations 