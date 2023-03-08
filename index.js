
const handlers = {};

function attach() {
    window['publish'] = (topic, message) => {
        window.dispatchEvent(new CustomEvent('pubsub', {
            detail: { topic, message },
        }));
    };

    window['subscribe'] = (topic, handler) => {
        const topicHandlers = handlers[topic] || [];
        topicHandlers.push(handler);
        handlers[topic] = topicHandlers;
    };

    window['unsubscribe'] = (topic, handler) => {
        const topicHandlers = handlers[topic] || [];
        const index = topicHandlers.indexOf(handler);
        index >= 0 && topicHandlers.splice(index, 1);
    };

    window.addEventListener('pubsub', ev => {
        const { topic, message } = ev['detail'];
        const topicHandlers = handlers[topic] || [];
        topicHandlers.forEach(handler => handler(message));
    });
}

function subscribe(topic, callback) {
    window['subscribe'](topic, msg => {
      callback(msg);
    });
}

function sendMessage(topic, message) {
    if (window['webkit'] && window['webkit'].messageHandlers && window['webkit'].messageHandlers.cwMessageHandler) {
            window['webkit'].messageHandlers.cwMessageHandler.postMessage({
                "topic": topic,
                "message": message
            });
    }

    //push to web handlers too
    window['publish'](topic, message);
        
}

function isIos() {
    return window['webkit'] && window['webkit'].messageHandlers && window['webkit'].messageHandlers.cwMessageHandler
}

module.exports = {
    attach, 
    subscribe,
    sendMessage,
    isIos
}