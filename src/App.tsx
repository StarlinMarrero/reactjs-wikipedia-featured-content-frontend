import { useEffect, useRef, useState } from "react";
import "./App.css";
import Card from "./components/Card/Card";
import Button from "./components/button/Button";
import dateFeedFilter from "./helpers/dateFeedFilter.helper";
import { useGetFeedQuery } from "./redux/rtk-query/feed";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import RootLayout from "./components/Layouts/RootLayout";
function App() {
    const dateYesterday = new Date();
    dateYesterday.setDate(dateYesterday.getDate() - 1);

    const [selectedDate, setSelectedDate] = useState(dateYesterday);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const { data: dataFeeds, isFetching } = useGetFeedQuery({
        date: dateFeedFilter(selectedDate),
        lang: "es",
    });
    const [dataToShow, setDataToShow] = useState(dataFeeds?.mostread?.articles || []);

    const loader = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            console.log(`🚨 - observer - entries:`, entries);
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

    useEffect(() => {
        setDataToShow(dataFeeds?.mostread?.articles || []);
    }, [dataFeeds]);

    useEffect(() => {
        if (page >= 1) {
            const newData = dataFeeds?.mostread?.articles?.slice(0, page * pageSize);
            setDataToShow(newData || []);
        }
    }, [page]);

    return (
        <>
            <RootLayout>
                <h1>Wikipedia Feeds</h1>
                <div className="d-flex justify-content-end mt-2 mb-3 row">
                    <div className="col-3">
                        <DatePicker className="form-control" selected={selectedDate} onChange={handleDateChange} />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {dataToShow?.map((feed, index) => {
                        return (
                            <div className="col-span-auto">
                                <Card
                                    className="h-100"
                                    key={index}
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
                                        <Button>
                                            <a
                                                style={{
                                                    color: "#fff",
                                                    textDecoration: "none",
                                                }}
                                                href={`https://en.wikipedia.org/wiki/${feed.normalizedtitle}`}
                                                target="_blank"
                                                rel="noreferrer">
                                                Read more
                                            </a>
                                        </Button>
                                    }>
                                    <h5 className="card-title">{feed.normalizedtitle}</h5>
                                    <p className="line-clamp-2">{feed.description}</p>
                                    {/* <div dangerouslySetInnerHTML={{ __html: `${feed.extract_html}` }}></div> */}
                                </Card>
                            </div>
                        );
                    })}
                </div>
                <div ref={loader} style={{ marginTop: "20px", textAlign: "center" }}>
                    {isFetching && <p>Loading...</p>}
                </div>
            </RootLayout>
        </>
    );
}

export default App;
