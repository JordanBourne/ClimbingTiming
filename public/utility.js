var utility = (function() {
	return {
		addToElement: function(originalElementName, elementToAdd) {
			var originalElement = document.getElementById(originalElementName);
			var newElement = document.createElement('div');
			newElement.innerHTML = elementToAdd;
			originalElement.appendChild(newElement);
		},

		createButton: function(buttonText, buttonFunction) {
			var btn = document.createElement('BUTTON');
			var btnText = document.createTextNode(buttonText);
			btn.appendChild(btnText);
			btn.onclick = buttonFunction;
			return btn;
		},

		nameCase: function(string) {
			return string
				.replace(/([a-z])([A-Z])/g, '$1 $2')
				.replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
				.replace(/^./, function(str){ return str.toUpperCase(); });
		},

        parseURLParams: function(params) {
            let queryObject = {};
            let queryParams = params.slice(1).split('&');
            queryParams.forEach(function(param) {
                let paramValues = param.split('=');
                queryObject[paramValues[0]] = paramValues[1];
            });

            return queryObject;
        },

		replaceElements: function(parentElement, replacementElement) {
			utility.removeAllElements(parentElement);
			parentElement.appendChild(replacementElement);
		},

		removeAllElements: function(elementToEmpty) {
			while (elementToEmpty.firstChild) {
				elementToEmpty.removeChild(elementToEmpty.firstChild);
			}
		},

        twoDigits: function(theNumber) {
            return theNumber < 10 ? '0' + theNumber : theNumber
        }
	};
})();
