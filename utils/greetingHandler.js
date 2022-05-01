function greet(username = 'stranger') {
    const currentTime = new Date().getHours();
    return currentTime <= 12 
        ? `Good morning, ${username}!` 
        : currentTime <= 18
        ? `Good afternoon, ${username}!`
        : `Good evening, ${username}!`;
}

module.exports = greet;