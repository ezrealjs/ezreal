## About the code implementation
I want its first middleware or preset implementation to be relatively complete, so that it is easy to see the overview. the middleware for each subsequent feature implementation is single and small, and can be easily uninstalled and added.

When a preset is assembled, it can be easily shared with other teams via npm packages, and teams with customization needs can continue to extend it into their own presets.

## What problems are solved
Nowadays, many excellent packages are facing this problem, with more and more features, each new optional feature requires multiple webpack configuration changes, and the code has to add if elese conditional judgments, the complexity of the code will grow exponentially. And when a feature is deprecated, you forget which files to restore

Mainly solve the following scenarios 👇

1. The configuration itself is very complex, and there are always iterations
Many platforms such as react, vue, pc, mobile, electron, ssr ...
2. Different teams will add different features
3. As an cli tool, How can we better manage these configurations, ability to easily and painlessly add and uninstall features