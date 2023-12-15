import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  //Badge
} from "@nextui-org/react";
import React, { useContext, useEffect} from "react";
import { LogginContext } from "../../context/loginContext.js"
import { toast } from "sonner";
import {useNotificationsStore} from "../../store/notifications";
import "../../styles/notification.css";

const NotificationModal = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const { user } = useContext(LogginContext);
  const {notificationsByUser, fetchNotifications, deleteNotification} = useNotificationsStore();

  const handleDeleteNotification = async (notificationId) => {
  	await deleteNotification(user.id, notificationId);
  	};
 
 useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchNotifications(user.id);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Error al cargar las notificaciones");
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, fetchNotifications, user.id]);
  


return (
    <>
    {/*<Badge content= {notificationsByUser.length} color="warning">*/}
      <Button
      	className="text-black"
      	as={Button}
		color="primary"
		href="#"
		variant="flat"
      	onPress={onOpen}
      >
        Notificaciones
      </Button>
     {/*</Badge>*/}
      <div className="mt-20">
      	<Modal 
      		isOpen={isOpen} 
      		onOpenChange={onOpenChange} 
      		className="w-full"
			scrollBehavior="inside"
			backdrop="opaque"
		>
        	<ModalContent>
          		<ModalHeader>Notificaciones</ModalHeader>
          		<ModalBody>
            		{notificationsByUser.length === 0 ? (
  						<p style={{ marginBottom: '10px' }}>No hay notificaciones</p>
					) : (
  						<ul>
    						{notificationsByUser.map((notification) => (
      							<li key={notification.id} className="notification-item">
        							{notification.comment ? (
          								<>
          									{notification.parentComment ? (
												<p>El usuario {notification.comment.user.userName} ha respondido a tu comentario{' '}
												en el post '{notification.comment.post.title}': {notification.comment.text}</p>	
            									
            								):(
												<p>El usuario {notification.comment.user.userName} ha comentado en tu post{' '}
            									'{notification.comment.post.title}': {notification.comment.text}</p>
											)}
          								</>
        							) : (
											<p>El post que sigues '{notification.post.title}' ha sido modificado</p>
        							)}
        							<Button className="delete-button" onClick={() => handleDeleteNotification(notification.id)} >        								
          								X
        							</Button>
      							</li>
    						))}
  						</ul>
					)}
          		</ModalBody>
        	</ModalContent>
      	</Modal>
      </div>
    </>
  );
};

export default NotificationModal;
