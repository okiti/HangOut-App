module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}

// Explanation: A function that accepts a function and then returns a function and executes that funtion but catches any error and passess it to thr  next if there is an error
