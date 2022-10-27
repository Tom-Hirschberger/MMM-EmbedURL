/* global Module

/* Magic Mirror²
 * Module: EmbedURL
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
Module.register('MMM-EmbedURL', {

	defaults: {
		basicElementType: "span", //this module uses a lot of wrappers and basic elements. This option decides about the basic element (div or span)
		embedElementType: "iframe", //the elements can either be embeded as iframe webview
		updateInterval: 60, //how often should the module be refreshed
		animationSpeed: 500, //use this animation speed if the dom objects of the module gets updated
		positions: "tie",
		attributes: [
			"frameborder=0"
		]
	},

	suspend: function () {
		const self = this
	},

	resume: function () {
		const self = this
		self.updateDom(self.config.animationSpeed)
	},


	/*getScripts: function () {
		return [this.file('node_modules/jsonpath-plus/dist/index-browser-umd.js')];
	},*/


	getStyles: function () {
		return ['font-awesome.css', 'embedURL.css']
	},

	/*
	** creates html objects based on a given string
	** see: https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
	*/
	htmlToElement: function (theString) {
		let template = document.createElement('template');
		theString = theString.trim(); // Never return a text node of whitespace as the result
		template.innerHTML = theString;
		return template.content.firstChild;
	},

	getTitleElement: function(subConfig, additionalClasses){
		const self = this
		if(subConfig != null){
			let titleElement = document.createElement(self.config["basicElementType"])
			if(Array.isArray(subConfig)){
				titleElement.classList.add("titleWrapper")

				let idx = 0
				for (let curTitle of subConfig) {
					let curTitleElement = document.createElement(self.config["basicElementType"])
					curTitleElement.appendChild(self.htmlToElement(String(curTitle)))
					curTitleElement.classList.add("title")
					curTitleElement.classList.add("title" + idx)
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

	getFontIconElement: function(subConfig, additionalClasses){
		const self = this
		if(subConfig != null){
			let fontIconElement = null
			if(Array.isArray(subConfig)){
				fontIconElement = document.createElement(self.config["basicElementType"])
				fontIconElement.classList.add("iconWrapper")

				let idx = 0
				for (let curIcon of subConfig) {
					let curIconElement = document.createElement("i")
					curIcon.split(" ").forEach(element => curIconElement.classList.add(element))
					curIconElement.classList.add("fontIcon")
					curIconElement.classList.add("fontIcon" + idx)
					additionalClasses.forEach(element => curIconElement.classList.add(element))
					fontIconElement.appendChild(curIconElement)
					idx += 1
				}
			} else {
				fontIconElement = document.createElement("i")
				subConfig.split(" ").forEach(element => fontIconElement.classList.add(element))
				fontIconElement.classList.add("fontIcon")
			}

			additionalClasses.forEach(element => fontIconElement.classList.add(element))

			return fontIconElement
		} else {
			return null
		}
	},

	getImgIconElement: function(subConfig, additionalClasses){
		const self = this
		if(subConfig != null){
			let imgIconElement = null
			if(Array.isArray(subConfig)){
				imgIconElement = document.createElement(self.config["basicElementType"])
				imgIconElement.classList.add("iconWrapper")

				let idx = 0
				for (let curIcon of subConfig) {
					let curIconElement = document.createElement("img")
					imgIconElement.setAttribute("src", curIcon)
					curIconElement.classList.add("imgIcon")
					curIconElement.classList.add("imgIcon" + idx)
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

	getEmbedElement: function(subConfig, additionalClasses, attributes){
		const self = this
		if(subConfig != null){
			embedElement = document.createElement(self.config["embedElementType"])
			embedElement.setAttribute("src", subConfig)
			if(attributes != null){
				console.log(JSON.stringify(attributes))
				for(let curAttribute of attributes){
					let attArray = curAttribute.split("=")
					let key = attArray[0].replaceAll(" ")
					let value = attArray[1] || ""

					embedElement.setAttribute(key, value)
				}
			}
			embedElement.classList.add("embeded")
			additionalClasses.forEach(element => embedElement.classList.add(element))

			return embedElement
		} else {
			return null
		}
	},

	getWrapperElement: function(subConfig, fallbackPositions, fallbackAttributes, depth=0){
		if (subConfig != null){
			const self = this

			if ((subConfig["profiles"] || null) != null) {
				if (!subConfig["profiles"].includes(self.currentProfile)) {
					return null
				}
			}

			let classes = []
			let subClasses = subConfig["classes"] || null

			if(subClasses != null){
				subClasses.split(" ").forEach(curClass => classes.push(curClass))
			}

			let positions = subConfig["positions"] || null
			if(positions == null){
				positions = fallbackPositions
			}

			let attributes = subConfig["attributes"] || null
			if (attributes == null){
				attributes = fallbackAttributes
			}

			let wrapper = document.createElement(self.config["basicElementType"])
			wrapper.classList.add("embededWrapper")
			wrapper.classList.add("embededWrapper"+depth)
			classes.forEach(element => wrapper.classList.add(element))
			
			let titleElement = self.getTitleElement(subConfig.title || null, classes)
			
			let fontIconElement = self.getFontIconElement(subConfig.fontIcon || null, classes)

			let imgIconElement = self.getImgIconElement(subConfig.imgIcon || null, classes)

			let embedConfig = subConfig["embed"] || null
			let embedElement = null
			if (embedConfig != null){
				if (Array.isArray(embedConfig)){
					embedElement = document.createElement(self.config["basicElementType"])
					embedElement.classList.add("embededSubWrapper")
					embedElement.classList.add("embededSubWrapper"+depth)
					classes.forEach(element => embedElement.classList.add(element))
	
					for (let idx = 0; idx < embedConfig.length; idx++) {
						let curEmbed = embedConfig[idx]
						let curEmbedElement = null
						if (typeof curEmbed === "string"){
							curEmbedElement = self.getEmbedElement(curEmbed, classes, attributes)
						} else {
							curEmbedElement = self.getWrapperElement(curEmbed || null, positions, attributes, depth+1)
						}
						if(curEmbedElement != null){
							embedElement.appendChild(curEmbedElement)
						}
					}
				} else {
					embedElement = self.getEmbedElement(embedConfig, classes, attributes)
				}
			}
			

			let atLeastOneAdded = false
			let curWrapper = wrapper
			let iconElement = fontIconElement
			if(imgIconElement != null){
				iconElement = imgIconElement
			}

			for (let posChar of positions) {
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
					console.log("UNKNOWN CHARACTER")
				}
			}

			if (atLeastOneAdded){
				return wrapper
			} else {
				return null
			}
		} else {
			return null
		}
	},

	getDom: function () {
		const self = this

		let wrapper = self.getWrapperElement(self.config, self.config.positions, self.config.attributes, 0)

		if (wrapper == null){
			wrapper = document.createElement(self.config["basicElementType"])
		}

		wrapper.classList.add("embed")
		wrapper.classList.add("rootWrapper")
		
		return wrapper
	},

	start: function () {
		const self = this
		self.currentProfile = null

		let curClasses = []
		let classConfig = self.config["classes"] || null

		if(classConfig != null){
			classConfig.split(" ").forEach(curClass => curClasses.push(curClass))
		}

		self.classes = curClasses

		self.sendSocketNotification("CONFIG", self.config);

		self.resetTimer()
	},

	resetTimer: function () {
		const self = this
		if (self.refreshTimer) {
			clearTimeout(self.refreshTimer)
			refreshTimer = null
		}
		self.refreshTimer = setTimeout(() => {
			self.resetTimer()
		}, self.config.updateInterval * 1000)

		if (!self.hidden) {
			self.updateDom(self.config.animationSpeed)
		}
	},

	notificationReceived: function (notification, payload) {
		const self = this
		if (notification === "CHANGED_PROFILE") {
			self.currentProfile = payload.to
		} 
	},

	socketNotificationReceived: function (notification, payload) {
		const self = this
	},
})
