import { toast } from "react-toastify";
import axiosWithInterceptorInstance from "./AxiosConfig";
import { NavigateFunction } from "react-router-dom";
import { appName } from '@app/App';

function checkApiAndConnectorFromDashboard(navigate:NavigateFunction) {
    
    axiosWithInterceptorInstance.get(`/custom-query/data-objects/?id=e48046c9-0b94-41d2-9ad4-206f1604b821`) // put this before rendering the menu
        .then(async response => {

            let apiUrl = `${response.data[0].ed_api_url}/health`
            let apiCheckConnector = `${response.data[0].ed_api_url}/connector/dataService`
            // Checking OneNet DSP API
            try {
                const response = axiosWithInterceptorInstance.get(apiUrl);

                if ((await response).status === 200) {
                    //navigate('/'); //This will redirect
                    toast.success(`${appName} API reached successfully!!`);
                }
                try {
                    const response = axiosWithInterceptorInstance.get(apiCheckConnector);

                    if ((await response).status === 200) {
                        //navigate('/');

                        toast.success('Connector reached successfully!');
                    }

                } catch (error: any) {
                    navigate('/connectorSettings');
                    toast.error('Error while reaching the connector:', error)
                }
            } catch (error: any) {
                navigate('/connectorSettings');
                toast.error(`Error while reaching ${appName} API:`, error)
            }
            // Checking connector
        })
        .catch(error => {
            navigate('/connectorSettings');
            console.error('Error fetching data:', error);
        });

}

export default checkApiAndConnectorFromDashboard;


