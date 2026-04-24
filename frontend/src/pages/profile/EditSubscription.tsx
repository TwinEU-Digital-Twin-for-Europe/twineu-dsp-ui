import { Container, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosWithInterceptorInstance from '@app/components/helpers/AxiosConfig';
import checkTopic from '@app/components/helpers/checkTopic';
import { toast } from 'react-toastify';
import { Modal, Spinner, } from 'react-bootstrap';
interface Company {
    name: string;
    id: string;
}
interface User_offering {
    company_obj: Company;
    username: string;
}
interface User {
    id: string;
    username: string;
}


interface Data_catalog_category {
    code: string;
    name: string;
}

interface Data_catalog_service {
    data_catalog_category_obj: Data_catalog_category;
}

interface Data_catalog_service {
    code: string;
    name: string;
    data_catalog_service_obj: Data_catalog_service;
}
interface Data_catalog_business_object {
    data_catalog_service_obj: Data_catalog_service;
    code: string;
    name: string;
}

interface Data_catalog_data_offerings {
    data_catalog_business_object_obj: Data_catalog_business_object;
    user_offering_obj: User_offering;
    type: string;
    title: string
}

interface Data_catalog_data_requests {
    data_catalog_data_offering_id: string;
    created_on: string;
    data_catalog_data_offerings_obj: Data_catalog_data_offerings;
    comments: string;
    user_obj: User;
    topic_nats_sub: string;
    updating_frequency_nats_sub: number;
    topic_kafka_sub: string;
    updating_frequency_kafka_sub: number;
    id: string;
    status: string;
}

interface ApiResponse {
    data_catalog_data_requests_obj: Data_catalog_data_requests;
}

const EditSubscription = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const [data, setData] = useState<Data_catalog_data_requests | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(() => {
        axiosWithInterceptorInstance.get<ApiResponse>(`/dataset/my_subscriptions/${id}`)
            .then(response => {
                let topicToBeChecked = response.data.data_catalog_data_requests_obj.topic_kafka_sub
                response.data.data_catalog_data_requests_obj.topic_kafka_sub = checkTopic(topicToBeChecked, "Kafka")
                let topicToBeCheckedNats = response.data.data_catalog_data_requests_obj.topic_nats_sub
                response.data.data_catalog_data_requests_obj.topic_nats_sub = checkTopic(topicToBeCheckedNats, "Nats")
                setData(response.data.data_catalog_data_requests_obj);
            })
            .catch(error => {
                console.error('Error fetching media:', error);
            });
    }, []);

    const handleChange = (name: keyof Data_catalog_data_requests, value: string | number) => {
        if ((name === "topic_kafka_sub" || name === "topic_nats_sub") && typeof value === "string") {
            value = checkTopic(value, name === "topic_kafka_sub" ? "Kafka" : "Nats")
        }
        setData(prevData => {
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

    async function saveRequest() {
        try {
            let bodyToSend = { "data_catalog_data_requests": data }
            const response = await axiosWithInterceptorInstance.post('/dataset/my_subscriptions', bodyToSend);
            window.location.href = `mySubscriptions?type=${data?.data_catalog_data_offerings_obj.type}`
        } catch (error) {
            console.error('Error saving data: ', error);
        }
    }

    const DeleteSubscription = async (id: string, type: string) => {
        try {
            setIsLoading(true);
            let response = await axiosWithInterceptorInstance.delete<{ DeleteResponse: boolean }>(`dataset/my_subscriptions?selection-id=${data?.id}`);
            toast.success("The subscription has been successfully deleted")
            if (type === "push") {
                setTimeout(() => window.location.href = `mySubscriptions?type=${type}`, 2500);
            } else {
                setTimeout(() => window.location.href = `mySubscriptions?type=${type}`, 2500);
            }
        } catch (error) {
            toast.error('Error while deleting the subscription')
            console.log(error)
        } finally {
            setIsLoading(false);
        }
        handleClose()
    };

    return (
        <Container fluid>

            <div className="row align-items-center" style={{ paddingBottom: "15px" }}>
                <div className="col-auto">
                    <h2>
                        <b>
                            <i className="fas fa-newspaper nav-icon" style={{ paddingRight: "8px" }}></i>
                            My Subscription
                        </b>
                    </h2>
                </div>

                <div className="col d-flex justify-content-end gap-3">
                    {data?.status !== "accept" && (
                        <Button
                            id="delete-data-button"
                            variant="d"
                            className="btn btn-danger"
                            onClick={handleShow}
                            data-toggle="tooltip"
                            data-placement="top"
                            title="Delete the selected subscription"
                            style={{ marginRight: "10px" }}
                        >
                            Delete subscription
                        </Button>
                    )}
                    {data?.status === "accept" && (
                        <Button
                            id="delete-data-button"
                            variant="d"
                            className="btn btn-danger"
                            onClick={handleShow}
                            data-toggle="tooltip"
                            data-placement="top"
                            title="This subscription has already been accepted, this means that data could be already present"
                            disabled
                            style={{ marginRight: "10px" }}
                        >
                            Delete subscription
                        </Button>
                    )}

                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Deletion of subscription</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Please confirm the deletion of the subscription having the id: "{data?.id}" to the service: "{data?.data_catalog_data_offerings_obj.title}"
                        </Modal.Body>
                        <Modal.Footer>
                            <Button id="close-delete-modal" color="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            {!isLoading && data?.id && <Button id="confirm-delete-button" color="primary" onClick={() => DeleteSubscription(data.id, data?.data_catalog_data_offerings_obj.type)}>Confirm</Button>}
                            {isLoading && data?.id && <Button id="waiting-delete-button" color="primary" onClick={() => DeleteSubscription(data.id, data?.data_catalog_data_offerings_obj.type)} disabled><Spinner animation="border" role="status" size='sm'> </Spinner></Button>}
                        </Modal.Footer>
                    </Modal>
                    <button className="btn btn-primary" onClick={() => saveRequest()} >
                        Save
                    </button>
                </div>
            </div>
            <Card >
                <h3 className="list-group-item-heading" style={{ paddingLeft: "20px", paddingTop: "20px" }}><b>  <i className="fas fa-external-link-alt nav-icon" style={{ paddingRight: "8px" }}> </i> Offered Services</b></h3>
                <h6 style={{ paddingLeft: " 20px" }}>Select Offered Service For This Subscription Request</h6>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="serviceCode">Select offering</Label>
                                    <Form.Control
                                        type="text"
                                        value={data?.data_catalog_data_offering_id}
                                        aria-label="Disabled input example"
                                        readOnly
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>

                                    <Label for="serviceName">Created on</Label>
                                    <Form.Control
                                        type="text"
                                        value={data?.created_on}
                                        aria-label="Disabled input example"
                                        readOnly
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="serviceCode">Business object code</Label>
                                    <Form.Control
                                        type="text"
                                        value={data?.data_catalog_data_offerings_obj.data_catalog_business_object_obj.code}
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
                                        value={data?.data_catalog_data_offerings_obj.data_catalog_business_object_obj.name}
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
                                        value={data?.data_catalog_data_offerings_obj.data_catalog_business_object_obj.data_catalog_service_obj.code}
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
                                        value={data?.data_catalog_data_offerings_obj.data_catalog_business_object_obj.data_catalog_service_obj.name}
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
                                        value={data?.data_catalog_data_offerings_obj.data_catalog_business_object_obj.data_catalog_service_obj.data_catalog_category_obj.code}
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
                                        value={data?.data_catalog_data_offerings_obj.data_catalog_business_object_obj.data_catalog_service_obj.data_catalog_category_obj.name}
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
                                        value={data?.user_obj.id}
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
                                        value={data?.data_catalog_data_offerings_obj.user_offering_obj.username}
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
                                        value={data?.data_catalog_data_offerings_obj.user_offering_obj.company_obj.id}
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
                                        value={data?.data_catalog_data_offerings_obj.user_offering_obj.company_obj.name}
                                        aria-label="Disabled input example"
                                        readOnly
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                </ListGroup>
            </Card>
            {(window as any)["env"]["Nats"] && <Card >
                <h3 className="list-group-item-heading" style={{ paddingLeft: "20px", paddingTop: "20px" }}> <b>NATS parameters</b></h3>
                <h6 className="list-group-item-heading" style={{ paddingLeft: " 20px" }}>Select topic and updating frequency for the NATS plugin</h6>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Row form>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="serviceCode">NATS topic</Label>
                                    <Input type="text" name="topic_nats_sub" id="topic_nats_sub" placeholder="Enter NATS topic" value={data?.topic_nats_sub} onChange={(e) => handleChange('topic_nats_sub', e.target.value)} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="serviceName">Updating Frequency (60 is the default value)</Label>
                                    <Input type="text" name="updating_frequency_nats_sub" id="updating_frequency_nats_sub" value={data?.updating_frequency_nats_sub} onChange={(e) => handleChange('updating_frequency_nats_sub', e.target.value)} />
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
                                    <Input type="text" name="topic_kafka_sub" id="topic_kafka_sub" placeholder="Enter Kafka topic" value={data?.topic_kafka_sub} onChange={(e) => handleChange('topic_kafka_sub', e.target.value)} />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="serviceName">Updating Frequency (60 is the default value)</Label>
                                    <Input type="text" name="updating_frequency_kafka_sub" id="updating_frequency_kafka_sub" value={data?.updating_frequency_kafka_sub} onChange={(e) => handleChange('updating_frequency_kafka_sub', e.target.value)} />
                                </FormGroup>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                </ListGroup>

            </Card>}


            <Card >
                <h3 className="list-group-item-heading" style={{ padding: "10px 20px" }}>Comments</h3>
                <h6 className="list-group-item-heading" style={{ paddingLeft: " 20px" }}>Write comments for service provider</h6>
                <ListGroup variant="flush">

                    <ListGroup.Item><Label for="id" >Comments</Label>

                        <Form.Control
                            type="text"
                            value={data?.comments}
                            aria-label="Disabled input example"
                            readOnly
                        />
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Container>
    );
};

export default EditSubscription;

