const quote = require('./quotesCreator.js');

module.exports.getRandomQuote = function ()
{ 
    return quote.getRandomQuote().text + " ~ " + quote.getRandomQuote().author; 
};