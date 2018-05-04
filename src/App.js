import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import CrashpadCard from "./components/CrashpadCard";

import { Card, Grid, List, Button, Modal, Image } from "semantic-ui-react";
import PAD_DATA from "./crashpaddata";
import FacebookLogin from "react-facebook-login";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSecretModal: false,
      secretData: false,
      email: "",
      showFAQ: false,
      showAgreement: false
    };
  }

  amenitiesMaker(list) {
    let content = list.map(li => <li>{li}</li>);
    return <ul className="desc_list">{content}</ul>;
  }

  cardMaker() {
    var ret = PAD_DATA.map(pad => (
      <Grid.Row>
        <CrashpadCard
          image={pad.image}
          photosURL={pad.photosURL}
          name={pad.name}
          nightly={pad.nightly}
          meta={pad.subtitle}
          content={this.amenitiesMaker(pad.amenities)}
        />
      </Grid.Row>
    ));
    return (
      <Card.Group stackable doubling>
        {ret}
      </Card.Group>
    );
  }

  responseFacebook(response) {
    console.log(response);
    if (response && response.accessToken) {
      axios
        .get(
          "https://mk9d81dhcj.execute-api.us-east-2.amazonaws.com/prod/getPrivateCrashpadResources?token=" +
            response.accessToken
        )
        .then(secrets => {
          this.setState({ secretData: secrets.data, email: secrets.email });
        });
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div>
            <Image
              src={"logo3.png"}
              height={160}
              centered

              //width={}
            />
          </div>
          <h2>Flowernet Crashpads</h2>
          <p>- Your home away from home -</p>

          <div>
            <Button
              content="FAQ"
              onClick={() => window.open("faq.html", "_self")}
              circular
              color="blue"
            />
            <Button
              content="Agreement"
              circular
              color="blue"
              onClick={() =>
                window.open(
                  "https://javascriptfun.neocities.org/flowernet/agreement.html",
                  "_new"
                )
              }
            />
          </div>
        </div>

        <div className="sell_blurb">
          <List>
            <List.Item>Weekly cleaning service</List.Item>
            <List.Item>Free coffee, rice, oatmeal</List.Item>
            <List.Item>Washer & dryer in unit (w/ detergent)</List.Item>
            <List.Item>Full kitchen - 2 refrigerators</List.Item>
            <List.Item>Thick pillowtop mattresses</List.Item>
            <List.Item>
              Ample storage for clothing, food, and toiletries
            </List.Item>
            <List.Item>SFO via hotel shuttle ($1), city bus ($2)</List.Item>
            <List.Item>24hr Pool, hot tub, aerobics room, gym </List.Item>
          </List>
        </div>
        <div className="card_content">
          <Grid centered>
            <Grid.Row>{this.cardMaker()}</Grid.Row>
            <Grid.Row centered>
              <Modal
                open={this.state.showSecretModal}
                content={this.state.secretData}
                header={"Resident Information"}
                closeIcon={true}
              />
            </Grid.Row>

            <Grid.Row centered relaxed>
              <List horizontal bulleted>
                <List.Item>
                  <List.Content>
                    <Button
                      content="Contact Us"
                      circular
                      color="blue"
                      onClick={() =>
                        window.open(
                          "mailto:Garrett.Holmes+cp@gmail.com?subject=Flowernet%20Crashpads"
                        )
                      }
                    />
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default App;
