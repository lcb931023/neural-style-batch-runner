Neural Style Batch Runner
========

An interface to run a batch of neural style transfers at once.

Current Goal: Be able to run with the same content and style images, but varying combinations of parameters.

- [ ] Calculate and show number of tasks based on parameter combination
  - These would scale, so be careful...
  - is it possible to calculate an estimate of how long they'll take?
- [ ] Option to cancel the batch
- [ ] Visualize results in a 2D table, where the X and Y can be set to different parameters
- [ ] Log how long each tasks ran for, and how long the total took
