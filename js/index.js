var capacityField = document.getElementById("capacity");
var itemsField = document.getElementById("items");
var resultsDiv = document.getElementById("results");
var clearButton = document.getElementById("clearButton");

function parseItems(itemsStr) {
	var items = itemsStr.split(",");
	var itemsNums = [];
	for(var i in items) {
		if(isNaN(items[i])) {
			return;
		}
		itemsNums.push(Number(items[i]));
	}

	return itemsNums;
}

function sortItems() {
	var items = parseItems(itemsField.value);
	if(!items) {
		alert("Error parsing items");
		return;
	}

	items.sort(function(a, b){return b-a;});
	printItems(items);
}

function printItems(items) {
	itemsField.value = items[0];
	for(var i = 1; i < items.length; i++) {
		itemsField.value += "," + items[i];
	}
}

function clearResults() {
	resultsDiv.innerHTML = "";
	clearButton.style.visibility = "hidden";
}

function showClearButton() {
	clearButton.style.visibility = "visible";
}

function nextFit() {
	clearResults();

	var cap = capacityField.value;
	if(!cap) {
		alert("No capacity specified");
		return;
	}

	var items = parseItems(itemsField.value);
	var currBinI = 1;
	var currBin = new Bin(cap);
	var currSum = 0;

	for(var iItem = 0; iItem < items.length; iItem++) {
		if(items[iItem] > cap) {
			alert("An item is larger than the capacity");
			return;
		}

		if(currSum + items[iItem] > cap) {
			currBin.print(currBinI);

			currBin = new Bin(cap);
			currBin.push([items[iItem]]);
			currSum = items[iItem];
			currBinI++;
			continue;
		}

		currBin.push(items[iItem]);
		currSum += items[iItem];
	}
	currBin.print(currBinI);

	showClearButton();
}

function firstFit() {
	clearResults();

	var cap = capacityField.value;
	if(!cap) {
		alert("No capacity specified");
		return;
	}

	var binSystem = [new Bin(cap)];
	var items = parseItems(itemsField.value);

	for(var iItem in items) {
		var currBin = binSystem[binSystem.length - 1];

		// Check bins from left to right
		var foundFit = false;
		for(var iPastBin = 0; iPastBin < binSystem.length; iPastBin++) {
			if(binSystem[iPastBin].getSpace() >= items[iItem]) {
				binSystem[iPastBin].push(items[iItem]);
				foundFit = true;
				break;
			}
		}
		if(foundFit) continue;

		// Have to make a new bin
		var newBin = new Bin(cap);
		newBin.push(items[iItem]);
		binSystem.push(newBin);
	}

	for(var i = 0; i < binSystem.length; i++) {
		binSystem[i].print(i+1);
	}

	showClearButton();
}

function bestFit() {
	clearResults();

	var cap = capacityField.value;
	if(!cap) {
		alert("No capacity specified");
		return;
	}

	var binSystem = [new Bin(cap)];
	var items = parseItems(itemsField.value);

	for(var iItem in items) {
		var currBin = binSystem[binSystem.length - 1];

		// First, check the most recent bin
		if(currBin.getSpace() >= items[iItem]) {
			currBin.push(items[iItem]);
			continue;
		}

		// Next, check for bin with most space
		var bestBin;
		var maxSpace = 0;
		for(var iPastBin = 0; iPastBin < binSystem.length - 1; iPastBin++) {
			var currSpace = binSystem[iPastBin].getSpace();
			if(currSpace > maxSpace && currSpace >= items[iItem]) {
				bestBin = iPastBin;
				maxSpace = binSystem[iPastBin].getSpace();
			}
		}
		
		if(bestBin) {
			binSystem[bestBin].push(items[iItem]);
			continue;
		}

		// Have to make a new bin
		var newBin = new Bin(cap);
		newBin.push(items[iItem]);
		binSystem.push(newBin);
	}

	for(var i = 0; i < binSystem.length; i++) {
		binSystem[i].print(i+1);
	}

	showClearButton();
}

function Bin(capacity) {
	this.sum = 0;
	this.cap = capacity;
	this.items = [];
}

Bin.prototype = {
	constructor: Bin,

	getSpace: function() {
		return this.cap - this.sum;
	},

	push: function(item) {
		this.items.push(item);
		this.sum += item;
	},

	print: function(number) {
		if(this.items.length === 0) return;

		var str = "<h2>Bin " + number + ": [" + this.items[0];
		for(var i = 1; i < this.items.length; i++) {
			str += ", " + this.items[i];
		}
		str += "]</h2>";

		resultsDiv.innerHTML += str;
	}
};
