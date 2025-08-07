import { toast } from "react-toastify";
import axiosWithInterceptorInstance from "./AxiosConfig";
interface ApiResponseLocalApi {
    ecc_url: string;
    id: string;
    email: string;
    username: string;
    name: string;
    broker_url: string;
    ed_api_url: string;
    data_app_url: string;
}

async function checkLocalApi(data: string) {
    let apI = `${data}/health`
    //200 e 

    try {
        const response = axiosWithInterceptorInstance.get(apI);

        if ((await response).status === 200) {
            //localStorage.setItem("isLocalApiReacheble", "true");
            console.log('OneNet DSP API reached successfully!!');
        }
    } catch (error: any) {
        //localStorage.setItem("isLocalApiReacheble", "false");
        toast.error('Error while reaching OneNet DSP API:', error)
    }
}
async function checkConnector(data: string) {
    let apiCheckConnector = `${data}/connector/dataService`
    //200 e 

    try {
        const response = axiosWithInterceptorInstance.get(apiCheckConnector);

        if ((await response).status === 200) {
            //localStorage.setItem("isLocalApiReacheble", "true");
            console.log('Connector reached successfully!');
        }
    } catch (error: any) {
        //localStorage.setItem("isLocalApiReacheble", "false");
        toast.error('Error while reaching the connector:', error)
    }
}


function checkLocalApiAndConnector() {
    axiosWithInterceptorInstance.get<ApiResponseLocalApi[]>(`/custom-query/data-objects/?id=e48046c9-0b94-41d2-9ad4-206f1604b821`)
        .then(response => {
            let localApiUrl = response.data[0].ed_api_url
            checkLocalApi(localApiUrl);
            checkConnector(localApiUrl);

        })
        .catch(error => {
            console.error('Error retrieving data:', error);
        });

}




async function checkLocalApiST(data: string) {
    let apI = `${data}/health`
    //200 e 

    try {
        const response = axiosWithInterceptorInstance.get(apI);

        if ((await response).status === 200) {
            //localStorage.setItem("isLocalApiReacheble", "true");
            toast.success('OneNet DSP API reached successfully!!');
        }
    } catch (error: any) {
        //localStorage.setItem("isLocalApiReacheble", "false");
        toast.error('Error while reaching OneNet DSP API:', error)
    }
}
async function checkConnectorST(data: string) {
    let apI = `${data}/connector/dataService`
    //200 e 

    try {
        const response = axiosWithInterceptorInstance.get(apI);

        if ((await response).status === 200) {
            //localStorage.setItem("isLocalApiReacheble", "true");
            toast.success('Connector reached successfully!');
        }
    } catch (error: any) {
        //localStorage.setItem("isLocalApiReacheble", "false");
        toast.error('Error while reaching the connector:', error)
    }
}

export { checkConnector, checkLocalApi, checkLocalApiAndConnector, checkConnectorST, checkLocalApiST }