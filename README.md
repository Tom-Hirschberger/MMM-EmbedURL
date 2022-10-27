# MMM-EmbedURL

This is a MagicMirror² module which embeds other websites either by iframe (default) or webview to your mirror. Multiple pages can be embeded at once and the pages can be refreshed periodically (all websites get refreshed at the same time). As webview usage is possible (only if electron or chrome is used) even pages that forbid embedding by iframe can be embedded (i.e. NodeRed Dashboard).
I use it to embed my Grafana panels.

<p align="center">
 <img src="doc/screenshots/SomeGrafanaPanels.png" alt="Screen showing some Grafana panels" width="600px"/>
</p>

## Basic features

* Embed other websites either by iframe or webview
* Add icon(s) or title(s) before or after the embeded website
* Arrange sites to groups
* Periodically refresh the embedded websites (all sites will be refreshed at once)
* Display embeded elements depending to the current profile (see [MMM-ProfileSwitcher](https://github.com/tosti007/MMM-ProfileSwitcher))

## Basic installation

```bash
cd ~/MagicMirror/modules
git clone https://github.com/Tom-Hirschberger/MMM-EmbedURL.git
cd MMM-EmbedURL.git
npm install
```

## Basic configuration

Add the following code to your ~/MagicMirror/config/config.js:

```json5
{
  module: "MMM-MMM-EmbedURL",
  position: "top_center",
  header: "Embed-URL",
  config: {
    updateInterval: 120,
    embed: [
        "https://magicmirror.builders/",
        "https://www.youtube.com/embed/dIHr96KqfDI"
    ]
  },
```
