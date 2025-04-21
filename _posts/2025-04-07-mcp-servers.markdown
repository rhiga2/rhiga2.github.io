---
layout: post
title:  "The Hello World of MCP"
date:   2025-04-07
categories: beginner
tags: beginner
image: /images/pic03.jpg
published: true
---

# The What and Why of MCP
The building block for all types of communication is standardization. The first humans to communicate had to agree on a standard — a shared understanding of sounds, gestures, or symbols — in order to convey meaning and ensure that intentions could be accurately interpretted by others. In today's modern web apps, the standard of communication are application programming interfaces (APIs) in which a server sets a standard for clients to communicate with its service. It's often up to the client developer to ensure that the standard is being met everytime the application wants to call an external service such as Google Maps, Weather Services, etc.... With the rise of agentic AI we no longer have a developer manually coding each interaction — instead, the AI must learn to interpret and follow these API standards autonomously. This shifts in responsibility of adhering to communication standards from humans to intelligent agents means that we must make a new communication layer such as Model Context Protocol (MCP) on top of APIs that are understandable and digestable to agents. Just as early humans needed shared rules to communicate effectively, modern agents need protocols like MCP to reason, plan, and act reliably across a growing ecosystem of tools and services. 

# Hello World of MCP
When first learning any programming language or framework, we often want to start with building simple examples first such as writing a Java program to output "Hello World". This allows learners to focus on the concepts and mechanics of the language or framework rather than getting into the messiness of complicated designs. With creating MCPs standards, our "Hello World" is a server that defines two read-only tools: one tool for listing the current directory and a second tool for listing the files given a directory. This system is not only easy to build, but can be tested locally as well.

# Building an MCP Server
To build an MCP server, you first have to create one. The simplest method is to use the FastMCP function and define server in a python script `mcp_intro.py`. 
{% highlight python %}
from typing import Any
import os
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("mcp_intro")
{% endhighlight %}

Next we define two tools: `get_current_directory` which takes no output and lists the current working directory and `list_directory` which takes a directory and outputs the items in the directory. Underneath the hood the implementation of these tools is very simple as they correspond to common `os` functions: `os.get_cwd` and `os.listdir` respectively. The major difference is that we create async wrapper functions and declare these functions as tools that an LLM can call using the decorator `@mcp.tool()`. 

{% highlight python %}
@mcp.tool()
async def get_current_directory() -> str:
    """
    Gets the current working directory
    """
    return os.getcwd()

@mcp.tool()
async def list_directory(directory: str) -> str:
    """
    Gets all items in a given directory

    Args:
        directory: name of directory you want to list
    """
    try:
        directories = os.listdir(directory)
        if not directories:
            return "Directory has no items!"
        return directories
    except FileNotFoundError:
        return "Directory not found!"
{% endhighlight %}

Lastly to define how to startup the server using the following code:
{% highlight python %}
if __name__ == "__main__":
    mcp.run(transport='stdio')
{% endhighlight %}

# Testing Our MCP Server
To test the MCP server, we use Claude desktop. We let Claude know about our MCP server by declaring the server in `~/Library/Application Support/Claude/claude_desktop_config.json`.
{% highlight json %}
{
    "mcpServers": {
        "mcp_intro": {
            "command": "uv",
            "args": [
                "--directory",
                "/Users/rhiga/Documents/mcp_intro",
                "run",
                "mcp_intro.py"
            ]
        }
    }
}
{% endhighlight %}

We then load up Claude desktop and check the tools are available from our server. This can be verified by prompting Claude with `list tools`:
<img src="/images/available_tools.png" alt="Available tools in Claude" width="200"/>

After verifying that tools are available, we can test the tools by prompting Claude. In this example, I ask Claude to list files in the current directory:
<img src="/images/tool_usage.png" alt="Tool usage in Claude" width="200"/>

# Conclusion
Although the example we tested and created in this blog is simple, MCP is powerful not due to any advanced techniques or innovative discoveries, but due to its ability to standardize communication between LLM agents and services. Standardization has been a driving force behind all major technnologies ranging from ancient languages to the internet, and will continue to be a driving force behind future technological ecosystems. In particular, a standard in communication between agents and services is a key component to Web 4.0, a vision of an internet that can not just connects and serves information in webpages but can also reason and transform the information that it serves. MCP is a major step towards this vision. 

Check out [Anthropics docs][mcp_intro] for a more in-depth discussion on MCPs.


[mcp_intro]: https://modelcontextprotocol.io/introduction
