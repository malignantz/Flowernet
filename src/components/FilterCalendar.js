import React, { Component } from 'react';
import { BrowserRouter } from 'react-router';
import { Card, Image, Icon, Modal, Button, Header } from 'semantic-ui-react';
//import './FilterCalendar.css';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import './FilterCalendar.css';
import { st_data, ds_data, wf_data } from  './../availability_data';

class FilterCalendar extends Component {

  constructor(props){
    super(props);
    this.state = { selectedDay: null};
  }

  availabilityCSVParser(data){
    var CSV_DATA = data;
    // after chopping off title row
    // even numbers top bunk
    // 1-4 (large room), index range: 0-7
    // 5-7 (med room), index range: 8-13
    // 8-9 (sm room), index range: 14-17
    //

    let processBunkObject = (bunkObj) => {
      let bunkProps = {};

      if(bunkObj.code[4] === 'T') {
        bunkProps.bunk = 'top';
      } else {
        bunkProps.bunk = 'bottom';
      }

      let bunkNum = parseInt(bunkObj.code[3]);

      if( bunkNum > 7) {
        bunkProps.room = 'small';
      } else if(bunkNum > 4) {
        bunkProps.room = 'medium';
      } else {
        bunkProps.room = 'large';
      }

      return Object.assign(bunkObj, bunkProps);

    };
    return CSV_DATA
                  .split('\n')
                  .slice(1)
                  .map(row => row.split(',').map(text => text.trim()))
                  .map(bunk => {
                    return {
                      code: bunk[0],
                      occupancy: bunk[1],
                      moveout: bunk[2],
                      movein: bunk[3]
                    };
                  })
                  .map(processBunkObject);
  }

  getDayNum(date) {
    return new Date(date).getDate();
  }

  // data is array of bunk objects
  buildAvailabilityCalendar(data, existing = []) {
    // if occupied and has move-out day, add days from move-out onward
    // if unoccupied, add days until movein
    //console.log(data);
    let calStart;
    if(existing.length === 0){
      calStart = [];
      for(let i = 0;i<=30;i++){
        calStart.push([]);
      }
    } else {
      calStart = existing;
    }

    var today = new Date().getDate();
    var eom = new Date(2017,new Date().getMonth()+1,0).getDate();
    let start,end;
    console.log(calStart)
    return data.reduce( (cal, bunk) => {
      //console.log(cal);
      if(bunk.occupancy === 'empty'){
        start = today;
        if(bunk.movein === '') {
          end = eom;
        } else {
          end = this.getDayNum(bunk.movein)-1;
        }
      } else {
        if(bunk.moveout !== '') {
          start = this.getDayNum(bunk.moveout);
          if(bunk.movein !== '') {
            end = this.getDayNum(bunk.movein)-1;
          } else {
            end = eom;
          }
        }
      }
      if(start === undefined || end === undefined){
        //console.log('Probably not errors.');
        console.log('UNDEF: start',start,'end',end)
        return cal;
      } else {
        return this.addBunkToCalendarRange(cal,bunk,start,end);
      }
    },calStart);
    //.map(item => item ? item : []);
  }

// start/end inclusive
// 1 indexed start/end values
addBunkToCalendarRange(cal, bunk, start,end) {
  // switch to zero-index values
//  console.log('addBunk cal:',cal);
if(cal === undefined){
  console.log('\nMajor error\n**\n**\n**')
}
//console.log(bunk,start,end);
  start--;
  end--;
  for(let i = start;i<=end;i++){
    if(Array.isArray(cal[i])) {
      cal[i].push(bunk);
    } else {
      cal[i] = [bunk];
    }
  }
  return cal;
}

createDisabledModifiers(cal,year,month,daysInMonth) {
  console.log(cal);
  return cal.reduce( (disabledDayRules, dayAvailability, day) => {
    if(!Array.isArray(dayAvailability)){
      console.log('not an array -- error');
    } else if(dayAvailability.length === 0 && day+1 < daysInMonth){
      return disabledDayRules.concat(new Date(year,month,day+1));
    }
    return disabledDayRules;
  },[]);
}

  render() {
    const availData = {
      st: this.availabilityCSVParser(st_data),
      ds: this.availabilityCSVParser(ds_data),
      wf: this.availabilityCSVParser(wf_data)
    };

    let filters = this.props.filters;
    let cal;
    let eom = new Date(2017,new Date().getMonth()+1,0).getDate();
    // filter by Crashpad
    if(filters && filters.crashpad && filters.crashpad !== 'all'){
      cal = this.buildAvailabilityCalendar(availData[filters.crashpad]);
    } else {
      for(let pad in availData) {
        cal = this.buildAvailabilityCalendar(availData[pad],cal)
      }
    }

    // filter by Room
    if(filters.room && filters.room !== 'all'){
      cal = cal.map(arr => arr.filter(bunk => bunk.room === filters.room));
    }
    if(filters.bunk && filters.bunk !== 'all') {
      cal = cal.map(arr => arr.filter(bunk => bunk.bunk === filters.bunk));
    }


  var dateObj = new Date();
  //let cal = this.buildAvailabilityCalendar(this.availabilityCSVParser());

    console.log(this.createDisabledModifiers(cal,dateObj.getFullYear(),dateObj.getMonth()));

    //console.log(cal);
    return (
      <div>
        <DayPicker
          //  modifiers={this.createModifiers()}
            initialMonth={new Date()}
            disabledDays={this.createDisabledModifiers(cal,dateObj.getFullYear(),dateObj.getMonth(),eom)}
            onDayClick={(day, event) => {
                                    //console.log(cal[new Date(day).getDate()-1])
                                    if(event.disabled) return;
                                    this.state.selectedDay && this.state.selectedDay.valueOf() === day.valueOf()
                                      ? this.setState({selectedDay: null})
                                      : this.setState({selectedDay: day});
                                    this.props.showReqBtn(new Date(day).toDateString())
                        }}
            selectedDays={this.state.selectedDay}

        />
      </div>
    );
  }
}

export default FilterCalendar;
