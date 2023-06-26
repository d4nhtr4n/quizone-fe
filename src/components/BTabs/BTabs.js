import { TabPane } from "react-bootstrap";
import Tabs from "react-bootstrap/Tabs";
import classNames from "classnames/bind";
import "./CustomBTabs.scss";

import style from "./BTabs.module.scss";

const cx = classNames.bind(style);

function BTabs({ tabs }) {
    return (
        <div className={"btab-custom"}>
            {tabs && (
                <Tabs defaultActiveKey="0" className="mb-3 " variant="pills">
                    {tabs.map((tab, index) => (
                        <TabPane
                            eventKey={index}
                            key={index}
                            title={tab.title}
                            unmountOnExit={true}
                            className={cx("tab-panel")}
                        >
                            {tab.content}
                        </TabPane>
                    ))}
                </Tabs>
            )}
        </div>
    );
}

export default BTabs;
