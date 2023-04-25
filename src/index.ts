declare global {
    interface Window {
        webkit: any
    }
}

type Topic = string
type Message = string

interface ChattyMessage {
    topic: Topic
    message: Message
}

type MessageHandler = (message: Message) => void;
type PublishFn = (topic: Topic, message: Message) => void
type SubscribeFn = (topic: Topic, handler: MessageHandler) => void
type UnsubscribeFn = (topic: Topic, handler: MessageHandler) => void

type ChattySubscription = {
    unsubscribe: () => void
}

const handlers: Record<Topic, Array<MessageHandler>> = {};

let chattyPublish: PublishFn;
let chattySubscribe: SubscribeFn;
let chattyUnsubscribe: UnsubscribeFn;

export function attach(): void {
    chattyPublish = (topic, message) => {
        window.dispatchEvent(new CustomEvent<ChattyMessage>('pubsub', {
            detail: { topic, message },
        }));
    };

    chattySubscribe = (topic, handler) => {
        const topicHandlers = handlers[topic] || [];
        topicHandlers.push(handler);
        handlers[topic] = topicHandlers;
    };

    chattyUnsubscribe = (topic, handler) => {
        const topicHandlers = handlers[topic] || [];
        const index = topicHandlers.indexOf(handler);
        index >= 0 && topicHandlers.splice(index, 1);
    };

    window.addEventListener('pubsub', (ev: Event) => {
        const { topic, message } = (ev as CustomEvent<ChattyMessage>).detail;
        const topicHandlers = handlers[topic] || [];
        topicHandlers.forEach((handler) => handler(message));
    });
}

export function subscribe(topic: Topic, handler: MessageHandler): ChattySubscription {
    chattySubscribe(topic, handler);
    return {
        unsubscribe: () => {
            chattyUnsubscribe(topic, handler);
        }
    }
}

export function sendMessage(topic: Topic, message: Message): void {
    if (isIos()) {
        window.webkit.messageHandlers.cwMessageHandler.postMessage({
            "topic": topic,
            "message": message
        });
    }

    //push to web handlers too
    chattyPublish(topic, message);
}

export function isIos(): boolean {
    return window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.cwMessageHandler;
}
