/* MagicMirror²
 * Module: MMM-EmbedURL
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
const Log = require("logger")
const NodeHelper = require("node_helper")

module.exports = NodeHelper.create({

	start() {
		this.started = false
	},

	socketNotificationReceived(notification, payload) {
		const self = this
		if (notification === "CONFIG" && self.started === false) {
			self.config = payload
			self.started = true
		} else {
			Log.log(`${this.name}: Received Notification: ${notification}`)
		}
	}
})
