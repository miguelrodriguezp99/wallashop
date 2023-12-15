import { IoReload } from "react-icons/io5";

const NotificationsReload = () => {

    const handleReload = () => {
        window.location.reload();
    }

    return ( 
        <div className="text-white w-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center"> 
            <div className="flex"> 
                <p>Posts might have changed, please refresh</p>
                <button onClick={handleReload} className="ml-5"><IoReload/></button>
            </div>
        </div> 
    )
}

export default NotificationsReload;
