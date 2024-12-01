/* MagicMirror²
 * Module: MMM-EmbedURL
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
Module.register("MMM-EmbedURL", {

	defaults: {
		basicElementType: "div", // this module uses a lot of wrappers and basic elements. This option decides about the basic element (div or span)
		embedElementType: "iframe", // the elements can either be embeded as iframe webview
		updateInterval: 60, // how often should the module be refreshed
		animationSpeed: 500, // use this animation speed if the dom objects of the module gets updated
		positions: "tie",
		attributes: [
			"frameborder=0"
		],
		imgDecodeCheckInterval: -1,
		updateDomOnResume: true
	},

	suspend() {
		const self = this
		self.resetTimer(-1, false)
	},

	resume() {
		const self = this
		self.resetTimer(self.config.updateInterval, self.config.updateDomOnResume)
	},

	getScripts() {
		return [this.file("node_modules/@iconify/iconify/dist/iconify.min.js")]
	},

	getStyles() {
		return ["font-awesome.css", "embedURL.css"]
	},

	/*
	** creates html objects based on a given string
	** see: https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
	*/
	htmlToElement(theString) {
		const template = document.createElement("template")
		theString = theString.trim() // Never return a text node of whitespace as the result
		template.innerHTML = theString
		return template.content.firstChild
	},

	getTitleElement(subConfig, additionalClasses) {
		const self = this
		if (subConfig != null) {
			const titleElement = document.createElement(self.config.basicElementType)
			if (Array.isArray(subConfig)) {
				titleElement.classList.add("titleWrapper")

				let idx = 0
				for (const curTitle of subConfig) {
					const curTitleElement = document.createElement(self.config.basicElementType)
					curTitleElement.appendChild(self.htmlToElement(String(curTitle)))
					curTitleElement.classList.add("title")
					curTitleElement.classList.add(`title${idx}`)
					additionalClasses.forEach(element => curTitleElement.classList.add(element))
					titleElement.appendChild(curTitleElement)
					idx += 1
				}
			} else {
				titleElement.classList.add("title")
				titleElement.appendChild(self.htmlToElement(String(subConfig)))
			}

			additionalClasses.forEach(element => titleElement.classList.add(element))

			return titleElement
		} else {
			return null
		}
	},

	getFontIconElement(subConfig, additionalClasses) {
		const self = this
		// Log.log("Trying to get font icon element")
		if (subConfig != null) {
			// Log.log("subConfig != null")
			let fontIconElement = null
			if (Array.isArray(subConfig)) {
				fontIconElement = document.createElement(self.config.basicElementType)
				fontIconElement.classList.add("iconWrapper")

				let idx = 0
				for (const curIcon of subConfig) {
					let curIconElement
					if (curIcon.startsWith("fa ")) {
						curIconElement = document.createElement("i")
						curIcon.split(" ").forEach(element => curIconElement.classList.add(element))
						curIconElement.setAttribute("aria-hidden", "true")
					} else {
						curIconElement = document.createElement("span")
						curIconElement.classList.add("iconify-inline")
						curIconElement.setAttribute("data-icon", curIcon)
					}
					curIconElement.classList.add("fontIcon")
					curIconElement.classList.add(`fontIcon${idx}`)
					additionalClasses.forEach(element => curIconElement.classList.add(element))
					fontIconElement.appendChild(curIconElement)
					idx += 1
				}
			} else {
				if (subConfig.startsWith("fa ")) {
					fontIconElement = document.createElement("i")
					subConfig.split(" ").forEach(element => fontIconElement.classList.add(element))
					fontIconElement.setAttribute("aria-hidden", "true")
				} else {
					fontIconElement = document.createElement("span")
					fontIconElement.classList.add("iconify-inline")
					fontIconElement.setAttribute("data-icon", subConfig)
				}
				fontIconElement.classList.add("fontIcon")
			}

			additionalClasses.forEach(element => fontIconElement.classList.add(element))

			return fontIconElement
		} else {
			return null
		}
	},

	getImgIconElement(subConfig, additionalClasses) {
		const self = this
		if (subConfig != null) {
			let imgIconElement = null
			if (Array.isArray(subConfig)) {
				imgIconElement = document.createElement(self.config.basicElementType)
				imgIconElement.classList.add("iconWrapper")

				let idx = 0
				for (const curIcon of subConfig) {
					const curIconElement = document.createElement("img")
					imgIconElement.setAttribute("src", curIcon)
					curIconElement.classList.add("imgIcon")
					curIconElement.classList.add(`imgIcon${idx}`)
					if (subConfig.endsWith(".svg")) {
						curIconElement.classList.add("svgIcon")
					}
					additionalClasses.forEach(element => curIconElement.classList.add(element))
					imgIconElement.appendChild(curIconElement)
					idx += 1
				}
			} else {
				imgIconElement = document.createElement("img")
				imgIconElement.setAttribute("src", subConfig)
				imgIconElement.classList.add("imgIcon")
				if (subConfig.endsWith(".svg")) {
					imgIconElement.classList.add("svgIcon")
				}
			}

			additionalClasses.forEach(element => imgIconElement.classList.add(element))

			return imgIconElement
		} else {
			return null
		}
	},

	getEmbedElement(subConfig, additionalClasses, attributes, embedElementType, appendTimestamp, imgDecodeCheckInterval) {
		const self = this
		if (subConfig != null) {
			const embedElement = document.createElement(embedElementType)
			if ((embedElementType === "img") && (imgDecodeCheckInterval > 0)) {
				self.imgs.push([embedElement, imgDecodeCheckInterval])
			}

			if ((typeof appendTimestamp !== "undefined") && appendTimestamp) {
				const url = new URL(subConfig)
				url.searchParams.append("timestamp", Math.floor(Date.now() / 1000))
				embedElement.setAttribute("src", url)
			} else {
				embedElement.setAttribute("src", subConfig)
			}

			if (attributes != null) {
				// Log.log(JSON.stringify(attributes))
				for (const curAttribute of attributes) {
					if (curAttribute.indexOf("=") > 0) {
						const attArray = curAttribute.split("=")
						const key = attArray[0]
						let value = ""
						if (typeof attArray[1] !== "undefined") {
							value = attArray[1]
						}
						embedElement.setAttribute(key.trim(), value.trim())
					} else {
						embedElement.setAttribute(curAttribute.trim(), "")
					}
				}
			}
			embedElement.classList.add("embeded")
			additionalClasses.forEach(element => embedElement.classList.add(element))

			return embedElement
		} else {
			return null
		}
	},

	getWrapperElement(subConfig, fallbackPositions, fallbackAttributes, fallbackEmbedElementType, fallbackAppendTimestamp, fallbackImgDecodeCheckInterval, depth = 0) {
		if (subConfig != null) {
			const self = this

			if ((subConfig.profiles || null) != null) {
				if (!subConfig.profiles.includes(self.currentProfile)) {
					return null
				}
			}

			const classes = []
			const subClasses = subConfig.classes || null

			if (subClasses != null) {
				subClasses.split(" ").forEach(curClass => classes.push(curClass))
			}

			let positions = subConfig.positions || null
			if (positions == null) {
				positions = fallbackPositions
			}

			let attributes = subConfig.attributes || null
			if (attributes == null) {
				attributes = fallbackAttributes
			}

			let embedElementType = subConfig.embedElementType || null
			if (embedElementType == null) {
				embedElementType = fallbackEmbedElementType
			}

			let appendTimestamp
			if (typeof subConfig.appendTimestamp !== "undefined") {
				appendTimestamp = subConfig.appendTimestamp
			} else {
				appendTimestamp = fallbackAppendTimestamp
			}

			let imgDecodeCheckInterval
			if (typeof subConfig.imgDecodeCheckInterval !== "undefined") {
				imgDecodeCheckInterval = subConfig.imgDecodeCheckInterval * 1000
			} else {
				imgDecodeCheckInterval = fallbackImgDecodeCheckInterval
			}

			const wrapper = document.createElement(self.config.basicElementType)
			wrapper.classList.add("embededWrapper")
			wrapper.classList.add(`embededWrapper${depth}`)
			classes.forEach(element => wrapper.classList.add(element))

			const titleElement = self.getTitleElement(subConfig.title || null, classes)

			const fontIconElement = self.getFontIconElement(subConfig.fontIcon || null, classes)

			const imgIconElement = self.getImgIconElement(subConfig.imgIcon || null, classes)

			const embedConfig = subConfig.embed || null
			let embedElement = null
			if (embedConfig != null) {
				if (Array.isArray(embedConfig)) {
					embedElement = document.createElement(self.config.basicElementType)
					embedElement.classList.add("embededSubWrapper")
					embedElement.classList.add(`embededSubWrapper${depth}`)
					classes.forEach(element => embedElement.classList.add(element))

					for (let idx = 0; idx < embedConfig.length; idx++) {
						const curEmbed = embedConfig[idx]
						let curEmbedElement = null
						if (typeof curEmbed === "string") {
							curEmbedElement = self.getEmbedElement(curEmbed, classes, attributes, embedElementType, appendTimestamp, imgDecodeCheckInterval)
						} else {
							curEmbedElement = self.getWrapperElement(curEmbed || null, positions, attributes, embedElementType, appendTimestamp, imgDecodeCheckInterval, depth + 1)
						}
						if (curEmbedElement != null) {
							embedElement.appendChild(curEmbedElement)
						}
					}
				} else {
					embedElement = self.getEmbedElement(embedConfig, classes, attributes, embedElementType, appendTimestamp, imgDecodeCheckInterval)
				}
			}

			let atLeastOneAdded = false
			const curWrapper = wrapper
			let iconElement = fontIconElement
			if (imgIconElement !== null) {
				iconElement = imgIconElement
			}

			for (const posChar of positions) {
				if (posChar === "t") {
					if (titleElement != null) {
						atLeastOneAdded = true
						curWrapper.appendChild(titleElement)
					}
				} else if (posChar === "i") {
					if (iconElement != null) {
						atLeastOneAdded = true
						curWrapper.appendChild(iconElement)
					}
				} else if (posChar === "e") {
					if (embedElement != null) {
						atLeastOneAdded = true
						curWrapper.appendChild(embedElement)
					}
				} else {
					Log.log("UNKNOWN CHARACTER")
				}
			}

			if (atLeastOneAdded) {
				return wrapper
			} else {
				return null
			}
		} else {
			return null
		}
	},

	getDom() {
		const self = this
		console.log(self.name+": UPDATE DOM")

		for (let imgIdx = 0; imgIdx < self.imgsTimeouts.length; imgIdx++) {
			clearTimeout(self.imgsTimeouts[imgIdx])
		}

		self.imgsTimeouts = []
		self.imgs = []

		let wrapper = self.getWrapperElement(self.config, self.config.positions, self.config.attributes, self.config.embedElementType, self.config.imgDecodeCheckInterval * 1000, 0)

		if (wrapper == null) {
			wrapper = document.createElement(self.config.basicElementType)
		}

		wrapper.classList.add("embed")
		wrapper.classList.add("rootWrapper")

		for (let imgIdx = 0; imgIdx < self.imgs.length; imgIdx++) {
			self.checkImgSrc(imgIdx)
		}

		return wrapper
	},

	async checkImgSrc(imgIdx) {
		const self = this
		const imgElement = self.imgs[imgIdx][0]
		try {
			await imgElement.decode()
		} catch {
			Log.log(`Image with idx: ${imgIdx} has an undecodeable URL. Refreshing it!`)
			const src = imgElement.src
			imgElement.src = ""
			imgElement.src = src
		}

		self.imgsTimeouts[imgIdx] = setTimeout(() => {
			self.checkImgSrc(imgIdx)
		}, self.imgs[imgIdx][1])
	},

	start() {
		const self = this
		self.currentProfile = null

		self.imgs = []
		self.imgsTimeouts = []

		const curClasses = []
		const classConfig = self.config.classes || null

		if (classConfig !== null) {
			classConfig.split(" ").forEach(curClass => curClasses.push(curClass))
		}

		self.classes = curClasses

		self.sendSocketNotification("CONFIG", self.config)

		self.resetTimer(self.config.updateInterval, true)
	},

	resetTimer(interval, updateDom) {
		const self = this
		if (self.refreshTimer) {
			clearTimeout(self.refreshTimer)
			self.refreshTimer = null
		}

		if (interval > 0) {
			self.refreshTimer = setTimeout(() => {
				self.resetTimer(interval, true)
			}, interval * 1000)

			if ((!self.hidden) && updateDom) {
				self.updateDom(self.config.animationSpeed)
			}
		}
	},

	notificationReceived(notification, payload) {
		const self = this
		if (notification === "CHANGED_PROFILE") {
			self.currentProfile = payload.to
		}
	}
})
