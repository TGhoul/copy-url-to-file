
const NOTIFICATION_ID = "save-text-to-file-notification";
const EXTENSION_TITLE = "Save text to file";
let textArray = "";

// 菜单监听事件
chrome.contextMenus.onClicked.addListener(function(info) {
	// 收集url
	if (info.menuItemId == COPY_LINK_MENU_ID) {
		let url = info.pageUrl + "\n";
		textArray += url;
		set(getDateString(), textArray);
	}
	// 下载文件
	if (info.menuItemId == DOWNLOAD_FILE_MENU_ID) {
		get(getDateString(), function(items) {
			let urlSet = items[getDateString()];
			var blob = new Blob([urlSet], {
				type: "text/plain"  
			});
			var url = URL.createObjectURL(blob);
			let fileName = getDateString() + ".txt";
			startDownloadOfTextToFile(url, fileName);
		});
		
		// 下载完成移除
		del(getDateString());
		// 清空文本
		textArray = "";
	}
});

// 下载文件
function startDownloadOfTextToFile(url, fileName) {
	var options = {
		filename: fileName,
		url: url,
		saveAs: true
	};
	chrome.downloads.download(options, function(downloadId) {

	});
}

// 文件名
function getDateString() {
	var currentDate = new Date();
	var day = determineDay();
	var month = determineMonth();
	var year = currentDate.getFullYear();
	function determineDay() {
		var dayPrefix = currentDate.getDate() < 10 ? "0" : "";
		return dayPrefix + currentDate.getDate();
	}

	function determineMonth() {
		var monthPrefix = (currentDate.getMonth() + 1) < 10 ? "0" : "";
		return monthPrefix + (currentDate.getMonth() + 1);
	}
	return year +  "-" + month + "-" + day;
}

function set(key, value) {
	chrome.storage.sync.set({[key]: value}, function() {
		console.log(key + "," + value);
	});
}

function get(key, callback) {
	chrome.storage.sync.get([key], callback);
}

function del(key) {
	chrome.storage.sync.remove([key], function() {
	});
}