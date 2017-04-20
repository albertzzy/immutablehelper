// update a deep plain-obj simple helper
/*
	['a','b']
	['a','b:1']

	set - 单个值（plainobject key-val[merge],array val）
	add - array push (deprecated)
	delet - array key delete,plainobject key delete (deprecated)

	deprecated add and delete,which are all mutable operation and could be avoided;
*/

var pa,key,index,newObj;
var flag = false;

function isObject(obj){
	return typeof obj === 'object'
}
function isWindow(obj){
	return obj!== null&&obj === obj.window;
}

function isPlainObject(obj){
	return !isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
}

function isArray(arr){
	return typeof Array.isArray === 'function'? Array.isArray(arr):arr instanceof Array;
}

function isEqual(a,b){
	if(typeof a === 'object'){
		var akeys = Object.keys(a);
		var bkeys = Object.keys(b);

		if(akeys.length !== bkeys.length){
			return false;
		}

		for(var i=0;i<akeys.length;i++){
			if(typeof b[akeys[i]] === 'undefined'){
				return false;
			}
		}

		return true;
	}

	return a === b;
}

function deepCopy(obj){
	
}


function hardCopy(obj,path,value){
	if(!flag){
		newObj = deepCopy(obj);
		flag = true;
	}

	if(path.length){
		pa = path.pop();
		if(~pa.indexOf(':')){
			key = pa.split(':')[0];
			index = pa.split(':')[1];
			hardCopy(newObj[key][index],path,value)

		}else{
			hardCopy(newObj[pa],path,value)

		}
	}else{
		obj = value;
	}

	return newObj;
}



function lookup(obj,path){
	var lp = obj;
	var tail = path.slice(-1);
	var arrayIndex,tailArr;

	if(/\w+:\d/.test(tail)){
		tailArr = tail.split(':');
		arrayIndex = tailArr[1];
		path[path.length-1] = tailArr[0];
	}

	for(var i=0,len=path.length;i<len;i++){
		var p = path[i];

		if(typeof lp[p] === 'undefined' && typeof lp[p][arrayIndex] === 'undefined'){
			throw new Error('can not find this value');
		}

		if(typeof arrayIndex !== 'undefined' && i === len-1){
			lp = lp[p][arrayIndex];
		}else{
			lp = lp[p];
		}
	}
	return lp;
}


function update(obj,path,value,config){
	if(!isPlainObject(obj)){
		throw new Error('obj should be a plain obj.');
	}

	if(!isArray(path)){
		throw new Error('path should be an array.');
	}
	
	config = config || {merge:false};

	setfunc(obj,value,path,config);
}


function setfunc(obj,value,path,config){
	var lp = lookup(obj,path);

	if(lp.constructor !== value.constructor){
		immutableSet(obj,lp,path,value);
	}else{
		if(lp.constructor === Object && config.merge){
			immutableMerge(obj,lp,path,value);
		}else{
			immutableSet(obj,lp,path,value);
		}
	}
}

function immutableMerge(obj,lp,path,value){
	return Object.assign({},lp,value);
}


function immutableSet(obj,lp,path,value){
	if(isEqual(value,lp)){
		return obj;
	}else{
		return hardCopy(obj,path,value);
	}
}