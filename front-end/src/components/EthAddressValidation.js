import React from 'react'

const defaultState = {
    ethAddressError: null,
    ethAddress: null
}
class EthAddressValidation
 extends React.Component {
    constructor() {
        super();
        this.state = defaultState;
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    handleInputChange(event) {
        const target = event.target;
        var value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    validate() {
        let ethAddressError = "";
        const ethereum_address = require('ethereum-address');
        if (ethereum_address.isAddress(this.state.ethAddress)) {
            ethAddressError = "Valid ethereum address.";
        }
        else {
            ethAddressError = "Invalid Ethereum address."
        }
        if (ethAddressError) {
            this.setState({ ethAddressError });
            return false;
        }
        return true;
    }
    submit() {
        if (this.validate()) {
            console.warn(this.state);
            this.setState(defaultState);
        }
    }
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <h3>Ethereum form vaidation</h3><br />
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label>Ethereum address :</label>
                                <input type="text" className="form-control" name="ethAddress" value={this.state.ethAddress} onChange={this.handleInputChange} />
                                <span className="text-danger">{this.state.ethAddressError}</span>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-md-12 text-center">
                                <button type="submit" className="btn btn-primary" onClick={() => this.submit()}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default EthAddressValidation
;


