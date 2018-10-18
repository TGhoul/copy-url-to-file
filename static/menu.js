
const APPEND_COMMAND = "append-file";
const DOWNLOAD_COMMAND = "download-file";
const INTERRUPTED_STATE = "interrupted";
const MAX_SIZE_MESSAGE = "超出最大文件大小,请保存文件";

let textArray = "";
let download = -1;
// chrome hotkey
chrome.commands.onCommand.addListener(function (command) {
	// append
	if (command === APPEND_COMMAND) {
		storeCurrentUrl();
	}
	// download
	if (command === DOWNLOAD_COMMAND) {
		getTextFromStorage();
	}
});

// 菜单监听事件
chrome.contextMenus.onClicked.addListener(function(info) {
	// 收集 url
	if (info.menuItemId == COPY_LINK_MENU_ID) {
		storeCurrentUrl();
	}
	// 下载文件
	if (info.menuItemId == DOWNLOAD_FILE_MENU_ID) {
		getTextFromStorage();
	}
});

// 保存当前 url
function storeCurrentUrl() {
	// 判断下载任务是否存在，不存在则表示任务取消
	if (download !== -1) {
		// 检查下载任务状态
		chrome.downloads.search({id: download}, function(results) {
			let result = results[0];
			if (result.state !== INTERRUPTED_STATE) {
				// 下载完成移除
				del(getDateString());
				// 清空文本
				textArray = "";
			}
			console.log(results);
		});
	}
	chrome.tabs.query({"active": true, "lastFocusedWindow": true}, function (tabs) {
		let url = tabs[0].url + "\n";
		textArray += url;
		set(getDateString(), textArray);
	});
}

// 取出 url 开始下载
function getTextFromStorage() {
	get(getDateString(), function(items) {
		let urlSet = items[getDateString()];
		var blob = new Blob([urlSet], {
			type: "text/plain"  
		});
		var url = URL.createObjectURL(blob);
		let fileName = getDateString() + ".txt";
		startDownloadOfTextToFile(url, fileName);
	});
}

// 下载文件
function startDownloadOfTextToFile(url, fileName) {
	var options = {
		filename: fileName,
		url: url,
		saveAs: true
	};
	chrome.downloads.download(options, function(downloadId) {
		download = downloadId;
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
		if (chrome.runtime.lastError) {
			alert(MAX_SIZE_MESSAGE);
		}
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