import DATA from "./mbcpie.json";

// Full-screen "cover" video scrubbed by the horizontal pointer position
// (mouse on desktop, finger on mobile), eelslap style.
export default class MbcPie {
	static init(config = {}) {
		return new MbcPie(config);
	}

	constructor({ parent, video = DATA.config.video, onReady } = {}) {
		this.parent = (typeof parent === "string" ? document.getElementById(parent) : parent) || document.body;
		this.target = 0;
		this.seeking = false;

		const v = document.createElement("video");
		v.muted = true;
		v.defaultMuted = true;
		v.playsInline = true;
		v.preload = "auto";
		v.disablePictureInPicture = true;
		v.setAttribute("muted", "");
		v.setAttribute("playsinline", "");
		v.setAttribute("webkit-playsinline", "");
		this.video = v;
		this.onReady = onReady;
		this.ready = false;
		this.parent.appendChild(v);

		// iOS Safari may not fire every event, so any of them marks the video as ready.
		for (const type of ["loadedmetadata", "loadeddata", "canplay"]) {
			v.addEventListener(type, () => this.markReady());
		}
		v.addEventListener("seeked", () => {
			this.seeking = false;
			this.pump();
		});
		v.src = new URL(video, window.location).href;
		v.load();

		// Touch events are used explicitly (iOS), pointer events for the mouse.
		const touch = e => {
			e.preventDefault();
			const t = e.touches[0] || e.changedTouches[0];
			if (t) this.setTarget(t.clientX);
			if (e.type === "touchmove") document.body.classList.add("swiped");
		};
		window.addEventListener("touchstart", touch, { passive: false });
		window.addEventListener("touchmove", touch, { passive: false });
		window.addEventListener("mousemove", e => this.setTarget(e.clientX), { passive: true });

		// iOS only decodes frames once playback has been started by a user gesture.
		// Skipped elsewhere: play() would visibly run a few frames (glitch on Android).
		const ios = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
		const unlock = () => {
			v.play().then(() => { v.pause(); this.seeking = false; this.pump(); }).catch(() => {});
			this.markReady();
			for (const type of ["touchstart", "touchend", "mousedown"]) window.removeEventListener(type, unlock);
		};
		if (ios) for (const type of ["touchstart", "touchend", "mousedown"]) window.addEventListener(type, unlock);

		// Seek watchdog: never stay stuck if "seeked" is not delivered.
		setInterval(() => {
			if (this.seeking && performance.now() - this.seekStart > 500) this.seeking = false;
			this.pump();
		}, 100);
	}

	markReady() {
		const v = this.video;
		if (this.ready || !v.duration) return;
		this.ready = true;
		v.pause();
		// Start on the first frame; a tiny offset forces iOS to actually paint it.
		this.seeking = true;
		this.seekStart = performance.now();
		v.currentTime = 0.001;
		if (this.lastX !== undefined) this.setTarget(this.lastX);
		if (this.onReady) this.onReady(this);
	}

	// Left edge = start of the video, right edge = end.
	setTarget(x) {
		this.lastX = x;
		const v = this.video;
		if (!v.duration) return;
		this.target = Math.min(1, Math.max(0, x / window.innerWidth)) * v.duration;
		this.pump();
	}

	// One seek at a time: a new one is issued only after the previous finished.
	pump() {
		const v = this.video;
		if (this.seeking || !v.duration) return;
		if (Math.abs(v.currentTime - this.target) < 0.001) return;
		this.seeking = true;
		this.seekStart = performance.now();
		v.currentTime = this.target;
	}
}
