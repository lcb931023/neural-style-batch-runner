**Variables**
* `-content_weight`: How much to weight the content reconstruction term. Default is 5e0.
* `-style_weight`: How much to weight the style reconstruction term. Default is 1e2.
* `-tv_weight`: Weight of total-variation (TV) regularization; this helps to smooth the image.
Default is 1e-3. Set to 0 to disable TV regularization.
* `-learning_rate`: Learning rate to use with the ADAM optimizer. Default is 1e1.
* `-style_scale`: Scale at which to extract features from the style image. Default is 1.0.

**Flags**
* `-normalize_gradients`: If this flag is present, style and content gradients from each layer will be
  L1 normalized. Idea from [andersbll/neural_artistic_style](https://github.com/andersbll/neural_artistic_style).
* `-original_colors`: If you set this to 1, then the output image will keep the colors of the content image.


**Choices**
* `-init`: Method for generating the generated image; one of `random` or `image`.
Default is `random` which uses a noise initialization as in the paper; `image`
initializes with the content image.
* `-optimizer`: The optimization algorithm to use; either `lbfgs` or `adam`; default is `lbfgs`.
L-BFGS tends to give better results, but uses more memory. Switching to ADAM will reduce memory usage;
when using ADAM you will probably need to play with other parameters to get good results, especially
the style weight, content weight, and learning rate; you may also want to normalize gradients when
using ADAM.




**Const**
* `-gpu`: Zero-indexed ID of the GPU to use; for CPU mode set `-gpu` to -1.
* `-pooling`: The type of pooling layers to use; one of `max` or `avg`. Default is `max`.
The VGG-19 models uses max pooling layers, but the paper mentions that replacing these layers with average
pooling layers can improve the results. I haven't been able to get good results using average pooling, but
the option is here.
* `-proto_file`: Path to the `deploy.txt` file for the VGG Caffe model.
* `-model_file`: Path to the `.caffemodel` file for the VGG Caffe model.
Default is the original VGG-19 model; you can also try the normalized VGG-19 model used in the paper.
* `-output_image`: Name of the output image. Default is `out.png`.
* `-print_iter`: Print progress every `print_iter` iterations. Set to 0 to disable printing.
* `-backend`: `nn`, `cudnn`, or `clnn`. Default is `nn`. `cudnn` requires
[cudnn.torch](https://github.com/soumith/cudnn.torch) and may reduce memory usage.
`clnn` requires [cltorch](https://github.com/hughperkins/cltorch) and [clnn](https://github.com/hughperkins/clnn)
* `-cudnn_autotune`: When using the cuDNN backend, pass this flag to use the built-in cuDNN autotuner to select
the best convolution algorithms for your architecture. This will make the first iteration a bit slower and can
take a bit more memory, but may significantly speed up the cuDNN backend.

**Other**
* `-image_size`: Maximum side length (in pixels) of of the generated image. Default is 512.
* `-num_iterations`: Default is 1000.
* `-style_blend_weights`: The weight for blending the style of multiple style images, as a
comma-separated list, such as `-style_blend_weights 3,7`. By default all style images
are equally weighted.
* `-content_layers`: Comma-separated list of layer names to use for content reconstruction.
Default is `relu4_2`.
* `-style_layers`: Comman-separated list of layer names to use for style reconstruction.
Default is `relu1_1,relu2_1,relu3_1,relu4_1,relu5_1`.
* `-save_iter`: Save the image every `save_iter` iterations. Set to 0 to disable saving intermediate results.
