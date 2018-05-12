import React, { Component } from "react";
const ReactDOM = require('react-dom')
import socketIOClient from "socket.io-client";
import 'react-bootstrap-table';
var _ = require('lodash');

var products = [{
  id: 1,
  name: "Item name 1",
  price: 100
},{
  id: 2,
  name: "Item name 2",
  price: 100
}];

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      bid:{},
      ask:{},
      endpoint: "http://127.0.0.1:4001"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => {
      var a = _.partition(JSON.parse(data),{'type':'bid'});
      this.setState({ response: true, bid:a[0], ask:a[1]})});
  }

  render() {
    const { response } = this.state;
    return (
      <div>
        {response
          ? 
          <div className="row content">
            <h2 style={{marginLeft:'15px'}}>Order Book</h2>
            <div className="col-md-6">
            <div className="panel panel-default">
              <div className="panel-heading">Buy Orders</div>
              <div className="panel-body">
                <BootstrapTable tableHeaderclassName='table-header' striped className="table-header" trClassName='tr-hov'
                  pagination={ false } data={this.state.bid} hover={true} condensed>
                    <TableHeaderColumn 
                      width='150' 
                      headerAlign='center' 
                      dataAlign='center'
                      dataField='total'
                      >Total</TableHeaderColumn>
                      
                    <TableHeaderColumn 
                      isKey 
                      width='150' 
                      headerAlign='center' 
                      dataAlign='center'
                      dataField='price'
                                >Price</TableHeaderColumn>
                </BootstrapTable>
              </div>
            </div>
            </div>
            <div className="col-md-6">
              <div className="panel panel-default">
                <div className="panel-heading">Sell Orders</div>
                <div className="panel-body">
                  <BootstrapTable tableHeaderclassName='table-header' striped className="table-header" trClassName='tr-hov'
                    pagination={ false } data={this.state.ask} hover={true} condensed>
                      <TableHeaderColumn 
                        width='150' 
                        headerAlign='center' 
                        dataAlign='center'
                        dataField='total'
                        >Total</TableHeaderColumn>
                        
                      <TableHeaderColumn 
                        isKey 
                        width='150' 
                        headerAlign='center' 
                        dataAlign='center'
                        dataField='price'
                                  >Price</TableHeaderColumn>
                  </BootstrapTable>
                </div>
            </div>
            </div>
          </div>
          : <p>Loading...</p>}
      </div>
    );
  }
}
export default App;