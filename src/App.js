import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router';
import CrashpadCard from './components/CrashpadCard';
import { Segment, Card, Grid, List, Icon, Button, Modal, Image } from 'semantic-ui-react';
import PAD_DATA from './crashpaddata';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';

class App extends Component {


constructor(props) {
  super(props);
  this.state = {
    showSecretModal: false,
    secretData: false,
    email: ''
  };
}

  amenitiesMaker(list){
    let content = list.map( (li) => <li>{li}</li>);
    return (
      <ul className="desc_list">
      {content}
      </ul>
    );
  }

  cardMaker() {
    var ret = PAD_DATA.map( (pad) =>
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
    );
    return (<Card.Group stackable doubling>{ret}</Card.Group>)

  }

  responseFacebook(response){
    console.log(response);
    if(response && response.accessToken){
      axios.get('https://mk9d81dhcj.execute-api.us-east-2.amazonaws.com/prod/getPrivateCrashpadResources?token='+response.accessToken).then(secrets => {
        this.setState({secretData: secrets.data, email: secrets.email});
      });
    }
  }

  render() {
      const randoFunc = (event, allProps) => {
      console.log(event, allProps);
      console.log('Clicked');
    };

    return (
      <div className="App">
        <div className="App-header">
          <div>
            <Image
              src={'https://flowernetsite.files.wordpress.com/2017/09/logo3.png'}
              height={160}
              centered

              //width={}
            />
          </div>
          <h2>Flowernet Crashpads</h2>
          - Truly yours, your home away from home -
        </div>
          <div className="sell_blurb">
            <List>
              <List.Item>Weekly cleaning service</List.Item>
              <List.Item>Free coffee, rice, oatmeal</List.Item>
              <List.Item>Washer & dryer in unit (w/ detergent)</List.Item>
              <List.Item>Full kitchen - 2 refrigerators</List.Item>
              <List.Item>Thick pillowtop mattresses</List.Item>
              <List.Item>Ample storage for clothing, food, and toiletries</List.Item>
              <List.Item>SFO via hotel shuttle ($1), city bus ($2)</List.Item>
              <List.Item>24hr Pool, hot tub, aerobics room, gym </List.Item>
            </List>
          </div>
          <div className="card_content">
            <Grid centered>
              <Grid.Row>
                {this.cardMaker()}
              </Grid.Row>
              <Grid.Row centered>
                <Modal
                  open={this.state.showSecretModal}
                  content={this.state.secretData}
                  header={'Resident Information'}
                  closeIcon={true}

                />

            <div>

              <br />
              <Button onClick={() => window.open('https://javascriptfun.neocities.org/flowernet/agreement.html','_new')} content='See Rules & Resident Agreement' icon='right arrow' circular labelPosition='right' color='blue'/>
            </div>
          </Grid.Row>

          <Grid.Row centered relaxed>
                <List horizontal bulleted>
                  <List.Item><List.Content><a href="mailto:Garrett.Holmes+cp@gmail.com">Contact us</a></List.Content></List.Item>
                </List>
          </Grid.Row>
            </Grid>
          </div>
        </div>


    );
  }
}

export default App;
