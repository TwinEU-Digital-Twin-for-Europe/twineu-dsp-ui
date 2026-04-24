import { toast } from "react-toastify";

function checkTopic(value:string, name:string){
   
    if ( value !== null && typeof value === "string" && (value.includes(" ") || value.includes("."))) {
            while (value.includes(" ") || value.includes(".")) {
                value = value.replace(" ", "_").replace(".", "-")
            }
            toast.error(`The ${name} topic field must be a string without spaces or dots; any spaces have been converted to underscores and any dots to dashes. Please save it`);
        }

    return value
}
    
export default checkTopic