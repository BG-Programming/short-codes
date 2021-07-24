const SERVER_HOST = "https://127.0.0.1:3000";
const ADMIN_EMAIL = "bg@bgprogramming.com" 
const ADMIN_PASSWORD = "1234" 
const USER_EMAIL = "bg@bgprogramming.com"
const USER_PASSWORD = "1234";

const exec = require('child_process').exec;
const execSync = require('child_process').execSync;


async function loginWithAdmin() {
	return await loginSync(ADMIN_EMAIL, ADMIN_PASSWORD);
}

async function loginWithUserSync() {
	return await loginSync(USER_EMAIL, USER_PASSWORD);
}

async function loginSync( email, password ) {
	return await new Promise((resolve, reject)=>{
		var cmd = `curl --insecure --request POST ${SERVER_HOST}/api/user/login -H "Content-Type: application/json" ` + 
				' -d \'{ "emailOrUsername" : "' + email + '", "password" : "' + password +'" }\' ';	

		exec(cmd, function(error, stdout, stderr){
			var jsonResult = JSON.parse(stdout);
			resolve(jsonResult.token);
		} );
	});
}


function _executeAndPrintResult(cmd) {
	const result = execSync(cmd);
	try {
		const resultJson = JSON.parse(result);
		console.log(JSON.stringify(resultJson, null, "  "));		
	} catch(e) {

	}
}



module.exports.get = async function(url) {
	const token = await loginWithUserSync();	
	let cmd = `curl --insecure  --request GET ${SERVER_HOST}${url}  -H "Authorization: ${token}" -H "Content-Type: application/json" `;
	_executeAndPrintResult(cmd);
};



module.exports.post = async function(url, data) {
	const token = await loginWithUserSync();	
	const strJson = JSON.stringify(data);	
	let cmd = `curl --insecure  --request POST ${SERVER_HOST}${url}  -H "Authorization: ${token}" -H "Content-Type: application/json" `
				+ ` -d '${strJson}' `;
	_executeAndPrintResult(cmd);
};



module.exports.put = async function(url, data) {
	const token = await loginWithUserSync();	
	const strJson = JSON.stringify(data);
	let cmd = `curl --insecure  --request PUT ${SERVER_HOST}${url}  -H "Authorization: ${token}" -H "Content-Type: application/json" `
				+ ` -d '${strJson}' `;
	_executeAndPrintResult(cmd);
};


module.exports.delete = async function(url) {
	const token = await loginWithUserSync();	
	let cmd = `curl --insecure  --request DELETE ${SERVER_HOST}${url}  -H "Authorization: ${token}" -H "Content-Type: application/json" `;
	_executeAndPrintResult(cmd);
};




const _guest = {
	get : async (url)=> {
		let cmd = `curl --insecure  --request GET ${SERVER_HOST}${url}  -H "Content-Type: application/json" `;
		_executeAndPrintResult(cmd);
	},

	post : async (url,data)=> {		
		const strJson = JSON.stringify(data);
		let cmd = `curl --insecure  --request POST ${SERVER_HOST}${url}  -H "Content-Type: application/json" `
					+ ` -d '${strJson}' `;
		_executeAndPrintResult(cmd);
	},

	put : async (url,data)=> {
		const strJson = JSON.stringify(data);
		let cmd = `curl --insecure  --request PUT ${SERVER_HOST}${url}  -H "Content-Type: application/json" `
					+ ` -d '${strJson}' `;
		_executeAndPrintResult(cmd);
	},

	delete : async (url)=> {
		let cmd = `curl --insecure  --request DELETE ${SERVER_HOST}${url}  -H "Content-Type: application/json" `;
		_executeAndPrintResult(cmd);
	}
};


const _admin = {		
	get : async function(url) {
		const token = await loginWithAdmin();	
		let cmd = `curl --insecure  --request GET ${SERVER_HOST}${url}  -H "Authorization: ${token}" -H "Content-Type: application/json" `;
		_executeAndPrintResult(cmd);
	},

	post : async function(url, data) {
		const token = await loginWithAdmin();	
		const strJson = JSON.stringify(data);
		//console.log(strJson);
		let cmd = `curl --insecure  --request POST ${SERVER_HOST}${url}  -H "Authorization: ${token}" -H "Content-Type: application/json" `
					+ ` -d '${strJson}' `;
		_executeAndPrintResult(cmd);
	},
	put : async function(url, data) {
		const token = await loginWithAdmin();	
		const strJson = JSON.stringify(data);
		let cmd = `curl --insecure  --request PUT ${SERVER_HOST}${url}  -H "Authorization: ${token}" -H "Content-Type: application/json" `
					+ ` -d '${strJson}' `;
		_executeAndPrintResult(cmd);
	},

	delete : async function(url) {
		const token = await loginWithAdmin();	
		let cmd = `curl --insecure  --request DELETE ${SERVER_HOST}${url}  -H "Authorization: ${token}" -H "Content-Type: application/json" `;
		_executeAndPrintResult(cmd);
	}
};

module.exports.guest = _guest;
module.exports.admin = _admin;
