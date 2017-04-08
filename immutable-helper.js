// update a deep plain-obj simple helper

function isPlainObject(obj){
	return typeof obj === 'object' //&& 
}

function isArray(arr){
	return typeof Array.isArray === 'function'? Array.isArray(arr):'';
}

function lookup(){
	var lp = obj;
	for(var i=0,len=path.length;i<len;i++){
		if(!lp[p]){
			throw new Error('blabla');
		}
		lp = lp[p];
	}
	return lp;
}


function update(obj,value,path,command){
	if(!isPlainObject(obj)){
		throw new Error('obj should be a plain obj.');
	}

	if(!isArray(path)){
		throw new Error('path should be an array.');
	}
	
	doCommand(obj,value,path,command);
}


function doCommand(obj,lookup,value,command){
	switch(command){
		case 'set': setfunc(obj,lookup,value);break;
		case 'merge':mergeFunc(obj,lookup,value);break;
		case 'push':pushFunc(obj,lookup,value);break;
	}
}


