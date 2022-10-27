/* global Module

/* Magic Mirror²
 * Module: EmbedURL
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
Module.register('MMM-EmbedURL', {

	defaults: {
		basicElementType: "iframe", //this module uses a lot of wrappers and basic elements. This option decides about the basic element (div or span)
		updateInterval: 60, //how often should the module be refreshed
		animationSpeed: 500, //use this animation speed if the dom objects of the module gets updated
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
		return ['font-awesome.css', 'valuesByNotification.css']
	},

	/*
	** creates html objects based on a given string
	** see: https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
	*/
	htmlToElement: function (theString) {
		var template = document.createElement('template');
		theString = theString.trim(); // Never return a text node of whitespace as the result
		template.innerHTML = theString;
		return template.content.firstChild;
	},

	getDom: function () {
		const self = this
		let wrapper = document.createElement(self.config["basicElementType"])
		wrapper.classList.add("eurl")
		if (self.config["classes"] != null) {
			self.config["classes"].split(" ").forEach(element => wrapper.classList.add(element))
		}
		
		return wrapper
	},

	start: function () {
		const self = this
		self.currentProfile = null

		this.sendSocketNotification("CONFIG", this.config);

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
