
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
	init: function(...args) {

		// Check for settings by the user
		if (args[0].hasOwnProperty('aspectRatio')) {
			this.aspectRatio = args[0].aspectRatio;
		}
		if (args[0].hasOwnProperty('controls')) {
			this.controls = args[0].controls;
		}
		if (args[0].hasOwnProperty('clickToPlay')) {
			this.clickToPlay = args[0].clickToPlay;
		}
		if (args[0].hasOwnProperty('autoPlay')) {
			this.autoPlay = args[0].autoPlay;
		}
		if (args[0].hasOwnProperty('muted')) {
			this.muted = args[0].muted;
		}
		if (args[0].hasOwnProperty('volume')) {
			this.volume = args[0].volume;
		}
		if (args[0].hasOwnProperty('fullScreenButton')) {
			this.fullScreenButton = args[0].fullScreenButton;
		}
		if (args[0].hasOwnProperty('pipButton')) {
			this.pipButton = args[0].pipButton;
		}
		if (args[0].hasOwnProperty('speedButton')) {
			this.speedButton = args[0].speedButton;
		}

		// Get all video players
		const grtVideoPlayers = document.querySelectorAll("[grtvideoplayer-url]");

		if (grtVideoPlayers.length > 0) {
		
			grtVideoPlayers.forEach(function (element) {

				let touchClickEvent = 'ontouchstart' in window ? 'touchstart' : 'click';

				let mutedStatus = grtVideoPlayer.muted ? 'muted' : '';
				let autoPlayStatus = grtVideoPlayer.autoPlay ? 'autoplay' : '';
				let grtVideoURL = element.getAttribute('grtvideoplayer-url');
				let videoEmbed = `<div class="grt-video-player-container grt-video-player-${grtVideoPlayer.aspectRatio} grt-video-player-active"><video class="grt-video-player" preload="auto" playsinline ${autoPlayStatus} ${mutedStatus}><source src="${grtVideoURL}" type="video/mp4"></video>`;
				if (grtVideoPlayer.controls) {
					videoEmbed +=`<div class="grt-video-player-controls-overlay">
									<div class="grt-video-player-progress-seekbar">
										<span></span>
									</div>
									<div class="grt-video-player-controls">
										<div class="grt-video-player-play-button">
											<span></span>
										</div><div class="grt-video-player-volume-row">
										<input type="range" class="grt-video-player-volume" min="0" max="1" step="0.05" value="${grtVideoPlayer.volume / 100}" style="background-size: ${grtVideoPlayer.volume}% 100%;">
									</div><div class="grt-video-player-right-col">`;
					if (grtVideoPlayer.speedButton) {
						videoEmbed +=`<div class="grt-video-player-speed">
											<small>Speed</small>
											<div class="grt-video-player-speed-menu">
												<span grt-play-speed="0.5">x 0.5</span>
												<span grt-play-speed="1">x 1</span>
												<span grt-play-speed="1.5">x 1.5</span>
												<span grt-play-speed="2">x 2</span>
											</div>
										</div>`;
					}
					if (grtVideoPlayer.pipButton) {
						videoEmbed +=` <div class="grt-video-player-pip"><span class="grt-video-player-pip-icon"></span></div>`;
					}
					if (grtVideoPlayer.fullScreenButton) {
						videoEmbed +=`<div class="grt-video-player-full-screen"><span class="grt-video-player-full-screen-icon"></span></div>`;
					}
					videoEmbed +=`</div></div></div>`;
				}
				videoEmbed +=`</div>`;

				element.innerHTML = videoEmbed;

				const thisVideoPlayer = element.querySelector('.grt-video-player');
				const grtVideoPlayerContainer =  thisVideoPlayer.parentNode;

				// Toggle Play
				function grtVideoTogglePlay() {
					if (thisVideoPlayer.paused || thisVideoPlayer.ended) {
						thisVideoPlayer.play();
						grtVideoPlayerContainer.classList.add("grt-video-player-active");
						return;
					}
					thisVideoPlayer.pause();
					grtVideoPlayerContainer.classList.remove("grt-video-player-active");
				}
		
				// Click On the whole Video to Play
				if (grtVideoPlayer.clickToPlay) {
					thisVideoPlayer.addEventListener(touchClickEvent, grtVideoTogglePlay);
				}
				
				// If controls are enabled
				if (grtVideoPlayer.controls) {
					const grtVideoPlayerPlayButton = thisVideoPlayer.parentNode.querySelector('.grt-video-player-play-button');
					const grtVideoPlayerVolume = thisVideoPlayer.parentNode.querySelector('.grt-video-player-volume');
					const grtVideoPlayerProgressBar = thisVideoPlayer.parentNode.querySelector(".grt-video-player-progress-seekbar span");
					const grtVideoPlayerProgressBarContainer = thisVideoPlayer.parentNode.querySelector(".grt-video-player-progress-seekbar");
					const grtVideoPlayerSpeed = thisVideoPlayer.parentNode.querySelector(".grt-video-player-speed small");
					const grtVideoPlayerSpeedElement = thisVideoPlayer.parentNode.querySelectorAll(".grt-video-player-speed span");
					const grtVideoPlayerSpeedMenu = thisVideoPlayer.parentNode.querySelector(".grt-video-player-speed-menu");

					// Click On Play Button
					grtVideoPlayerPlayButton.addEventListener(touchClickEvent, grtVideoTogglePlay);					
			
					// Update PlayerProgress
					thisVideoPlayer.addEventListener('timeupdate', grtVideoPlayerUpdateProgress);
					function grtVideoPlayerUpdateProgress() {
						if (thisVideoPlayer.currentTime > 0) {
							let grtVideoPlayerPercentage = ( thisVideoPlayer.currentTime / thisVideoPlayer.duration ) * 100;
							grtVideoPlayerProgressBar.style.width = grtVideoPlayerPercentage+"%";
						}
					}
					
					// Show or Hide Controls on MouseMove
					grtVideoPlayerContainer.onmousemove = function() {
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
			
					// Change Volume
					document.addEventListener("DOMContentLoaded", function() {
						grtVideoPlayerVolume.addEventListener('input', grtVideoPlayerChangeVol);
						grtVideoPlayerChangeVol();
					});
			
					function grtVideoPlayerChangeVol() {
						thisVideoPlayer.volume = grtVideoPlayerVolume.value;
						let volmin = grtVideoPlayerVolume.min;
						let volmax = grtVideoPlayerVolume.max;
						thisVideoPlayer.volume = grtVideoPlayerVolume.value;
						grtVideoPlayerVolume.style.backgroundSize = (thisVideoPlayer.volume - volmin) * 100 / (volmax - volmin) + '% 100%';
					}
			
					// ProgressBar
					grtVideoPlayerProgressBarContainer.addEventListener('click', grtVideoPlayerProgressBarClick);
					function grtVideoPlayerProgressBarClick(e) {
						let grtVideoPlayerPositionClicked = e.offsetX / grtVideoPlayerProgressBarContainer.offsetWidth;
						let grtVideoPlayerPercantageBar = (grtVideoPlayerPositionClicked * 100).toFixed(3);
						thisVideoPlayer.currentTime = thisVideoPlayer.duration * grtVideoPlayerPositionClicked;
						grtVideoPlayerProgressBar.style.width = grtVideoPlayerPercantageBar+'%';
					}

					// FullScreen
					if (grtVideoPlayer.fullScreenButton) {
						const grtVideoPlayerFullScreenIcon = thisVideoPlayer.parentNode.querySelector(".grt-video-player-full-screen-icon");
						grtVideoPlayerFullScreenIcon.addEventListener('click', grtOpenFullscreen);
				
						function grtOpenFullscreen() {
							// thisVideoPlayer.hasAttribute('playsinline') ? thisVideoPlayer.removeAttribute('playsinline') : thisVideoPlayer.setAttribute('playsinline', '');
							// if (window.matchMedia("(max-width: 767px)").matches) {
							// 	thisVideoPlayer.removeAttribute('playsinline');
							// } else {
							// 	thisVideoPlayer.addAttribute('playsinline');
							// }
							if (thisVideoPlayer.requestFullscreen) {
								thisVideoPlayer.requestFullscreen();
							} else if (thisVideoPlayer.webkitRequestFullscreen) { /* Safari */
								thisVideoPlayer.webkitRequestFullscreen();
							} else if (thisVideoPlayer.msRequestFullscreen) { /* IE11 */
								thisVideoPlayer.msRequestFullscreen();
							} else if (thisVideoPlayer.webkitEnterFullscreen) {
								thisVideoPlayer.webkitEnterFullscreen();
							}
						}
					}
					
					// PIP (Picture in Picture)
					if (grtVideoPlayer.pipButton) {
						const grtVideoPlayerPIPIcon = thisVideoPlayer.parentNode.querySelector(".grt-video-player-pip-icon");
						grtVideoPlayerPIPIcon.addEventListener('click', grtVideoPlayerPIP);
						function grtVideoPlayerPIP() {
							if (document.pictureInPictureElement) {
								document.exitPictureInPicture();
							} else {
								thisVideoPlayer.requestPictureInPicture().then((pictureInPictureWindow) => {
									pictureInPictureWindow.addEventListener("resize", () => onPipWindowResize(), false);
								});
							}
						}
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
						grtVideoPlayerSpeed.addEventListener('click', grtVideoPlayerSpeedMenuClick); 
						function grtVideoPlayerSpeedMenuClick() {
							grtVideoPlayerSpeedMenu.classList.toggle("active");
						}
					}

					
			
					
			
					
				}

		
				// Make Keyboard Space Button for play or pause
				document.addEventListener('keydown', function(e) {
					if (e.code === 'Space') {
						e.preventDefault();
						grtVideoTogglePlay();
					}
				});
		
				// Disable right click on video
				thisVideoPlayer.addEventListener("contextmenu", (e) => { e.preventDefault(); });
		
			});
		}
	}
  };




