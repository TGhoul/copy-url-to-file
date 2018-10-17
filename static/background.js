// menu id
const COPY_LINK_MENU_ID = "copy-url-to-file";
const DOWNLOAD_FILE_MENU_ID = "download-file";
chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({color: "#3aa757"}, function() {
		console.log("The color is green.");
	});

	chrome.contextMenus.create({
		id: COPY_LINK_MENU_ID,
		title: "复制当前链接到文件中",
		contexts: ["all"]
	});
	
	chrome.contextMenus.create({
		id: DOWNLOAD_FILE_MENU_ID,
		title: "输出文本文件",
		contexts: ["all"]
	});
	
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: {hostEquals: "developer.chrome.com"},
			})
			],
			actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});
});