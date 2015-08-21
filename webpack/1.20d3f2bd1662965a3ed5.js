webpackJsonp([1],{

/***/ 81:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by fenghongyu on 15/8/17.
	 */
	var widget = __webpack_require__(82);
	module.exports = {
	    alert: function(msg) {
	        window.alert(msg);
	    },

	    getTemplate: function() {
	        return widget();
	    }
	}


/***/ },

/***/ 82:
/***/ function(module, exports, __webpack_require__) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div>\n    <div>async module success</div>\n    <img class="fat-cat" src="' +
	((__t = (__webpack_require__(83))) == null ? '' : __t) +
	'" alt=""/>\n</div>\n';

	}
	return __p
	}

/***/ },

/***/ 83:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "fat_catc7acf6e77c0c9927979adf842b970318.jpg"

/***/ }

});