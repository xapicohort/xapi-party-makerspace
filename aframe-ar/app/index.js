const app = {
	init() {
		// this.userAuth = true;
		xapi.init();
		this.markerInitialized = false;

		this.authenticate(() => {
			this.bindEvents();
		});

		// app.logEventNo = 0;
		this.logEl = document.querySelector(".log");

	},

	authenticate(cb) {
		if (app.userAuth) {
			cb();
		} else {
			// login

			// show popup

			// once email is submitted,
			// create TinCan Agent for later use

			// then send a "launched" statement?

		}
	},

	bindEvents() {
		window.addEventListener("camera-init", data => {
			this.logMsg("camera-init", data);
		});

		window.addEventListener("camera-error", error => {
			this.logMsg("camera-error", error);
		});

	},

	logMsg(text, data) {
		// app.logEventNo += 1;
		const display = text + (JSON.stringify(data) || '');
		// this.logEl.innerText = display;
		console.log(display);
	},

	aframe: {
		init() {
			this.registerComponents();
		},

		registerComponents() {
			for (const comp in this.components) {
				AFRAME.registerComponent(comp, this.components[comp]);
			}
		},

		components: {
			// markerhandler: {
			// 	init() {
			// 		console.log('init markerhandler');
			// 		const marker = document.querySelector("#marker");
			// 		const aEntity = document.querySelector("#model");

			// 		// every click, we make our model grow in size :)
			// 		marker.addEventListener("click", (ev) => {
			// 			if (!app.markerInitialized) {
			// 				return;
			// 			}

			// 			const intersectedElement = ev && ev.detail && ev.detail.intersectedEl;

			// 			// console.log('click:', ev.detail);

			// 			if (aEntity && intersectedElement === aEntity) {
			// 				// app.logMsg('click');
			// 				console.log('ev:', ev);
			// 				console.log('aEntity.object3D.visible:', aEntity.object3D.visible);
			// 				// const scale = aEntity.getAttribute("scale");
			// 				// Object.keys(scale).forEach(key => (scale[key] = scale[key] + 1));
			// 				// aEntity.setAttribute("scale", scale);
			// 			}
			// 		});
			// 	}
			// },

			eventhandler: {
				init() {
					console.log('init eventhandler');

					const marker = this.el;

					marker.addEventListener("markerFound", (e) => {
						app.markerInitialized = true;
						const markerId = marker.id;
						app.logMsg("markerFound: ", markerId);

						xapi.statement.send('located', marker.id);

					});

					marker.addEventListener("markerLost", (e) => {
						app.markerInitialized = false;
						const markerId = marker.id;
						app.logMsg("markerLost: ", markerId);
					});
				}
			},
		}
	}
};

app.aframe.init();

document.addEventListener("DOMContentLoaded", function () {
	app.init();
});
