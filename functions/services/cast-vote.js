const admin = require('firebase-admin');

module.exports = (request, response) => {
	const voter = request.body.userId;
  	const voteSubject = request.body.voteSubject;
  	const vote = request.body.vote;

  	if (voteIsInValid(vote)) {
  		throwError(400, `Invalid vote: ${vote}`);
  	}

	registerVoteInByStructure(voter, voteSubject, vote);
	registerVoteInOnStructure(voter, voteSubject, vote);

	response.send("ok");
}

const registerVoteInByStructure = (voter, voteSubject, vote) => {
	var byRef = admin.database().ref(`/votes/by/${voter}/${voteSubject}`);
	var timestamp = new Date().toISOString();
	
	const byVoteToPut = {
		"vote" : vote,
		"timestamp" : timestamp
	}	
	
	byRef.set(byVoteToPut);
}

const registerVoteInOnStructure = (voter, voteSubject, vote) => {
	var onRef = admin.database().ref(`/votes/on/${voteSubject}/${vote}`);
	var timestamp = new Date().toISOString();
	
	const onVoteToPut = {
		"voterId" : voter,
		"timestamp" : timestamp
	};

	onRef.push(onVoteToPut);
}

const voteIsInValid = (vote) => {
	const legal = ['PIG', 'RAT'];
	
	return !legal.includes(vote);
}

const throwError = (code, message) => {
  	const error = new Error(message);
	error.code = code;
		
	throw error;
}