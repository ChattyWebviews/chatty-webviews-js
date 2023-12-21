const chattyPubSubEventType = "ChattyPubSub";
const handlers: Record<string, Array<MessageHandler>> = {};

export function attach() {
    window.addEventListener(chattyPubSubEventType, (ev: Event) => {
        const { topic, message } = (ev as CustomEvent<ChattyMessage>).detail;
        const topicHandlers = handlers[topic] || [];
        topicHandlers.forEach((handler) => handler(message));
    });
}

export function subscribe(topic: string, handler: MessageHandler): ChattySubscription {
    const topicHandlers = handlers[topic] || [];
    topicHandlers.push(handler);
    handlers[topic] = topicHandlers;

    return {
        unsubscribe: () => {
            const topicHandlers = handlers[topic] || [];
            const index = topicHandlers.indexOf(handler);
            index >= 0 && topicHandlers.splice(index, 1);
        }
    }
}

export function sendMessage(topic: string, message: Message): void {
    if (isIos()) {
        (window as any).webkit.messageHandlers.cwMessageHandler.postMessage({
            topic: topic,
            message: message
        });
    } else if (isAndroid()) { // Assuming you have a function like isAndroidWebView
        (window as any).Android.sendMessage(topic, JSON.stringify(message));
    }

    //push to web handlers too
    window.dispatchEvent(new CustomEvent<ChattyMessage>(chattyPubSubEventType, {
        detail: { topic, message },
    }));
}

export function isIos(): boolean {
    return !!(window as any).webkit?.messageHandlers?.cwMessageHandler;
}

export function isAndroid(): boolean {
    var userAgent = navigator.userAgent;
    return /cw-android/i.test(userAgent);
}


export type Message = any
export type MessageHandler = (message: Message) => void;
export type ChattySubscription = {
    unsubscribe: () => void
}

type ChattyMessage = {
    topic: string
    message: Message
}