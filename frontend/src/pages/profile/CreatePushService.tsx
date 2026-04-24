import { Container, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { useLocation } from 'react-router-dom';
import React, { useState, ChangeEvent } from 'react';
import BusinnesObject from '../modals/BusinnesObject_CreateService';
import { toast } from 'react-toastify';
import axiosWithInterceptorInstance from '@app/components/helpers/AxiosConfig';
import checkTopic from '@app/components/helpers/checkTopic';

//classe modificata da Pasquale 
// aggiunto nella interfaccia e nei valori di default i campi type e push_uri e messo stampe per capire la richiesta /my_offered/service come va 
interface User_1_1 {
  id: string;
  email: string;
  username: string;
}

interface DataCatalogCategory {
  code: string;
  name: string;
  id: string;
  short_order: string;
}

interface DataCatalogService {
  short_description: string;
  data_catalog_category_id: string;
  code: string;
  name: string;
  id: string;
  short_order: string;
  data_catalog_category: DataCatalogCategory;
}

interface DataCatalogBusinessObject {
  file_schema_filename: string;
  file_schema: string;
  code: string;
  data_catalog_service_id: string;
  file_schema_sample: string;
  profile_selector: string;
  name: string;
  id: string;
  data_catalog_service: DataCatalogService;
  profile_description: string;
  file_schema_sample_filename: string;
  short_order: string;
}

interface Company {
  modified_on: string;
  address: string;
  created_on: string;
  phone: string;
  modified_by: string;
  name: string;
  description: string;
  id: string;
  created_by: string;
}

interface User {
  sidebar_menu_id: string;
  provider_appdata_url: string;
  provider_user_id: string;
  broker_url: string;
  provider_fiware_url: string;
  short_order: string;
  enabled: string;
  header_menu_id: string;
  ecc_url: string;
  password: string;
  search_nav_command: string;
  provider: string;
  consumer_fiware_url: string;
  company: Company;
  id: string;
  email: string;
  modified_on: string;
  current_language_id: string;
  login_nav_command: string;
  company_id: string;
  created_by: string;
  created_on: string;
  modified_by: string;
  default_language_id: string;
  is_onenet: string;
  dateformat: string;
  ed_api_url: string;
  status: string;
  username: string;
  data_app_url: string;
}
interface DataCatalogDataOfferings {
  id: null;
  file_schema_filename: string;
  active_from_enable: number;
  active_to_enable: number;
  file_schema: string;
  comments: string;
  input_data_source: string;
  input_profile: string;
  profile_description: string;
  file_schema_sample_filename: string;
  created_by: string;
  user_1_1: User_1_1;
  data_catalog_business_object_id: string;
  created_on: string;
  file_schema_sample: string;
  profile_selector: string;
  modified_by: string;
  data_catalog_business_object: DataCatalogBusinessObject;
  user: User;
  title: string;
  active_to: string;
  active_from: string;
  status: string;
  type: string;
  push_uri: string;
  topic: string;
  updating_frequency: number;
  topic_kafka: string;
  updating_frequency_kafka: number;
  push_security_type: string;
  push_security_field1: string;
  push_security_field2: string;
  push_security_addingto: string;
}


const CreatePushService = () => {
  const formatDateFromData = (dateString: string): string => {
    let formattedDate = dateString.replace(' ', 'T').slice(0, 16);
    return formattedDate;
  }
  const data_catalog_data_offerings: DataCatalogDataOfferings = {
    active_from_enable: 0,
    active_to_enable: 0,
    status: "active",
    id: null,
    file_schema_filename: "",
    file_schema: "",
    comments: "",
    input_data_source: "",
    input_profile: "",
    profile_description: "",
    file_schema_sample_filename: "",
    created_by: "",
    user_1_1: {
      id: "",
      email: "",
      username: ""
    },
    data_catalog_business_object_id: "",
    created_on: "",
    file_schema_sample: "",
    profile_selector: "",
    modified_by: "",
    data_catalog_business_object: {
      file_schema_filename: "",
      file_schema: "",
      code: "",
      data_catalog_service_id: "",
      file_schema_sample: "",
      profile_selector: "",
      name: "",
      id: "",
      data_catalog_service: {
        short_description: "",
        data_catalog_category_id: "",
        code: "",
        name: "",
        id: "",
        short_order: "",
        data_catalog_category: {
          code: "",
          name: "",
          id: "",
          short_order: ""
        }
      },
      profile_description: "",
      file_schema_sample_filename: "",
      short_order: ""
    },
    user: {
      sidebar_menu_id: "",
      provider_appdata_url: "",
      provider_user_id: "",
      broker_url: "",
      provider_fiware_url: "",
      short_order: "",
      enabled: "",
      header_menu_id: "",
      ecc_url: "",
      password: "",
      search_nav_command: "",
      provider: "",
      consumer_fiware_url: "",
      company: {
        modified_on: "",
        address: "",
        created_on: "",
        phone: "",
        modified_by: "",
        name: "",
        description: "",
        id: "",
        created_by: ""
      },
      id: "",
      email: "",
      modified_on: "",
      current_language_id: "",
      login_nav_command: "",
      company_id: "",
      created_by: "",
      created_on: "",
      modified_by: "",
      default_language_id: "",
      is_onenet: "",
      dateformat: "",
      ed_api_url: "",
      status: "",
      username: "",
      data_app_url: ""
    },
    title: '',
    active_to: buildDefaultActiveTo(),
    active_from: new Date().toISOString(),
    type: "push",
    push_uri: "",
    topic: "",
    topic_kafka: "",
    updating_frequency: 60,
    updating_frequency_kafka: 60,
    push_security_type: "NO-AUTH",
    push_security_field1: "",
    push_security_field2: "",
    push_security_addingto: "",

  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const [data, setData] = useState<DataCatalogDataOfferings | null>(data_catalog_data_offerings);
  const [modalStates, setModalStates] = useState({
    BOModal: false
  });
  const [alreadyUriAdvised, setAlreadyUriAdvised] = useState(false);
  const [alreadySecurityAdvised, setAlreadySecurityAdvised] = useState(false);

  const [cardElements, setCardElements] = useState({
    businnesObjectName: "",
    serviceCode: "",
    serviceName: "",
    categoryCode: "",
    categoryName: "",
  });
  const [filterValuesFromModals, setFilterValuesFromModals] = useState({
    catalog_business_object_id: ""
  });

  function buildDefaultActiveTo() {
    let today = new Date();
    let activeTo = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)
    return activeTo.toISOString()
  }

  async function saveRequest() {
    if (!data?.title || !data?.data_catalog_business_object_id) {
      toast.error('Please fill out all required fields(*).');
      return;
    }

    if (!data?.push_uri && !alreadyUriAdvised) {
      toast.warning("You did not provide the push uri, if you want to proceed please save it again", { autoClose: false })
      setAlreadyUriAdvised(true)
      return
    }

    if ((!data?.push_security_field1 || !data?.push_security_field2) && data.push_security_type !== "NO-AUTH" && !alreadySecurityAdvised) {
      toast.warning(`You did not provide the push security fields for ${data?.push_security_type} authentication, if you want to proceed please save it again`, { autoClose: false })
      setAlreadySecurityAdvised(true)
      return
    }
    try {
      let requestBody = {
        data_catalog_data_offerings: data
      }
      if (data.push_security_type !== "NO-AUTH") {
        const cryptedPassword = await axiosWithInterceptorInstance.get(`custom-query/data-objects/encrypt-password?password=${String(data.push_security_field2)}`)
        requestBody = {
          data_catalog_data_offerings: {
            ...data,
            push_security_field2: cryptedPassword.data[0].encrypted_password
          }
        };
      }
      const response = await axiosWithInterceptorInstance.post('/dataset/my_offered_services', requestBody);
      window.location.href = 'myOfferedServices?type=push'
    } catch (error) {
      toast.error(`Error creating the push service: ${error}`);
      return;
    }
  }


  function handleSelect(value: string) {
    if (data) {
      setData({
        ...data,
        profile_selector: value
      });
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const formattedDate = (date.toISOString()).replace(/\.(\d{3})Z$/, ".000000Z")
    return formattedDate;
  };

  const handleDateChangeActiveFrom = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (data) {
      const formattedActiveFrom = (formatDate(newValue));

      setData({
        ...data,
        active_from: formattedActiveFrom,
        //active_from_enable: "1"
      });
    }
  }

  const handleDateChangeActiveTo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (data) {
      const formattedActive_to = (formatDate(newValue));
      setData({
        ...data,
        active_to: formattedActive_to,
        //active_to_enable: "1"
      });
    };
  }
  const handleActiveFromEnableChange = () => {
    setData(prevData => {
      if (!prevData) return null;
      return {
        ...prevData,
        active_from_enable: prevData.active_from_enable === 0 ? 1 : 0
      };
    });
  };

  const handleActiveToEnableChange = () => {
    setData(prevData => {
      if (!prevData) return null;
      return {
        ...prevData,
        active_to_enable: prevData.active_to_enable === 0 ? 1 : 0
      };
    });
  };
  const handleFileSchemaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && data) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.replace(/^data:.+;base64,/, 'data:text/plain;base64,');
        setData({
          ...data,
          file_schema_filename: file.name,
          file_schema: base64Data
        });
      };
      reader.onerror = (error) => {
        console.error('Error: ', error);
      };
    }
  };

  const handleFileSchemaSampleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file && data) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.replace(/^data:.+;base64,/, 'data:text/plain;base64,');
        setData({
          ...data,
          file_schema_sample: base64Data,
          file_schema_sample_filename: file.name
        });
      };
      reader.onerror = (error) => {
        console.error('Error: ', error);
      };
    }
  };
  const handleOpenModal = (modalName: string) => {
    setModalStates({ ...modalStates, [modalName]: true });
  };

  const handleCloseModal = (modalName: string) => {
    setModalStates({ ...modalStates, [modalName]: false });
  };
  const handleModalDataChange = (modalName: string, value: string[]) => {
    if (data) {
      setData({
        ...data,
        data_catalog_business_object_id: value[0],
      });

      setCardElements({
        serviceCode: value[1],
        serviceName: value[2],
        categoryCode: value[3],
        categoryName: value[4],
        businnesObjectName: value[5],
      })

    }
  };

  const handleChange = (name: keyof DataCatalogDataOfferings, value: string | number) => {
    if ((name === "topic_kafka" || name === "topic") && typeof value === "string") {
      value = checkTopic(value, name === "topic_kafka" ? "Kafka" : "Nats")
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

  return (
    <Container fluid>
      <div className='row' style={{ paddingBottom: "15px" }}>
        <div className='col-7'>
          <h2> <b><i className="fas fa-external-link-alt nav-icon" style={{ paddingRight: "8px" }}></i> Offered Service</b></h2>
          <h5>Create a new Data Offering</h5>
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
        <h3 className="list-group-item-heading" style={{ paddingLeft: "20px", paddingTop: "20px" }}> <b>Basic information</b></h3>

        <ListGroup variant="flush">
          <ListGroup.Item><Label for="id">ID</Label>
            <Input type="text" name="id" id="id" disabled /></ListGroup.Item>

          <ListGroup.Item><Label for="title">Title*</Label>
            <Input type="text" name="title" id="title" value={data?.title} onChange={(e) => handleChange('title', e.target.value)} /></ListGroup.Item>
          <ListGroup.Item><Label for="title">Push URI</Label>
            <Input type="text" name="pushuri" id="pushuri" value={data?.push_uri} onChange={(e) => handleChange('push_uri', e.target.value)} /></ListGroup.Item>
        </ListGroup>
      </Card>
      {data?.type === "push" && data?.push_uri && <Card >
        <h3 className="list-group-item-heading" style={{ paddingLeft: "20px", paddingTop: "20px" }}><b>Authentication for Push Services Rest API</b></h3>
        <h6 style={{ paddingLeft: " 20px" }}>Setup the Authentication for the rest API, by default it is NO-AUTH</h6>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Row form>
              <Col md={6}>
                <Label for="id">Type of Authentication</Label>
                <Dropdown drop='down' data-bs-toggle="tooltip" data-placement="down" title="Select the column to display:">
                  <Dropdown.Toggle id="push-auth-type" className="d-inline-flex align-items-center">
                    <div className="value">{data.push_security_type}</div>
                    {(data.push_security_type === null || data.push_security_type === "") && <div className="value">Please select the authentication type</div>}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleChange("push_security_type", "NO-AUTH")}>NO-AUTH</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleChange("push_security_type", "BASIC")}>BASIC</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleChange("push_security_type", "API-KEY")}>API-KEY</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              {(data.push_security_type === "API-KEY" || data.push_security_type === "BASIC") && <Col md={6}>
                <Label for="id">Adding to</Label>
                <Dropdown drop='down' data-bs-toggle="tooltip" data-placement="down" title="Select the column to display:">
                  <Dropdown.Toggle id="push-addingto" className="d-inline-flex align-items-center">
                    <div className="value">{data.push_security_addingto}</div>
                    {(data.push_security_addingto === null || data.push_security_addingto === "") && <div className="value">Please select the adding to parameter</div>}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleChange("push_security_addingto", "HEADER")}>HEADER</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleChange("push_security_addingto", "QUERY-PARAMS")}>QUERY-PARAMS</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>}
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row form>
              {data.push_security_type === "BASIC" && <Col md={6}>
                <FormGroup>
                  <Label for="Username">Username</Label>
                  <Input type="text" name="Username" id="Username" placeholder={"Please insert the username"} value={data?.push_security_field1} onChange={(e) => handleChange('push_security_field1', e.target.value)} />
                </FormGroup>
              </Col>}
              {data.push_security_type === "API-KEY" && <Col md={6}>
                <FormGroup>
                  <Label for="Key">Key</Label>
                  <Input type="text" name="Key" id="Key" placeholder={"Please insert the key"} value={data?.push_security_field1} onChange={(e) => handleChange('push_security_field1', e.target.value)} />
                </FormGroup>
              </Col>}

              {data.push_security_type === "BASIC" && <Col md={6}>
                <FormGroup>
                  <Label for="Password">Password</Label>
                  <Input type="password" name="Password" id="Password" placeholder={"Please insert the password"} value={data?.push_security_field2} onChange={(e) => handleChange('push_security_field2', e.target.value)} />
                </FormGroup>
              </Col>}
              {data.push_security_type === "API-KEY" && <Col md={6}>
                <FormGroup>
                  <Label for="Value">Value</Label>
                  <Input type="password" name="Value" id="Value" placeholder={"Please insert the value"} value={data?.push_security_field2} onChange={(e) => handleChange('push_security_field2', e.target.value)} />
                </FormGroup>
              </Col>}
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Card>}

      <Card >
        <h3 className="list-group-item-heading" style={{ paddingLeft: "20px", paddingTop: "20px" }}> <b>Business object*</b></h3>
        <h6 className="list-group-item-heading" style={{ paddingLeft: " 20px" }}>Select Business Object For This Data Offering</h6>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <button onClick={() => handleOpenModal('BOModal')} className="btn btn-outline-secondary" type="button" id="button-addon1">
              <i className="fas fa-search nav-io"></i>
              Business object:  {!cardElements.businnesObjectName && "please select one option"} {cardElements.businnesObjectName}
            </button>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="serviceCode">Service Code</Label>
                  <Input type="text" name="serviceCode" id="serviceCode" value={cardElements.serviceCode} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="serviceName">Service Name</Label>
                  <Input type="text" name="serviceName" id="serviceName" value={cardElements.serviceName} />
                </FormGroup>
              </Col>
            </Row>
          </ListGroup.Item>
          <ListGroup.Item>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="serviceCode">Category code</Label>
                  <Input type="text" name="categoryCode" id="categoryCode" value={cardElements.categoryCode} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="serviceName">Category Name</Label>
                  <Input type="text" name="categoryName" id="categoryName" value={cardElements.categoryName} />
                </FormGroup>
              </Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Card>
      <Card >
        <h3 className="list-group-item-heading" style={{ paddingLeft: "20px", paddingTop: "20px" }}><b>Date Restrictions</b></h3>
        <h6 style={{ paddingLeft: " 20px" }}>On This Section You Can Restrict Access At A Specific Date Time Range For Service.</h6>
        <ListGroup variant="flush">
          <ListGroup.Item>
            {data && <Row form>
              <Col >
                <FormGroup>
                  <Label for="serviceCode">Active from </Label>
                  <Input type="datetime-local" name="activeFrom" id="activeFrom" placeholder={formatDateFromData(data?.active_from)} onChange={handleDateChangeActiveFrom} />
                </FormGroup>
              </Col>
              <Col md={3} className="d-flex justify-content-center align-items-center">
                <FormGroup check className="d-flex align-items-center justify-content-md-center mb-0">
                  <Label check className="mb-0">
                    <Input
                      type="checkbox"
                      checked={data.active_from_enable === 1}
                      onChange={handleActiveFromEnableChange}
                    />
                    {' '}The service is valid from the date
                  </Label>
                </FormGroup>
              </Col>

            </Row>}


            {data && <Row form>
              <Col >
                <FormGroup >
                  <Label for="serviceCode">Active to</Label>
                  <Input type="datetime-local" name="activeTo" id="activeTo" placeholder={formatDateFromData(data?.active_to)} onChange={handleDateChangeActiveTo} />
                </FormGroup >
              </Col>
              <Col md={3} className="d-flex justify-content-center align-items-center">
                <FormGroup check className="d-flex align-items-center justify-content-md-center mb-0">
                  <Label check className="mb-0">
                    <Input
                      type="checkbox"
                      checked={data.active_to_enable === 1}
                      onChange={handleActiveToEnableChange}
                    />
                    {' '}The service is valid until the date
                  </Label>
                </FormGroup>
              </Col>
            </Row>}

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
                  <Input type="text" name="topic" id="topic" placeholder="Enter NATS topic" value={data?.topic} onChange={(e) => handleChange('topic', e.target.value)} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="serviceName">Updating Frequency (60 is the default value)</Label>
                  <Input type="text" name="updating_frequency" id="updating_frequency" placeholder="Enter updating frequency" value={data?.updating_frequency} onChange={(e) => handleChange('updating_frequency', e.target.value)} />
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
                  <Input type="text" name="topic_kafka" id="topic_kafka" placeholder="Enter Kafka topic" value={data?.topic_kafka} onChange={(e) => handleChange('topic_kafka', e.target.value)} />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="serviceName">Updating Frequency (60 is the default value)</Label>
                  <Input type="text" name="updating_frequency_kafka" id="updating_frequency_kafka" placeholder="Enter updating frequency" value={data?.updating_frequency_kafka} onChange={(e) => handleChange('updating_frequency_kafka', e.target.value)} />
                </FormGroup>
              </Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>

      </Card>}

      <Card >
        <h3 className="list-group-item-heading" style={{ paddingLeft: "20px", paddingTop: "20px" }}> <b>Semantic Definition</b> </h3>
        <ListGroup variant="flush">
          <ListGroup.Item><Label for="fileSchema">File schema</Label>
            <Input
              type="file"
              name="fileSchema"
              id="fileSchema"
              onChange={handleFileSchemaChange}
              placeholder="Enter File"
            />


          </ListGroup.Item>
          <ListGroup.Item><Label for="id">File schema Sample</Label>
            <Input
              type="file"
              name="fileSchemaSample"
              id="fileSchemaSample"
              onChange={handleFileSchemaSampleChange}
              placeholder="Enter File"
            />


          </ListGroup.Item>
          <ListGroup.Item>
            <Dropdown drop='up'>
              <Dropdown.Toggle id="dropdown-basic" >
                Profile Format: {data?.profile_selector}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item >------</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelect('Xml')}>Xml</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelect('Json Ld')}>Json Ld</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelect('Json')}>Json</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSelect('Csv')}>Csv</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

          </ListGroup.Item>
          <ListGroup.Item><Label for="id">Profile Description</Label>
            <Input type="text" name="profileDescription" id="profileDescription" placeholder="Enter Profile Description" onChange={(e) => handleChange('profile_description', e.target.value)} />
          </ListGroup.Item>
        </ListGroup>
      </Card>

      {modalStates.BOModal && (
        <BusinnesObject
          show={modalStates.BOModal}
          handleClose={() => handleCloseModal('BOModal')}
          onModalDataChange={handleModalDataChange}
        />
      )}

    </Container>
  );
};

export default CreatePushService;