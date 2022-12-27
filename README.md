# grt-js-video-player
GRT JS Video Player - LightWeight Free Javascript Video Player

Simple and lightweight JavaScript HTML5 video player used for playing different video formats.<br/><br/>
This player supports all the basic modern features. You can change aspect ratio, autoplay, full screen, PIP (picture in picture), volume, controls visibility, and much more. Please read the integration below for all the available options.

You can check the demo here: [grt107.github.io/grt-cookie-consent/](http://grt107.github.io/grt-cookie-consent/)

# Screenshot:
![Alt text](/screenshot.png?raw=true "Demo Screenshot")

# How to use the plugin in your website:
1- Include the player stylesheet file ```grt-js-video-player.css``` inside the ```<head>``` tag.

  ```html
  <link rel="stylesheet" href="grt-js-video-player.css">
  ```

2- Include the javascript file ```grt-js-video-player.js``` before the closing ```<body>``` tag.

  ```html
  <script src="grt-cookie-consent.js"></script>
  ```

3- Add the following div inside your document  ```body``` and change the ```video url``` on the ```grtvideoplayer-url``` attribute.

  ```html
	<div grtvideoplayer-url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"></div>
  ```


# Advanced Options
	**Aspect Ratio**
You can change video aspect ratio. It accepts values: 16x9, 1x1 , 4x3, 5x4, 3x2, 21x9, 9x16, 3x4, 4x5, 2x3. Default is set to 16x9.

  ```html
	<script> 
grtVideoPlayer.init({ 
	aspectRatio: "4x3", 
});
</script>
  ```
