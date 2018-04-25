import React, { Component } from 'react';
import { BrowserRouter } from 'react-router';
import { Card, Image, Icon, Modal, Button, Header, Dropdown } from 'semantic-ui-react';
import FilterCalendar from './FilterCalendar';
import './CrashpadCard.css';

class CrashpadCard extends Component {

  constructor(props){
    super(props);
    this.state = {
      raised: false,
      filters: {
        crashpad: '',
        room: '',
        bunk: ''
      },
      reqBtn: false
    };
  }

  handleFilterChange(filter,event,data) {
    //console.log(event,data);
    let newFilter = {};
    newFilter[filter] = data.value;
    this.setState({
      filters: Object.assign({},this.state.filters,newFilter)
    });
    //console.log(Object.assign({},this.state.filters,newFilter));
  }

 showHotbed() {
   if(this.props.hotbeds){
     return (
       <a>
        <Icon name='hotel' />
        Nightly stays available!
       </a>);
   }
 }

showReqBtn(num){
  this.setState({reqBtn:num});
}

 showAvailability(){
   const locationFilterOptions = [
     {
       key: 'all',text:'All Crashpads',value:'all'
     },
     {
       key: 'sunnytulip', text: 'Sunny Tulip', value: 'st',
     },
     {
       key: 'dancingsunflower', text: 'Dancing Sunflower', value: 'ds',
     },
     {
       key: 'wildflower', text: 'Wild Flower', value: 'wf',
     },
   ];

   const bunkFilterOptions = [
     {
       key:'all', text: 'Any Bunk',value:'all'
     },
     {
       key:'top', text: 'Top Bunk Only', value: 'top'
     },
     {
       key:'bottom',text: 'Bottom Bunk Only',value:'bottom'
     }
   ];

   const roomFilterOptions = [
     {
       key:'all',text:'All Rooms',value:'all'
     },
     {
       key:'small', text: 'Small (4)', value:'small'
     },
     {
       key:'medium',text:'Medium (6)', value:'medium'
     },
     {
       key:'large',text:'Large (8)',value:'large'
     }
   ];

   let abbrevMap = {
     st: 'Sunny Tulip',
     ds: 'Dancing Sunflower',
     wf: 'Wild Flower'
   };


 var email_code = '';
   if(this.state.filters) {
     if(this.state.filters.crashpad){
       email_code = 'Preferred location: ' + abbrevMap[this.state.filters.crashpad]+'. ';
     }
     if(this.state.filters.room){
       email_code += 'Preferred room size: ' + this.state.filters.room + '. ';
     }
     if(this.state.filters.bunk) {
       email_code += 'Preferred bunk: ' + this.state.filters.bunk + '. ';
     }
   }
   email_code += `Requested move-in date: `;
   return (
     <Modal closeIcon dimmer={'blurring'} size={'small'} style={{textAlign:'center'}} trigger={<Button basic>Show availability!</Button>}>
    <Modal.Header>
      <Dropdown inline onChange={this.handleFilterChange.bind(this,'crashpad')} options={locationFilterOptions} defaultValue={locationFilterOptions[0].value}/></Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <Header>
            <Dropdown className="margin" upward inline onChange={this.handleFilterChange.bind(this,'room')} options={roomFilterOptions} defaultValue={roomFilterOptions[0].value} />
            <Dropdown className="margin" upward inline onChange={this.handleFilterChange.bind(this,'bunk')} options={bunkFilterOptions} defaultValue={bunkFilterOptions[0].value} />
        </Header>

        <FilterCalendar filters={this.state.filters} showReqBtn={this.showReqBtn.bind(this)}/>
        {(this.state.reqBtn)
          ? <Button onClick={ () => document.location.href = `mailto:${"G"}${ ((""+(1===2))[1])}rr${ ((""+(1===2))[4])}tt.holm${ ((""+(2===2))[3])}s+fn@gmail.com?subject=Future Flower Net Resident&body=${email_code+this.state.reqBtn}`} primary>Get your spot!</Button>
          : <div>Choose your preferences, select a date, request your spot!</div>
        }

      </Modal.Description>
    </Modal.Content>
  </Modal>
   );
 }

  render() {
    return (
      <div className="card">
        <Card raised={this.state.raised}
              onMouseEnter={() => this.setState({raised: true})}
              onMouseLeave={() => this.setState({raised:false})}

              centered>
            <Image src={this.props.image}  width={290} height={215}/>
            <Card.Content>
              <Card.Header>
                {this.props.name}
              </Card.Header>
              <Card.Meta>
                <span className='date'>
                  {this.props.meta}
                </span>
              </Card.Meta>
              <Card.Description>
                {this.props.content}
              </Card.Description>
            </Card.Content>
            <Card.Content extra href={this.props.photosURL}>
              <a href={this.props.photosURL}><Icon name='photo' />See Photos!</a>
              <br />
               { this.showHotbed() }

            </Card.Content>
          </Card>
      </div>
    );
  }
}

export default CrashpadCard;
