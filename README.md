![](https://raw.githubusercontent.com/tdermendjiev/ChattyWebviews/main/assets/logo.png?token=GHSAT0AAAAAAB27RDB2OAYVTOSXSULIUEMWZAIRWCA)

Chatty Webviews adds easy and simple communication mechanism between your native (iOS and Android) classes and webviews. 

## Installation

chatty-webviews is available through npm. To install
it, run this command in your js project folder:

```shell
npm install chatty-webviews
```

## Usage 

### Bootstrap messaging service
Call *attach* method in the starting point of your module where you need to subscribe for or send messages.

```js
import { attach } from 'chatty-webviews';
export class AppComponent {
  constructor() {
    attach();  
  }
  
}
```

### Subscribe for / Unsubscribe from incoming messages

```js
import { subscribe, ChattySubscription } from 'chatty-webviews';

export class HomeComponent implements AfterViewInit, OnDestroy {
  
  chattySubscription: ChattySubscription

  ngAfterViewInit(): void {
    chattySubscription = subscribe('update-items', (msg: any) => {
      console.log(msg);
    })
  }
  
  ngOnDestroy() {
    chattySubscription.unsubscribe()
  }
}
```

### Send messages 


```js
import { sendMessage } from 'chatty-webviews';

export class HomeComponent implements AfterViewInit {

  fetchItems(limit: number) {
    sendMessage("get-items", {limit});
  }
}
```

### Testing and local development
To test in a local environment (e.g. when the app is not running in a mobile one) you can create a mock service:

```js
import { subscribe, sendMessage } from 'chatty-webviews';

export class MockHandler {
    constructor() {
        subscribe("get-items", (msg: any) => {
            let items = ["item1", "item2"];
            sendMessage('update-items', {items})
          })

    }
}
```

Then initialize it conditionally (i.e. if not in a mobile app):

```js
import { attach, isIos } from 'chatty-webviews';
import { MockHandler } from './handlers/MockHandler';

export class AppComponent {

  mockHandler?: MockHandler;
  
  constructor() {
    if (!isIos()) {
      this.mockHandler = new MockHandler();
    }
  }
}
```

## Author

Teodor Dermendjiev, tdermendjievft@gmail.com

## Supporters

[Azbouki Software](https://www.azbouki.com/)

![](https://www.azbouki.com/assets/img/azbouki-logo-dark.svg)

## License

chatty-webviews-js is available under the MIT license. See the LICENSE file for more info.





