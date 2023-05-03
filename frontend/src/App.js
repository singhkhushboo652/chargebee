import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const urlEncode = function(data) {
  var str = [];
  for (var p in data) {
      if (data.hasOwnProperty(p) && (!(data[p] == undefined || data[p] == null))) {
          str.push(encodeURIComponent(p) + "=" + (data[p] ? encodeURIComponent(data[p]) : ""));
      }
  }
  return str.join("&");
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {cbInstance: window.Chargebee.init({
      site: "sharvil-jp-test"
    })};

    this.state.cbInstance.setPortalSession(() => {
      // we have used axios for performing http requests
            // Hit your end point that returns portal session object as response
      // This sample end point will call the below api
      // https://apidocs.chargebee.com/docs/api/portal_sessions#create_a_portal_session
      return axios.post("http://localhost:8000/api/generate_portal_session", urlEncode({})).then((response) => response.data);
    });

    this.state.prices = [];
    this.state.pricePlan = [];
    this.handleCheckout = this.handleCheckout.bind(this);
    this.handleCheckoutExisting = this.handleCheckoutExisting.bind(this);
    this.handlePortal = this.handlePortal.bind(this);
    this.handleUpdatePM = this.handleUpdatePM.bind(this);
    this.handleCustomer = this.handleCustomer.bind(this);
  }
  
  handleCheckout(pricePlan) {
    this.state.cbInstance.openCheckout({
      hostedPage() {
        return axios.post("http://localhost:8000/api/generate_checkout_new_url", urlEncode({plan_id: "cbdemo_basic"})).then((response) => response.data)
      },
      success(hostedPageId) {
        console.log(hostedPageId);
      },
      close() {
        console.log("checkout new closed");
      },
      step(step) {
        console.log("checkout", step);
      }
    })
  }

  handleCheckoutExisting() {
    this.state.cbInstance.openCheckout({
      hostedPage() {
        return axios.post("http://localhost:8000/api/generate_checkout_existing_url", urlEncode({plan_id: "cbdemo_basic"})).then((response) => response.data)
      },
      success(hostedPageId) {
        console.log(hostedPageId);
      },
      close() {
        console.log("checkout existing closed");
      },
      step(step) {
        console.log("checkout existing", step);
      }
    });
  }

  handlePortal() {
    this.state.cbInstance.createChargebeePortal().open({
      visit(visit) {
        console.log("portal visit", visit);
      }
    });
  }

  handleUpdatePM() {
    this.state.cbInstance.openCheckout({
      hostedPage() {
        return axios.post("http://localhost:8000/api/generate_update_payment_method_url", urlEncode({plan_id: "cbdemo_basic"})).then((response) => response.data)
      },
      close() {
        console.log("update payment method closed");
      }
    });
  }

  handleCustomer() {
    axios.post("http://localhost:8000/api/listPlans", urlEncode({plan_id: "cbdemo_basic"})).then((response) => {
      console.log(response.data);
      this.setState({prices:response.data});
    });
  }

  handleChange = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    console.log(`${value} is ${checked}`);
     
    let pricePlan = this.state.pricePlan;
    // Case 1 : The user checks the box
    if (checked) {
      pricePlan.push(value);
    }
  
    // Case 2  : The user unchecks the box
    else {
      pricePlan.filter((plan) => plan.value !== value);
    }
    this.setState('pricePlan', pricePlan);
  };


  render() {
    let prices = this.state.prices;
    let pricePlan = this.state.pricePlan;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title"></h1>
        </header>
        <div className="bodyContainer">
        <a href="#" onClick={this.handleCustomer}>Create Customer</a>
          <a href="#" onClick={this.handleCheckout}>Subscribe</a>
          <a href="#" onClick={this.handleCheckoutExisting}>Upgrade</a>
          <a href="#" onClick={this.handleUpdatePM}>Update payment method</a>
        </div>
        <div>
      <h1>Select a plan</h1>

      <div className="price-list">
        {prices.map((price) => {
          console.log(price);
          return (
            <div key={price.id}>
              <h3>{price.product.name}</h3>

              <p>
                ${price.unit_amount / 100} / ${price.recurring?price.recurring.interval:''}
              </p>
              <input
                    className="form-check-input"
                    type="checkbox"
                    name="price_plan"
                    value={price.id}
                    onChange={this.handleChange}
              />
            </div>
          )
        })}
      </div>
              <button onClick={() => this.handleCheckout(pricePlan)}>
                Select
              </button>
    </div>
      </div>
    );
  }
}

export default App;
