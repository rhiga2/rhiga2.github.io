---
layout: post
title:  "Unifying Equations and Inequalities in Deep Learning"
date:   2025-04-07
categories: beginner
tags: beginner
image: /images/equations-cover.jpg
published: true
---
# Unifying Equations and Inequalities 
Physics is a broad field that encompasses and describes phenonmenon from the diffusion of molecules in a glass of water to the motion of planets in solar systems. Despite the vastness of the field, there are only a small set of equations and inequalities that are used to summarize the entirety the different fields such as Maxwell's equations for electromagnetism, the Navier-Stokes equations for fluid dynamics, and \(E=mc^2\) for relativity to name a few. The same is true for deep learning and AI where only a few equations and inequalities are needed to understand the majority of progress in the field. In this post, I will summarize the theoretical minimum needed to understand deep learning and where it's headed in the future.  

# Bayes' Theorem
There are two interpretations of probability: frequentist and Bayesian. Frequentist probability is based on the idea that probability is the long-term frequency of an event occurring in repeated trials. For example, if you flip a coin 100 times and it lands on heads 55 times, the frequentist probability of heads is 0.55. Bayesian probability, on the other hand, is based on the idea that probability is a measure of belief or certainty about an event. Bayesian probability is often used in situations where we have sparse or limited data as opposed to frequentist probability which requires a large amount of data to have any accuracy guarantees. 
The most important equation in Bayesian probability is Bayes' theorem, which dictates how to update our beliefs based on new evidence. Our initial belief pre-update is called the prior, for example our belief that event \(A\) will occur can be described as \(P(A)\). Given new evidence from event \(B\), we update our belief about \(A\) to the posterior \(P(A|B)\), which is the probability of event A given event B. The equation for Bayes' theorem shows how we can convert our prior to posterior:
$$
P(A|B) = \frac{P(B|A)P(A)}{P(B)} P(A)
$$
Another important quantity in Bayes' theorem is the likelihood \(P(B|A)\). This quantity describes how likely we are to observe the eviedence or data \(B\) given our belief about \(A\). In frequentist probability, the likelihood is often used instead of the posterior to estimate parameters in a deep learning model as we will see in the next section. 

# Minimizing Cost = Negative Log Likelihood
Maximum likelihood estimation (MLE) is a common frequentist method for estimating parameters in a probabilistic model. The idea behind MLE is to find the parameters that maximize the likelihood of observing the data that we know to be true. In other words, we want to find the parameters that make the observed data most likely. 
In the realm of deep learning, we often treat the output of our model as a probability distribution parameterized over billions of knobs \(\theta\) that we need to tune via an optimization algorithm. Often times we frame optimization as a minimization problem given a cost function \(J(\theta)\) that measures the performance gap between our current model and the best model we can achieve (one that models the data the best). This is where maximum likelihood estimation is often useful; we can define the cost function as the negative log likelihood of the data given our parameterization of the model. This is expressed by equation:
$$
J(\theta) = -\log p_\theta(Y|X) = -\sum_{i=1}^N \log p_\theta(y^{(i)}|x^{(i)})
$$
where \(X\) is the data we observe, \(Y\) is the true labels, and \(p_\theta(y^{(i)}|x^{(i)})\) is the likelihood of observing the true label \(y^{(i)}\) given \(x^{(i)}\). Note that this setup assumes that the observations are IID and most common parameter estimation method in supervised and self-supervised cases. 
In binary classification problems for example, we can model the likelihood of observing \(x^{(i)}\) given the true label \(y^{(i)}\) as a Bernoulli distribution where the probability of observing \(y^{(i)} = 1\) given \(x^{(i)}\) is the output of the of our deep learning model \(f_\theta(x^{(i)})\). We can then express the likelihood as:
$$
p_\theta(y^{(i)}|x^{(i)}) = f_\theta(x^{(i)})^{y^{(i)}} * (1 - f_\theta(x^{(i)}))^{1 - y^{(i)}}
$$
Thus the cost function for binary classifcation can be expressed as:
$$
J(\theta) = -\sum_{i=1}^N \left( y^{(i)} \log f_\theta(x^{(i)}) + (1 - y^{(i)}) \log (1 - f_\theta(x^{(i)})) \right)
$$
which is known as the log-loss or binary cross-entropy loss.

# The Objective of Reinforcement Learning = Maximizing Expected Return
Maximum likelihood estimation (MLE) is a common method for supervised deep learning where we have IID observed features \(X\) and the correct behaviors \(Y\). In reinforcement learning, we don't have the correct behavior, and in many cases we may have detrimental behaviors that we want to avoid. In this case, instead of specifying the correct action we instead specify a reward function \(r(x, y)\) that describes how good the action \(y\) is given the observation \(x\). We don't want to use maximum likelihood estimation in this scanario for two reasons: (1) the observed behavior may be something we want to avoid meaning that we don't want to maximize it's likehood and (2) even if the observed behavior is good it may lead to bad outcome in the future since our actions are not independent.  

Instead of MLE for RL, we instead want to maximize the expected future rewards amongst a sequence of observations and actions often referred to as a trajectory \(\tau\). Not only do we care about the future rewards but we also care about when we receive these rewards. For example, getting $100 today is more valuable than getting $100 in 100 years. Thus rewards further into the future should be discounted by a factor \(\gamma\). The expected rewards of a trajectory discounted into the future is called the return: 
$$
G(\tau) = \sum_{t=0}^{T} \gamma^t r(x^{(t)}, y^{(t)})
$$
where \(T\) is the length of the observed trajectory. Note that the actual trajectory \(\tau\) is determined by the environment or policies or valuations modelled by our deep learning network (we combine both into distribution \(p_\theta\)). The goal of reinforcement learning is to maximize the expected return over trajectories:
$$
J(\theta) = -\mathbb{E}_{\tau \sim p_\theta} [G(\tau)]
$$

# Backpropagation (the Chain Rule)
In the previous two sections, we went over the two most common objective functions in deep learning: negative log-likelihood and expected return. The question remains how do we optimize these objective functions? Nearly all deep learning models are trained using first-order optimization algorithms that as named as such because they only require first-order derivatives such as cost function gradients as opposed to second-order derivatives such as Hessians. The reason why many deep learning model prefer first-order methods is simple: scalability. First order methods require linear memory and time complexity as a function of the number of parameters whereas second-order methods require quadratic memory and time complexity. If your model has billions of parameters like many modern LLM, second-order methods are intractable. 
Since deep learning models rely on first-order optimization methods, we need to have an algorithm for computing gradients. This where backpropagation comes in. Backpropagation is a method for computing the gradient of a function with respect to its inputs by applying the chain rule of calculus. The chain rule states that if we have a composition of functions \(f(g(x))\), then the derivative of the composition is the product of the derivatives of the outer and inner functions: 
$$
\frac{d}{dx} f(g(x)) = f'(g(x)) \cdot g'(x)
$$
Backpropagation starts by computing the gradients of the outputs with respect to the cost function and then propagating the gradients backwards via the chain rule until you reach the inputs and parameters of the network.  

# Minibatch Gradient Descent
Now that we have backpropgation to compute gradients, we can use these gradients to optimize our objective or cost function. The simplest method for applying the gradients to the parameters is to use minibatch gradient descent. In minibatch gradient descent, you compute the gradients for a small batch of examples from the training set \(\nabla_\theta J\) and then update the parameters in opposite direction of the gradient. Note that gradients point in the direction of steepest ascent, the intuition behind gradient descent is that the opposite direction of the gradient will be a direction of descent. Thus moving parameters in a small increment \(\alpha\) in the opposite direction of the gradient will lead to a decrease in the cost function. This is expressed mathematically as:
$$
\theta' = \theta - \alpha \nabla_\theta J
$$
where \(\theta'\) is the updated parameters, \(\theta\) is the current parameters, and \(\alpha\) is the learning rate. Note that the learning rate \(\alpha\) is a hyperparameter that needs to be tuned. If \(\alpha\) is too small, the optimization will take a long time to converge. If \(\alpha\) is too large, the optimization may diverge and never converge. 

Note that there are many first order optimization algorithms that are used in practice such as Adam, RMSProp, and Adagrad in deep learning, but many of these methods have similar intuition to vanilla minibatch gradient descent. 







