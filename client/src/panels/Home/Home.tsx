import React, {FC} from 'react';
import Panel from "../../components/Panel/Panel";
import HomeBackground from "./components/HomeBackground/HomeBackground";
import Header from "./components/Header/Header";
import BottomLayout from "../../components/BottomLayout/BottomLayout";
import Pattern from "../../components/Pattern/Pattern";
import TabBar from "../../components/TabBar/TabBar";
import Div from "../../components/Div/Div";
import CoinsButton from "./components/CoinsButton/CoinsButton";
import Spacing from "../../components/Spacing/Spacing";
import DropGameBanner from "./components/DropGameBanner/DropGameBanner";
import Score from "./components/Score/Score";

const Home: FC = () => {

    return (
        <Panel>
            <HomeBackground/>
            <Pattern/>

            <Header/>

            {/*<Spacing size={24} />

            <MyTeamButton />*/}

            <Spacing size="calc((100vh - 500px - 80px) / 2)"/>

            <div
                style={{
                    textAlign: "center",
                    backgroundColor: "var(--background_color)",
                    padding: "16px 32px",
                    width: 'max-content',
                    borderRadius: "16px",
                    margin: "0 auto",
                }}
            >
                <h3 style={{  }}>PRE MARKET</h3>
                <p style={{ fontSize: 12, marginTop: 8, color: '#c7c7c7' }}>🪙 10M GCoin ≈ 33$</p>
                <p style={{ fontSize: 12, color: '#c7c7c7' }}>🎫 1 Ticket ≈ 6M GCoin</p>
            </div>

            <Spacing/>
            <Score/>

            <BottomLayout>
                <Div>
                    <DropGameBanner/>
                    <Spacing size={24}/>
                    <CoinsButton/>
                </Div>

                <Spacing/>
                <TabBar/>
            </BottomLayout>
        </Panel>
    );
};

export default Home;