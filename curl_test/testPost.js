var tm = require("./test.js");

let testFuncList = {};

testFuncList.create = async function () {
	await tm.post("/api/post", {
		title : "test post",
		description : "test 돳",		
	});
};

testFuncList.update = async function () {
	await tm.put("/api/communities/general/posts/639", {
		newCommunityName : 'bg'
	});
};

testFuncList.list_recommend = async function () {
	await tm.guest.get("/api//posts/recommend");
}


testFuncList.list = async function () {
	await tm.guest.get("/api/posts/latest/290/10");
};


testFuncList.detail = async function () {
	await tm.get("/api/communities/mogao/posts/1561");
};

testFuncList.delete = async function () {
	await tm.delete("/api/communities/general/posts/383");
};


testFuncList.comment_update_with_mention = async function () {
	await tm.put("/api/communities/mogao/posts/203/comments/230", {
		comment : 'Update Comment with mention',
		tagUsers : [],
		mentionUsers : []
	});
};


testFuncList.comment_delete = async function () {
	await tm.delete("/api/communities/mogao/posts/1194/comments/1135" );
};

testFuncList.filter = async function () {
	await tm.post("/api/posts/filter", {
		sortType : "latest",
		offset : 0,
		num : 10,				
		countries : ["KR"],
	});
};

let funcName = process.argv[2];
testFuncList[funcName]();

