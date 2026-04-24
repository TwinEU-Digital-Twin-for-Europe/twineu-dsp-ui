import React, { useState, useEffect } from 'react';
import { Modal, Container, Row, Form } from 'react-bootstrap';
import Pagination from '@app/components/helpers/Pagination';
import axiosWithInterceptorInstance from '@app/components/helpers/AxiosConfig';
interface CategorizeProps {
    show: boolean;
    handleClose: () => void;
    onModalDataChange: (modalName: string, value: modalFilter) => void;
    typeOfService: boolean;
}
interface ITableData {
    cf_topic_kafka_sub: string;
}
interface IFilterValues {
    topic: string;
}
type modalFilter = {
    name: string;
    id: string;
}
const KafkaTopicsSubscriptions: React.FC<CategorizeProps> = ({ show, handleClose, onModalDataChange, typeOfService }) => {
    const [data, setData] = useState<ITableData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filterValues, setFilterValues] = useState<IFilterValues>({
        topic: "",
    });


    const fetchData = async () => {
        let filter = "";
        /* if (expandedFiltersByLevel[0]) {

            filter = `${encodeURIComponent("company_name_grouping")}=${encodeURIComponent(expandedFiltersByLevel[0])}`;
        } */
        if (filterValues.topic) { // filtering by topic name  (Like)
            filter = filterValues.topic;
        }
        try {
            const response = await axiosWithInterceptorInstance.get(`/datalist/kafka_and_nats_topics_sub/page/${currentPage - 1}?cf_topic_kafka_sub_null=''&cf_topic_kafka_sub=${filter}&cf_type=${typeOfService ? "push" : "data"}`);  /*  */
            setData(response.data.listContent);
            setTotalPages(response.data.totalPages);
            setPageSize(response.data.pageSize)
            //setCurrentPage(1);
            //setData(paginatingData());
            //setPageSize(response.data.pageSize)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [filterValues.topic, currentPage, filterValues.topic]);


    useEffect(() => {
        setCurrentPage(1);

    }, [filterValues.topic]); 

    const paginate = (pageNumber: number): void => setCurrentPage(pageNumber);

    const handleFilter = (filter: string, name: string) => {
        var modalObject = {
            name: name,
            id: filter,
        }
        onModalDataChange('cf_topic_kafka_sub', modalObject);
        handleClose();
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.name as keyof IFilterValues;
        const value = e.target.value;
        setFilterValues(prevState => ({ ...prevState, [key]: value }));
        //setCurrentPage(1)
    };

    return (
        <><style type="text/css">
            {`
        .modal-90w {
          max-width: 90% !important;
        }
        `}
        </style>
            <Modal show={show} onHide={handleClose} dialogClassName="modal-90w">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Kafka topics
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid style={{ backgroundColor: '#f4f4f4' }}>
                        <Row>

                            <table className="table table-hover table-striped table-bordered table-sm">
                                <thead>
                                    <tr>

                                        <th className="text-center">#</th>
                                        <th></th>
                                        <th style={{ textAlign: "center", verticalAlign: "middle" }}>topic <button className="btn btn-light text-end" /* onClick={() => ChangingOrder_inside(codeOrdering, "code")} */ style={{ paddingLeft: "10 px", scale: "0.6" }} >
                                            {/* {codeOrdering === "desc" && <i className="fas fa-sort-up"></i>}{codeOrdering === "asc" && <i className="fas fa-sort-down"></i>}{!codeOrdering && <i className="fas fa-sort"></i>} */}
                                        </button></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>{<Form.Control
                                            type="text"
                                            name="topic"
                                            placeholder="topic"
                                            value={filterValues.topic}
                                            onChange={handleInputChange}
                                        />}</td>
                                    </tr>
                                    {data.map((item, index) => (
                                        <tr key={index}>
                                            <th className="text-center" scope="row">{(((currentPage - 1)) * pageSize) + index + 1}</th>
                                            <td className="text-center" style={{ width: '8%' }}> <button className="btn btn-primary" onClick={() => handleFilter(item.cf_topic_kafka_sub, "cf_topic_kafka_sub")}>
                                                +
                                            </button></td>
                                            <td>{item.cf_topic_kafka_sub}</td>
                                            {/* <th scope="row">{(((currentPage - 1)) * pageSize) + index + 1}</th>
                                            <td> <button className="btn btn-primary text-end" onClick={() => handleFilter(item.category_id, item.name)}>
                                                +
                                            </button></td>
                                            <td>{item.cf_topic_kafka_sub}</td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Row>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Pagination totalPages={totalPages} paginate={paginate} currentPage={currentPage} />
                        </div>
                    </Container>
                </Modal.Body>
            </Modal></>
    );
}

export default KafkaTopicsSubscriptions;
