const errorHandler = (error, request, response, next) => {
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if(error.message === 'Validation error: Validation isEmail on username failed') {
		return response.status(400).json({ error: 'username must be an valid email' })
	} else if(error.message === 'Validation error: Validation min on year failed' || error.message === 'Validation error: Validation max on year failed') {
		return response.status(400).json({error: 'Year must be in range 1991 - current year'})
	} else {
        return response.status(400).json({ error: 'Something went wrong! ' + error.message }) //USE THIS IN DEV
		//return response.status(400).json({ error: 'Something went wrong!' }) //USE THIS IN PRD
    }

	next(error)
}

const tokenExtractor = (request, response, next) => {
	const authorization = request.get('Authorization')
	if(!authorization === undefined || !authorization === false){
		request.token = authorization.substring(7)
	}
  
	next()
}

module.exports = {
	errorHandler,
	tokenExtractor
}