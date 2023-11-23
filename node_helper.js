/* MagicMirror²
 * Module: EmbedURL
 *
 * By Tom Hirschberger
 * MIT Licensed.
 */
const NodeHelper = require('node_helper')

module.exports = NodeHelper.create({

	start: function () {
		this.started = false
	},

	socketNotificationReceived: function (notification, payload) {
		const self = this
		if (notification === 'CONFIG' && self.started === false) {
			self.config = payload
			self.started = true
		} else {
			console.log(this.name + ': Received Notification: ' + notification)
		}
	}
})
