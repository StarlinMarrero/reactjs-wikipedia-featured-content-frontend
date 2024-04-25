import { useEffect, useRef, useState } from "react";
import "./App.css";
import Card from "./components/Card/Card";
import Button from "./components/Button/Button";
import dateFeedFilter from "./helpers/dateFeedFilter.helper";
import { useGetFeedQuery } from "./redux/rtk-query/feed";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RootLayout from "./components/Layouts/RootLayout";
import Tab from "./components/Tab/Tab";
import Modal from "./components/Modal/Modal";
import { EnumLanguage, Tfa, TypeLanguage } from "./redux/rtk-query/feed/feed.interfaces";
import DetailsArticleModal from "./components/pages/home/DetailsArticleModal";
import localStorageHelper from "./helpers/localStorage.helper";
import Spinner from "./components/Spinner/Spinner";
import Dropdown from "./components/Dropdown/Dropdown";

function App() {
    const dateYesterday = new Date();
    // dateYesterday.setDate(dateYesterday.getDate() - 1);

    const [selectedDate, setSelectedDate] = useState(dateYesterday);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [isOpenModalDetails, setIsOpenModalDetails] = useState(false);
    const [detailsToShowArticle, setDetailsToShowArticle] = useState<Partial<Tfa>>({});
    const [languageSelected, setLanguageSelected] = useState<TypeLanguage>("en");

    const [listSeenTfa, setListSeenTfa] = useState(localStorageHelper.getItem("feed-seen-list") || []);

    const {
        data: dataFeeds,
        isFetching,
        refetch,
    } = useGetFeedQuery({
        date: dateFeedFilter(selectedDate),
        lang: languageSelected,
    });

    const [mostReadArticles, setMostReadArticles] = useState(dataFeeds?.mostread?.articles || []);

    const loader = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isFetching) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => {
            if (loader.current) {
                observer.unobserve(loader.current);
            }
        };
    }, [loader, isFetching]);

    const handleDateChange = (date: Date | null, event: React.SyntheticEvent<any, Event> | undefined) => {
        setSelectedDate(date as Date);
        setPage(1);
    };

    const handleDetails = (feed: Tfa) => {
        setIsOpenModalDetails(!isOpenModalDetails);
        setDetailsToShowArticle(feed);
        setListSeenTfa([...listSeenTfa, feed]);
    };

    useEffect(() => {
        localStorageHelper.setItem("feed-seen-list", listSeenTfa);
    }, [listSeenTfa]);

    useEffect(() => {
        if (dataFeeds?.mostread?.articles) {
            const newData = dataFeeds?.mostread?.articles?.slice(0, page * pageSize);
            setMostReadArticles(newData || []);
        }
    }, [page, dataFeeds]);

    return (
        <>
            <RootLayout>
                <div className="mb-3">
                    <Card className="w-full h-full p-6 bg-base-100 text-center">
                        <div>
                            <h3 className="text-2xl">Welcome to Wikipedia Feeds</h3>
                            <p className="line-clamp-2">Wikipedia Feeds is a web application that allows you to see the most read articles and the events that happened on this day in history.</p>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="mt-2">
                                <span className="mr-2">
                                    <i className="fas fa-calendar-alt"></i>
                                </span>
                                <DatePicker className="input input-bordered w-full max-w-xs" selected={selectedDate} onChange={handleDateChange} />
                            </div>
                            <div className="col-span-1">
                                <span className="mr-2">
                                    <i className="fas fa-language"></i>
                                </span>
                                <Dropdown
                                    title={`Language - ${Object.entries(EnumLanguage).find((item) => item[1] === languageSelected)?.[0] || "en"}`}
                                    items={[
                                        Object.entries(EnumLanguage).map((item) => {
                                            const key = item[0];
                                            const value = item[1];
                                            return (
                                                <a
                                                    key={key}
                                                    href="#"
                                                    className="dropdown-item"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setLanguageSelected(value);
                                                    }}>
                                                    {key}
                                                </a>
                                            );
                                        }),
                                    ]}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
                {isFetching ? (
                    <div className="flex justify-center items-center h-full w-full">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <Tab
                        handleTabChangeCallback={() => {
                            setPage(1);
                        }}
                        tabs={[
                            {
                                title: "Most Read",
                                content: (
                                    <div className="grid lg:grid-cols-3 mt-2 md:grid-cols-2 grid-cols-1 gap-4 xl:grid-cols-4">
                                        {mostReadArticles?.map((feed, index) => (
                                            <div key={index} className="flex flex-col">
                                                <Card
                                                    // className="w-full h-full p-6 bg-base-100 shadow-xl mt-6"
                                                    //make diferent the card when is seen
                                                    className={`w-full h-full p-6 bg-base-100 shadow-xl mt-6 ${listSeenTfa.find((seen) => seen.title === feed.title) ? "bg-base-300 opacity-50" : ""}`}
                                                    imgSrc={feed.thumbnail?.source}
                                                    imgStyle={{
                                                        height: "100px",
                                                        objectFit: "cover",
                                                        opacity: 0.8,
                                                    }}
                                                    style={{
                                                        width: "18rem",
                                                        margin: "0 auto",
                                                    }}
                                                    footer={
                                                        <>
                                                            <Button styleType="btn-info" className="btn btn-sm btn-info" onClick={() => handleDetails(feed)}>
                                                                Details
                                                            </Button>
                                                        </>
                                                    }>
                                                    <h5 className="card-title">{feed.normalizedtitle}</h5>
                                                    <p className="line-clamp-2">{feed.description}</p>
                                                </Card>
                                            </div>
                                        ))}
                                    </div>
                                ),
                            },
                        ]}></Tab>
                )}
                <Modal
                    isOpen={isOpenModalDetails}
                    onClose={() => {
                        setIsOpenModalDetails(!isOpenModalDetails);
                        setDetailsToShowArticle({});
                    }}>
                    <DetailsArticleModal data={detailsToShowArticle} />
                </Modal>
                <div ref={loader} className="h-full mt-10"></div>
            </RootLayout>
        </>
    );
}

export default App;
