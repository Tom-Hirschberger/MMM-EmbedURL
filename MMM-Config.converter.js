const debug=false

function clone(x){
	return JSON.parse(JSON.stringify(x))
}

function converter(config_data, direction){
	let nc = {}
	if(direction == 'toForm'){

	   nc = clone(config_data)
	   if(typeof nc.embed === 'string'){
	   	 if(debug)
	   	 	console.log(" MMM-EmbedURL converter encountered 1, embed:string")
	   	 nc.embed= [ {urls:[nc.embed]}]
	   	 //embed_list=em
	   } else {
	   	for(let i in nc.embed){
	   		let x = nc.embed[i]
	   		if (typeof x === 'string') {
				if(debug)
	   				console.log("element is a string")
				nc.embed[i]= {urls:[x]}
			} else {
	   			if(debug)
	   				console.log("element in array="+JSON.stringify(x,null,2))
	   			x.embed = [{urls:x.embed}]
	   			nc.embed[i]=x
	   		}
	    }
	   	if(debug)
	   		console.log("after convert="+ JSON.stringify(nc))
	   }
		return clone(nc)

	} if (direction == 'toConfig'){  // convert TO native object from form structure
		// copy the data, top will be good.
		let nc = clone(config_data)
		// assume we will create an array
		nc.embed = []
		// on return from the form, embed will ALWAYS be an array
		// loop thru the original so we can change the new as we go
		config_data.embed.forEach((e,i, ar) =>{
			if(debug)
				console.log("embed data="+JSON.stringify(e,null,2))
			// this array element only has the urls list
			let keys = Object.keys(e)
			if(debug)
				console.log("keys="+JSON.stringify(keys))
			if(keys.length==1 && keys[0]==='urls'){
				// if only one entry
				if(ar.length ===1 && e.urls.length ==1){
					// just a string
					nc.embed=e.urls[0]
				} else {
					// just a list of urls
					e.urls.forEach(u => {
						nc.embed.push(u)
					})
				}

			} else {
				// we have an object, with an embed inside
				ar_e= clone(e)  // copy all the contents
				if(ar_e.embed === undefined){
					if(ar_e.urls !== undefined){
						ar_e.urls.forEach(u=>{
							nc.embed.push(u)
						})
					}
				}
				else {
					ar_e.embed.forEach(e=>{
						keys = Object.keys(e)
						if(debug)
							console.log("keys="+JSON.stringify(keys))
						if(keys.length==1 && keys[0]==='urls'){
							if(debug)
								console.log("single object ="+JSON.stringify(e))
						ar_e.embed = e.urls
						}
					})
					nc.embed.push(ar_e)
				}
			}
		})
		return clone(nc)
	}
}
exports.converter=converter
