/* eslint-disable import/no-anonymous-default-export */
import * as Stomp from "@stomp/stompjs";

if (typeof TextEncoder === 'undefined') {
	const { TextEncoder, TextDecoder } = require('text-encoding');
	global.TextEncoder = TextEncoder;
	global.TextDecoder = TextDecoder;
  }


class StompService {

	constructor() {
		this.client = new Stomp.Client({
			brokerURL: "ws://localhost:8080/wallashop/gs-guide-websocket",
			// otras configuraciones...
		  });
	}

	connect() {
		return new Promise((resolve, reject) => {
			this.client.activate();
			this.client.onConnect = () => {
				resolve();
			};
			this.client.onStompError = (error) => {
				reject(error);
			};
		});
	}

	subscribe(destination, callback) {
		return this.client.subscribe(destination, callback);
	}

	send(destination, body) {
		this.client.publish({ destination, body });
	}

	disconnect() {
		this.client.deactivate();
	}
}

export default new StompService();
