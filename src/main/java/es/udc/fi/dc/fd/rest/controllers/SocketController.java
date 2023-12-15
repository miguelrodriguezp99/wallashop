package es.udc.fi.dc.fd.rest.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import es.udc.fi.dc.fd.rest.dtos.SocketAnswerDto;

@Controller
public class SocketController {

    @MessageMapping("/handleNotifications")
    @SendTo("/topic/notifications")
    public SocketAnswerDto notificationSocket(SocketAnswerDto answer) throws Exception {
        Thread.sleep(500); // simulated delay
        return answer;
    }

}
