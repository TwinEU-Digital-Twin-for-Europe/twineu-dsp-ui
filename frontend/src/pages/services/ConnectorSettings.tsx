import { Container,FormGroup, Label } from 'reactstrap';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosWithInterceptorInstance from '@app/components/helpers/AxiosConfig';
import { checkConnectorST, checkLocalApiST } from '@app/components/helpers/CheckLocalapiAndConnector';
import { appName } from '@app/App';

interface ApiResponse {
    ecc_url: string;
    id: string;
    email: string;
    username: string;
    name: string;
    broker_url: string;
    ed_api_url: string;
    data_app_url: string;
}

const ConnectorSettings = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const [data, setData] = useState<ApiResponse>({} as ApiResponse);
    const [connectorURL, setConnectorURL] = useState<string>();

    useEffect(() => {
        axiosWithInterceptorInstance.get<ApiResponse[]>(`/custom-query/data-objects/?id=e48046c9-0b94-41d2-9ad4-206f1604b821`)
            .then(response => {
                setData(response.data[0]);
                let localApiUrl = response.data[0].ed_api_url
                /* axiosWithInterceptorInstance.get(`${localApiUrl}/connector/dataService`)
                    .then(response => {
                        setConnectorURL(response.data.endpointURL);
                        console.log(response.data.endpointURL)
                    })
                    .catch(error => {
                        console.error('Error retrieving data:', error);
                    }); */

            })
            .catch(error => {
                console.error('Error retrieving data:', error);
            });


    }, []);

    const handleChange = (name: string, value: string) => {
        /* if( name === "data_app_url"){
            setConnectorURL(value)
        }else{
            setData(prevData => ({
            ...prevData,
            [name]: value
        }));
        } */
         setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    async function saveRequest() {
        let apI = `/custom-query/data?id=74c9e3bc-4e26-4d74-aefb-a5ab4b364c1e&ed_api_url=${data?.ed_api_url}&data_app_url=${data?.data_app_url}`
        try {
            const response = axiosWithInterceptorInstance.post(apI);

            if ((await response).status === 200) {
                //toast.success('OneNet DSP API Url saved successfully!');
                toast.success('Connector settings saved successfully!');
            }
        } catch (error: any) {
            toast.error("Error" + error)
            
            console.error(`Error while saving ${appName} API Url data:`, error);
        }

       /*  let bodyToSend = {
            "endpointURL": connectorURL
        }
        try {
            let apisss = "http://localhost:30001/api/connector/dataService/urn:uuid469c7aaf-8900-4511-abd7-43816285939a"
            const response = axiosWithInterceptorInstance.patch(apisss, bodyToSend);

            if ((await response).status === 200) {
                toast.success('Endpoint Connector Url saved successfully!');
            }
        } catch (error: any) {
            toast.error("Error" + error)
            console.error('Error saving Endpoint Connector Url data: ', error);
        } */
    }

    

    return (
        <Container fluid>

            <div className='row' style={{ paddingBottom: "15px" }}>
                <div className='col-11'>
                    <h2> <i className="fas fa-cogs nav-icon" style={{ paddingRight: "8px" }}></i><b>Connector settings</b></h2>
                    <h5>Edit Connector Settings</h5>
                </div>
                <div className='col' >
                    <button className="btn btn-primary" onClick={() => saveRequest()} data-toggle="tooltip" data-placement="top" title="Save your new configuration">
                        Save
                    </button>
                </div>
            </div>
            <Card  >
                <h3 className="list-group-item-heading" style={{ padding: "10px 20px" }}><b><i className="fas fa-user" style={{ paddingRight: "8px" }}></i>User information</b></h3>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <FormGroup>
                            <Label for="serviceCode">Id</Label>
                            <Form.Control
                                type="text"
                                value={data?.id}
                                aria-label="Disabled input example"
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="serviceCode">Email</Label>
                            <Form.Control
                                type="text"
                                value={data?.email}
                                aria-label="Disabled input example"
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="serviceCode">Username</Label>
                            <Form.Control
                                type="text"
                                value={data?.username}
                                aria-label="Disabled input example"
                                readOnly
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="serviceCode">Company</Label>
                            <Form.Control
                                type="text"
                                value={data?.name}
                                aria-label="Disabled input example"
                                readOnly
                            />
                        </FormGroup>
                    </ListGroup.Item>
                </ListGroup>
            </Card>

            <Card >
                <h3 className="list-group-item-heading" style={{ padding: "10px 20px" }}> <i className="fas fa-desktop" style={{ paddingRight: "8px" }}></i> <b>Local Applications</b></h3>
                <h6 className="list-group-item-heading" style={{ paddingLeft: " 20px" }}>DSP True Connector Provider, Consumer & The {appName} Api Must Be Installed On Your Premises By Your Network Administrator</h6>
                <ListGroup variant="flush">     

                    <ListGroup.Item>
                        <Label for="id" >{appName} Api</Label>
                        <div className="row">
                            <div className="col-9">
                                <Form.Control
                                    type="text"
                                    value={data?.ed_api_url}
                                    onChange={(e) => handleChange('ed_api_url', e.target.value)}
                                />

                            </div>
                            <div className="col-1" style={{ marginLeft: "20px" }}>
                                <button type="button" className="btn btn-primary" onClick={() => checkLocalApiST(data?.ed_api_url)}>Check</button>
                            </div>
                             <div className="col" style={{ whiteSpace: 'nowrap'  }}>
                                <button type="button" className="btn btn-primary" onClick={() => checkConnectorST(data?.ed_api_url)}>Check connector config</button>
                            </div>
                        </div>
                        <Label for="id" style={{ paddingTop: " 18px" }} >Endpoint Connector Url</Label>
                        <div className="row" >

                            <div className="col">
                                <Form.Control
                                    type="text"
                                    value={data?.data_app_url}
                                    onChange={(e) => handleChange('data_app_url', e.target.value)}
                                />
                            </div>
                            
                        </div>
                        {/* <Label for="id" style={{ paddingTop: " 18px" }} >Ecc Url</Label>
                        <div className="row" >

                            <div className="col">
                                <Form.Control
                                    type="text"
                                    value={data?.ecc_url}
                                    onChange={(e) => handleChange('ecc_url', e.target.value)}
                                />
                            </div>
                        </div> */}

                        {/*  <Label for="id" style={{ paddingTop: " 18px" }} >Broker url</Label> */}
                        <div className="row" >

                            {/*   <div className="col">
                                <Form.Control
                                    type="text"
                                    value={data?.broker_url}
                                    onChange={(e) => handleChange('broker_url', e.target.value)}
                                />
                            </div> */}
                        </div>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Container>
    );
};

export default ConnectorSettings;

