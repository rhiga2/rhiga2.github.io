---
layout: post
title:  "Imitation Learning"
date:   2017-02-07
categories: Deep Reinforcement Learning
published: false
---
## What is a Reinforcement Learning Task?
In reinforcement learning tasks, there are two basic components: an agent and its environment. As an example, suppose we want to create a self-driving car that can drive itself from Silicon Valley to our own private island of Arallon. The agent in this case is our self-driving car, and the environment is the physical world through which our car has to navigate. At each moment the agent reads some observation from the environment in the form of street view videos, GPS data, and LIDAR sensors and must decide on what actions to take based on previous and current observations. Our agent decides actions using what's called a policy.

Our policy is a function <span> \\( \pi_\theta(s_t) \\) </span> that produces the action of the agent given an observation or state \\(s_t\\) at time \\(t\\) . The policy subscript \\( \theta \\) indicates the parameters of the policy function. For example in many cases we want to express <span> \\( \pi_\theta \\) </span> as a convolutional neural network. In that case, our parameters \\(\theta\\) for a CNN will be the weights and biases of our filters (or kernels as some people would call it).  

## What Makes Reinforcement Learning Different From Supervised Learning?
Lets go back to our example involving our Arallon-bound, self-driving car. A supervised learning approach would instruct the driverless car to learn some action at every state. The important concept is that these actions are given by an "expert" for finitely many states, meaning that our agent controlling the car is only learning how to reproduce the behavior of an expert rather than come up with these actions itself. This is usually done by a technique called imitation learning in which a human drives the car; our agent observes the environment and the action taken by the human; and then our agent tries to learn some policy that imitates the human driver. When we test drive our agent, our agent may see states or observations that have never observed before. These observations should be similar enough to previous observations that our agent should be able to infer the correct action regardless of minor differences.   

In contrast, a reinforcement learning approach would only instruct the driverless car which outcomes are good and bad. For example, if our agent navigates to Arallon via driving into a shipping crate then we would specify this outcome as good, but if our agent nosedives off the pier into the Pacific ocean then this outcome is obviously bad. The goodness or badness of certain outcomes is specified by a reward function <span> \\( r(s, a) \\) </span> that informs the agent whether state \\(s\\) and action \\(a\\) is a desirable or undesirable outcome. These rewards are often times sparse (mostly 0) because we, the designers, are often unable to label all possible state and actions as desirable or undesirable. Specifying every possible path and street that leads or does not lead to our agent's destination is impossible, especially for complex environments such as the Bay Area streets. Instead, we want the agent to figure out which states and actions are desirable based it's own experiences. We will cover more about this topic in later posts.  

## Behavioral Cloning Implementation


## Why is Behavioral Cloning Not Good Enough?
Why does our Hopper-v1 agent perform so poorly? When we test run any AI agent, our agent is likely to observe states that it may has never visited before. I claimed earlier that as long as these observations were similar to observations our agent has seen in the past, then it should be fine. Some observations are not guaranteed to be similar    

What do I mean by "sort of"?              

## DAGGER Implementation

{% highlight python %}
def print_hi(name):
  print("Hi, %s" % (name,))
print('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}
