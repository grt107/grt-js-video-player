const grtVideoPlayer = {
	aspectRatio: "16/9",
	controls: true,
	clickToPlay: true,
	autoPlay: false,
	muted: false,
	volume: 80,
	fullScreenButton: true,
	pipButton: true,
	speedButton: true,
	init: function (...args) {
		 const settings = args[0];
		 for (const prop in settings) {
			  if (this.hasOwnProperty(prop)) {
					this[prop] = settings[prop];
			  }
		 }

		 const grtVideoPlayers = document.querySelectorAll("[grtvideoplayer-url]");
		 const touchClickEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

		 grtVideoPlayers.forEach(function (element) {
			  const [thisVideoPlayer, grtVideoPlayerContainer] = [
					element.querySelector('.grt-video-player'),
					element.querySelector('.grt-video-player-container')
			  ];

			  function grtVideoTogglePlay() {
					const isPausedOrEnded = thisVideoPlayer.paused || thisVideoPlayer.ended;
					isPausedOrEnded ? thisVideoPlayer.play() : thisVideoPlayer.pause();
					grtVideoPlayerContainer.classList.toggle("grt-video-player-active", !isPausedOrEnded);
			  }

			  [thisVideoPlayer, grtVideoPlayerContainer].forEach((el) => {
					el.addEventListener(touchClickEvent, grtVideoTogglePlay);
					el.addEventListener('contextmenu', (e) => e.preventDefault());
			  });

			  if (grtVideoPlayer.controls) {
					// Control related code

					grtVideoPlayerContainer.onmousemove = function () {
						 clearTimeout(timerMouseMove);
						 timerMouseMove = setTimeout(timeoutMouseMove, 3000);
						 grtVideoPlayerContainer.classList.add("grt-video-player-controls-visible");
					};

					let timerMouseMove;

					function timeoutMouseMove() {
						 grtVideoPlayers.forEach(function (element) {
							  element.parentNode.classList.remove("grt-video-player-controls-visible");
						 });
					}

					timerMouseMove = setTimeout(timeoutMouseMove, 3000);

					grtVideoPlayerVolume.addEventListener('input', grtVideoPlayerChangeVol);
					grtVideoPlayerChangeVol();

					function grtVideoPlayerChangeVol() {
						 thisVideoPlayer.volume = grtVideoPlayerVolume.value;
						 const volmin = grtVideoPlayerVolume.min;
						 const volmax = grtVideoPlayerVolume.max;
						 grtVideoPlayerVolume.style.backgroundSize =
							  ((thisVideoPlayer.volume - volmin) * 100) / (volmax - volmin) + '% 100%';
					}

					grtVideoPlayerProgressBarContainer.addEventListener('click', grtVideoPlayerProgressBarClick);

					function grtVideoPlayerProgressBarClick(e) {
						 const grtVideoPlayerPositionClicked = e.offsetX / grtVideoPlayerProgressBarContainer.offsetWidth;
						 const grtVideoPlayerPercantageBar = (grtVideoPlayerPositionClicked * 100).toFixed(3);
						 thisVideoPlayer.currentTime = thisVideoPlayer.duration * grtVideoPlayerPositionClicked;
						 grtVideoPlayerProgressBar.style.width = grtVideoPlayerPercantageBar + '%';
					}

					// FullScreen
					if (grtVideoPlayer.fullScreenButton) {
						 const grtVideoPlayerFullScreenIcon = thisVideoPlayer.parentNode.querySelector(
							  ".grt-video-player-full-screen-icon"
						 );

						 grtVideoPlayerFullScreenIcon.addEventListener('click', () => {
							  const requestFullscreenMethods = [
									thisVideoPlayer.requestFullscreen,
									thisVideoPlayer.webkitRequestFullscreen,
									thisVideoPlayer.mozRequestFullScreen,
									thisVideoPlayer.msRequestFullscreen,
									thisVideoPlayer.webkitEnterFullscreen
							  ];
							  const requestFullscreenMethod = requestFullscreenMethods.find((method) => !!method);

							  if (requestFullscreenMethod) {
									requestFullscreenMethod.call(thisVideoPlayer);
							  }
						 });
					}

					// PIP (Picture in Picture)
					if (grtVideoPlayer.pipButton) {
						 const grtVideoPlayerPIPIcon = thisVideoPlayer.parentNode.querySelector(".grt-video-player-pip-icon");

						 grtVideoPlayerPIPIcon.addEventListener('click', () => {
							  if (document.pictureInPictureElement) {
									document.exitPictureInPicture();
							  } else {
									thisVideoPlayer.requestPictureInPicture().then((pictureInPictureWindow) => {
										 pictureInPictureWindow.addEventListener("resize", () => onPipWindowResize(), false);
									});
							  }
						 });
					}

					// Speed Button
					if (grtVideoPlayer.speedButton) {
						 grtVideoPlayerSpeedElement.forEach(function (speedbutton) {
							  speedbutton.addEventListener('click', grtVideoPlayerSetSpeed);
						 });

						 function grtVideoPlayerSetSpeed(e) {
							  thisVideoPlayer.play();
							  grtVideoPlayerContainer.classList.add("grt-video-player-active");
							  thisVideoPlayer.playbackRate = e.target.getAttribute('grt-play-speed');
							  grtVideoPlayerSpeedMenu.classList.remove("active");
						 }

						 grtVideoPlayerSpeed.addEventListener('click', () =>
							  grtVideoPlayerSpeedMenu.classList.toggle("active")
						 );
					}
			  }

			  // Make Keyboard Space Button for play or pause
			  document.addEventListener('keydown', function (e) {
					if (e.code === 'Space') {
						 e.preventDefault();
						 grtVideoTogglePlay();
					}
			  });
		 });
	}
};
