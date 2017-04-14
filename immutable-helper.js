// update a deep plain-obj simple helper
/*
	['a','b']
	['a','b:1']

	set - 单个值（plainobject key-val[merge],array val）
	add - array push
	delet - array key delete,plainobject key delete
*/

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


function update(obj,path,value,command,config){
	if(!isPlainObject(obj)){
		throw new Error('obj should be a plain obj.');
	}

	if(!isArray(path)){
		throw new Error('path should be an array.');
	}
	
	config = config || {merge:false};

	doCommand(obj,value,path,command,config);
}


function doCommand(obj,value,path,command,config){
	switch(command){
		case '$set': setfunc(obj,value,path,config);break;
		case '$add':addFunc(obj,value,path,config);break;
		case '$delete':deleteFunc(obj,value,path,config);break;
	}
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

function addFunc(obj,value,path,config){
	var lp = lookup(obj,path);

	if(!isArray(lp)){
		throw new Error('the value pathed should be an array');
	}

	immutableAdd(obj,value,path);
	
}

function deleteFunc(obj,value,path,config){
	var lp = lookup(obj,path);

	

}