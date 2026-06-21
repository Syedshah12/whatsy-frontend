import { Check, CheckCheck } from "lucide-react";


const MessageStatus = ({status}) => {


    if(status === "sent"){
        return (
            <Check 
              size={15}
            />
        );
    }


    if(status === "delivered"){
        return (
            <CheckCheck
              size={15}
            />
        );
    }


    if(status === "read"){
        return (
            <CheckCheck
              size={15}
              className="text-blue-500"
            />
        );
    }


    if(status === "failed"){
        return (
            <span className="text-red-500">
                !
            </span>
        );
    }


    return null;

};


export default MessageStatus;