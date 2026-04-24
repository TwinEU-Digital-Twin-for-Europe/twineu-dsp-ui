import { format } from 'date-fns';
import { Container, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Offering from '../modals/Offering_NewSubscription';
import axiosWithInterceptorInstance from '@app/components/helpers/AxiosConfig';
import checkTopic from '@app/components/helpers/checkTopic';

////Receiving interface
interface Company {
    name: string;
    id: string;
}

interface User {
    id: string;
    username: string;
    company_obj: Company;
}

interface Data_catalog_category {
    code: string;
    name: string;
}


interface Data_catalog_service {
    code: string;
    name: string;
    data_catalog_category_obj: Data_catalog_category;
}


interface Data_catalog_business_object {
    data_catalog_service_obj: Data_catalog_service;
    name: string;
    code: string;
}

interface User_1_1 {
    id: string;
    username: string;
}

interface Data_catalog_data_offerings {
    id: string;
    title: string;
    data_catalog_business_object_obj: Data_catalog_business_object;
    created_on: string;
    active_to: string;
    profile_selector: string;
    file_schema_sample_filename: string;
    file_schema_filename: string;
    file_schema_sample: string;
    file_schema: string;
    status: string;
    use_custom_semantics: string | null;
    active_from: string;
    modified_on: string;
    data_catalog_business_object_id: string;
    user_1_1_obj: User_1_1;
    user_obj: User;
    comments: string;
    topic_kafka_sub: string;
    updating_frequency_kafka_sub: number;
    topic_sub: null;
    updating_frequency_sub: number;
}


interface ApiReceiving {
    data_catalog_data_offerings_obj: Data_catalog_data_offerings;
}

///////////////////////////////////////////////////
interface DataCatalogDataRequest {
    comments: string;
    id: string | null;
    data_catalog_data_offering_id: string;
    status: string;
    topic_kafka_sub: string;
    updating_frequency_kafka_sub: number;
    topic_sub: string;
    updating_frequency_sub: number;
}
interface DataCatalogDataRequestWithNull {
    comments: string;
    id: string | null;
    data_catalog_data_offering_id: string;
    status: string;
    topic_kafka_sub: null;
    updating_frequency_kafka_sub: number;
    topic_sub: string;
    updating_frequency_sub: number;

}
interface RequestBody {
    data_catalog_data_requests: DataCatalogDataRequest;
}

const NewSubscription = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');
    const [data, setData] = useState<Data_catalog_data_offerings | null>(null);
    const [body, setBody] = useState<DataCatalogDataRequest | null>({
        comments: "",
        id: null,
        data_catalog_data_offering_id: "",
        status: "pending",
        topic_kafka_sub: "",
        updating_frequency_kafka_sub: 60,
        topic_sub: "",
        updating_frequency_sub: 60,
    });

    const handleChange = (name: keyof DataCatalogDataRequest, value: string | number) => {
        if ((name === "topic_kafka_sub" || name === "topic_sub") && typeof value === "string") {
            value = checkTopic(value, name === "topic_kafka_sub" ? "Kafka" : "Nats")
        }
        setBody(prevData => {
            if (prevData === null) {
                return null;
            }
            if (name in prevData) {
                return {
                    ...prevData,
                    [name]: value
                };
            }

            return prevData;
        });
    };

    const [modalStates, setModalStates] = useState({
        offeringModal: false,
    });

    const [ValuesFromModals, setFilterValuesFromModals] = useState({
        Modal_id: "",
    });

    const handleOpenModal = (modalName: string) => {

        setModalStates({ ...modalStates, [modalName]: true });
    };

    const handleCloseModal = (modalName: string) => {
        setModalStates({ ...modalStates, [modalName]: false });
    };

    const handleModalDataChange = (modalName: string, value: string) => {
        setFilterValuesFromModals({ ...ValuesFromModals, [modalName]: value });
        axiosWithInterceptorInstance.get<ApiReceiving>(`/dataset/my_offered_services/${value}`)
            .then(response => {
                setData(response.data.data_catalog_data_offerings_obj);
                handleChange("data_catalog_data_offering_id", response.data.data_catalog_data_offerings_obj.id);
            })
            .catch(error => {
                console.error('Error fetching media:', error);
            });
    };

    useEffect(() => {

    }, [ValuesFromModals.Modal_id, modalStates.offeringModal]);

    async function saveRequest() {
        try {
            let bodyToSend = {}
            bodyToSend = { "data_catalog_data_requests": body }
            if (body?.topic_kafka_sub === "") {

                const updatedBody: DataCatalogDataRequestWithNull = {
                    ...body,
                    topic_kafka_sub: null
                };
                bodyToSend = { "data_catalog_data_requests": updatedBody }

            }
            const response = await axiosWithInterceptorInstance.post('/dataset/my_subscriptions', bodyToSend);
            window.location.href = `mySubscriptions?type=${type}`
        } catch (error) {
            console.error('Error saving data: ', error);
        }
    }

    return (
        <Container fluid>

            <div className='row' style={{ paddingBottom: "15px" }}>
                <div className='col-7'>
                    <h2> <b><i className="fas fa-newspaper nav-icon " style={{ paddingRight: "8px" }}></i>  My Subscriptions</b></h2>
                    <h5>Create a new Subscription to an Offering</h5>
                </div>
                <div className='col'>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <div className="d-grid gap-2 d-md-block">
                            <button className="btn btn-primary" onClick={() => saveRequest()}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Card >
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h3 style={{ paddingTop: "10px" }}><b> <i className="fas fa-external-link-alt nav-icon" style={{ paddingRight: "8px" }}> </i> Offered Services </b></h3>
                        <h6>Select Offered Service For This Subscription Request </h6>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>

                                    <div className="input-group mb-3">
                                        <button onClick={() => handleOpenModal('offeringModal')} className="btn btn-outline-secondary" type="button" id="button-addon1">
                                            <i className="fas fa-search"></i>
                                            Select offering: {data?.title}
                                        </button>

                                    </div>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>

                                    <Label for="serviceName">Created on</Label>
                                    {data?.created_on && <Form.Control
                                        type="text"
                                        value={format(new Date(data?.created_on), 'dd/MM/yyyy HH:mm')}
                                        aria-label="Disabled input example"
                                        readOnly
                                    />}
                                    {!data?.created_on && <Form.Control
                                        type="text"
                                        value=""
                                        aria-label="Disabled input example"
                                        readOnly
                                    />}
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="serviceCode">Business object code</Label>
                                    <Form.Control
                                        type="text"
                                        value={data?.data_catalog_business_object_obj.code}
                                        aria-label="Disabled input example"
                                        readOnly
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>

                                    <Label for="serviceName">Business Object Name</Label>
                                    <Form.Control
                                        type="text"
                                        value={data?.data_catalog_business_object_obj.name}
                                        aria-label="Disabled input example"
                                        readOnly
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="serviceCode">Service Code</Label>
                                    <Form.Control
                                        type="text"
                                        value={data?.data_catalog_business_object_obj.data_catalog_service_obj.code}
                                        aria-label="Disabled input example"
                                        readOnly
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>

                                    <Label for="serviceName">Service Name</Label>
                                    <Form.Control
                                        type="text"
                                        value={data?.data_catalog_business_object_obj.data_catalog_service_obj.name}
                                        aria-label="Disabled input example"
                                        readOnly
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="serviceCode">Category Code</Label>
                                    <Form.Control
                                        type="text"
                                        value={data?.data_catalog_business_object_obj.data_catalog_service_obj.data_catalog_category_obj.code}
                                        aria-label="Disabled input example"
                                        readOnly
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>

                                    <Label for="serviceName">Category Name</Label>
                                    <Form.Control
                                        type="text"
                                        value={data?.data_catalog_business_object_obj.data_catalog_service_obj.data_catalog_category_obj.name}
                                        aria-label="Disabled input example"
                                        readOnly
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="serviceCode">Offering User Id</Label>
                                    <Form.Control
                                        type="text"
                                        value={data?.user_1_1_obj.id}
                                        aria-label="Disabled input example"
                                        readOnly
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>

                                    <Label for="serviceName">Offering Username</Label>
                                    <Form.Control
                                        type="text"
                                        value={data?.user_1_1_obj.username}
                                        aria-label="Disabled input example"
                                        readOnly
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="serviceCode">Offering Company Id</Label>
                                    <Form.Control
                                        type="text"
                                        value={data?.user_obj.company_obj.id}
                                        aria-label="Disabled input example"
                                        readOnly
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>

                                    <Label for="serviceName">Offering Company Name</Label>
                                    <Form.Control
                                        type="text"
                                        value={data?.user_obj.company_obj.name}
                                        aria-label="Disabled input example"
                                        readOnly
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                </ListGroup>
            </Card>


            {(window as any)["env"]["Nats"]  &&<Card >
                <h3 className="list-group-item-heading" style={{ paddingLeft: "20px", paddingTop: "20px" }}> <b>NATS parameters</b></h3>
                <h6 className="list-group-item-heading" style={{ paddingLeft: " 20px" }}>Select topic and updating frequency for the NATS plugin</h6>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="serviceCode">NATS topic</Label>
                                    <Input type="text" name="topic_sub" id="topic_sub" placeholder="Enter NATS topic" value={body?.topic_sub} onChange={(e) => handleChange('topic_sub', e.target.value)} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="serviceName">Updating Frequency (60 is the default value)</Label>
                                    <Input type="text" name="updating_frequency_sub" id="updating_frequency_sub" placeholder={String(body?.updating_frequency_sub)} value={data?.updating_frequency_sub} onChange={(e) => handleChange('updating_frequency_sub', Number(e.target.value))} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                </ListGroup>

            </Card>}
            {(window as any)["env"]["Kafka"] && <Card >
                <h3 className="list-group-item-heading" style={{ paddingLeft: "20px", paddingTop: "20px" }}> <b>Kafka parameters</b></h3>
                <h6 className="list-group-item-heading" style={{ paddingLeft: " 20px" }}>Select topic and updating frequency for the Kafka plugin</h6>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="serviceCode">Kafka topic</Label>
                                    <Input type="text" name="topic_kafka_sub" id="topic_kafka_sub" placeholder="Enter Kafka topic" value={body?.topic_kafka_sub} onChange={(e) => handleChange('topic_kafka_sub', e.target.value)} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="serviceName">Updating Frequency (60 is the default value)</Label>
                                    <Input type="text" name="updating_frequency_kafka_sub" id="updating_frequency_kafka_sub" placeholder={String(body?.updating_frequency_kafka_sub)} value={data?.updating_frequency_kafka_sub} onChange={(e) => handleChange('updating_frequency_kafka_sub', Number(e.target.value))} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                </ListGroup>

            </Card>}

            <Card >
                <h3 className="list-group-item-heading" style={{ paddingLeft: "20px", paddingTop: "20px" }}><b>Comments</b></h3>
                <h6 style={{ paddingLeft: " 20px" }}>Write comments for service provider</h6>
                <ListGroup variant="flush">

                    <ListGroup.Item><Label for="id" >Comments</Label>

                        {data && <Form.Control
                            type="text"
                            value={body?.comments}
                            aria-label="Disabled input example"
                            onChange={(e) => handleChange('comments', e.target.value)}
                        />}
                        {!data && <Form.Control
                            type="text"
                            placeholder="Please select offering "
                            aria-label="Disabled input example"
                            onChange={(e) => handleChange('comments', e.target.value)}
                        />}
                    </ListGroup.Item>
                </ListGroup>
            </Card>
            {modalStates.offeringModal && type && (
                <Offering
                    show={modalStates.offeringModal}
                    handleClose={() => handleCloseModal('offeringModal')}
                    onModalDataChange={handleModalDataChange}
                    message={type}
                />
            )}
        </Container>
    );
};

export default NewSubscription;

