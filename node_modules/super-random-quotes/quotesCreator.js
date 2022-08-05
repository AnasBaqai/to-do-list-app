var arr = require('./data/quote.json');

var quote={};

function randomInt(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
module.exports.getRandomQuote = function () { 
    var index = randomInt(0,99);
    quote.text=arr[index].text;
    quote.author=arr[index].from;
    return quote;
};