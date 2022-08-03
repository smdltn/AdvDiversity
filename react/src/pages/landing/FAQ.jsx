import { Container, Row, Modal } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import debug from 'sabio-debug';
import * as faqsServices from '../../services/faqsServices';
import toastr from 'toastr';
import Accordion from '../../components/FAQ/Accordion';
import '../../components/FAQ/faq.css';
import Tab from 'react-bootstrap/Tab';
import EmailFAQQuestion from '../../components/FAQ/EmailFAQQuestion';
import Tabs from 'react-bootstrap/Tabs';
import Pagination from 'rc-pagination';
import locale from 'rc-pagination/lib/locale/en_US';
import 'rc-pagination/assets/index.css';
import backgroundimage from '../../components/FAQ/FAQs-scaled.jpg';

const _logger = debug.extend('FAQ');

const FAQ = () => {
    const [faqCategories, setFaqCategories] = useState('showAll');
    const [faqsData, setFaqsData] = useState({
        faqs: [],
        page: { pageIndex: 0, pageSize: 0, totalCount: 0, totalPages: 0 },
    });
    const [buttons, setButtons] = useState();

    useEffect(() => {
        let payload = ['FAQCategories'];
        faqsServices.getLookups(payload).then(onGetLookupSuccess).catch(onGetLookupError);
    }, []);

    const onGetLookupSuccess = (response) => {
        _logger('onGetLookupSuccess', response);
        setButtons((prevState) => {
            let pd = { ...prevState };
            pd = response.data.item.faqCategories;
            return pd;
        });
    };

    const onGetLookupError = (err) => {
        _logger('onSearchBlogCategoriesError...', err);
    };
    const mapTab = (button) => {
        return <Tab eventKey={button.name} title={button.name} key={button.name}></Tab>;
    };

    const onTabTitleClicked = (e) => {
        _logger('Tab Title Clicked...', e);
        setFaqCategories(e);
    };

    useEffect(() => {
        if (faqCategories !== 'showAll') {
            faqsServices
                .getAllFaqByCategoryPaginated(faqCategories, 0, 5)
                .then(onGetFaqByCatSuccess)
                .catch(onGetFaqByCatError);
        } else {
            faqsServices.getAllFaqsPaginated(0, 5).then(ongetAllFaqsPaginatedSuccess).catch(ongetAllFaqsPaginatedError);
        }
    }, [faqCategories]);
    const ongetAllFaqsPaginatedSuccess = (response) => {
        _logger('ongetAllFaqsPaginatedSuccess is firing', response);
        let arrayOfGroups = response.item.pagedItems;
        setFaqsData((prevState) => {
            let pd = { ...prevState };
            pd.faqs = arrayOfGroups;
            pd.page.pageIndex = response.item.pageIndex;
            pd.page.pageSize = response.item.pageSize;
            pd.page.totalCount = response.item.totalCount;
            pd.page.totalPages = response.item.totalPages;

            return pd;
        });
    };
    const ongetAllFaqsPaginatedError = (error) => {
        _logger('ongetAllFaqsPaginatedError is firing...', error);
    };

    const onGetFaqByCatSuccess = (data) => {
        _logger('onGetFaqByCatSuccess is firing....', data);
        let arrayOfGroups = data.item.pagedItems;
        setFaqsData((prevState) => {
            let pd = { ...prevState };
            pd.faqs = arrayOfGroups;
            pd.page.pageIndex = data.item.pageIndex;
            pd.page.pageSize = data.item.pageSize;
            pd.page.totalCount = data.item.totalCount;
            pd.page.totalPages = data.item.totalPages;

            return pd;
        });
    };
    const onGetFaqByCatError = (error) => {
        _logger(error);
        toastr.error(error);
    };
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
        setModalOpen(() => {
            return true;
        });
    };
    const closeModal = () => {
        setModalOpen(() => {
            return false;
        });
    };
    const hideModal = () => {
        setModalOpen(() => {
            return false;
        });
    };

    const [lastPage, setLastPage] = useState(false);
    const onChange = (currentPage) => {
        if (currentPage === faqsData.page.totalPages) {
            setLastPage(true);
        } else {
            setLastPage(false);
        }
        if (faqCategories !== 'showAll') {
            faqsServices
                .getAllFaqByCategoryPaginated(faqCategories, currentPage - 1, faqsData.page.pageSize)
                .then(onGetFaqByCatSuccess)
                .catch(onGetFaqByCatError);
        } else {
            faqsServices
                .getAllFaqsPaginated(currentPage - 1, faqsData.page.pageSize)
                .then(ongetAllFaqsPaginatedSuccess)
                .catch(ongetAllFaqsPaginatedError);
        }
    };
    return (
        <React.Fragment>
            <Modal show={modalOpen} onHide={hideModal} transparent={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Email us your question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EmailFAQQuestion modalState={closeModal} />
                </Modal.Body>
            </Modal>
            <section className="py-5">
                <Container>
                    <Row>
                        <div
                            className="faq-container"
                            style={{
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                                height: '25vh',
                                backgroundImage: `url(${backgroundimage})`,
                            }}>
                            <h1>Frequently Asked Questions</h1>
                            {false && (
                                <button type="button" className="btn btn-success btn-sm mt-2" onClick={openModal}>
                                    Email us your question
                                </button>
                            )}
                        </div>
                    </Row>
                    <div className="container mt-3" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            onChange={onChange}
                            current={faqsData.page.pageIndex + 1}
                            total={faqsData.page.totalCount}
                            locale={locale}
                            pageSize={5}
                            disabled={faqsData.page.totalPages === 1}
                        />
                    </div>
                    <Tab.Container>
                        <div className="mb-2 button-font tab mt-2">
                            <Tabs onSelect={onTabTitleClicked}>
                                <Tab eventKey="showAll" title="All"></Tab>
                                {buttons?.map(mapTab)}
                            </Tabs>
                        </div>
                        <Tab.Content>
                            <Accordion
                                arrayOfFaqs={faqsData.faqs}
                                tabTitle={buttons}
                                state={faqCategories}
                                activateModal={openModal}
                                isLastPage={lastPage}
                            />
                        </Tab.Content>
                    </Tab.Container>
                </Container>
            </section>
        </React.Fragment>
    );
};

export default FAQ;
