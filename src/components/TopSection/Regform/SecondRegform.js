import React, { Component } from 'react'
import IntlTelInput from 'react-intl-tel-input'
import 'react-intl-tel-input/dist/main.css'
import logo from '../../BottomSection/logo.png'
import hint from './6b.png'
import {UserContext} from '../../../helpers/dataContext';


export default class SecondRegform extends Component {
    constructor(props) {
        super(props);

    }
    static contextType = UserContext
    state = {
        first_name: "",
        last_name: "",
        email: "",
        check: false,
        password: "",
        phone_country_prefix: "",
        phone_number: "",
        agree_1: true,
        agree_2: true,
        errorIndexes: [0,1,2,3]
    };

    componentDidMount() {
        this.setState({
            first_name: this.context.firstName,
            email: this.context.email,
        });
    }

    phoneNumberBlur = (status, value, countryData) => {
        let phone_number = value;
        if (!this.phoneValidate(phone_number)) {
            this.setState({
                errors: ['Enter only number']
            });
            return this.state.errors;
        }
        else if (phone_number.length > 3) {
            this.setState({
                phone_number: phone_number,
                phone_country_prefix: '+' + `${countryData.dialCode}`
            });
        }
        else {
            this.setState({
                errors: ['Enter phone number']
            });
            return this.state.errors
        }
    }

    phoneValidate = (value) => {
        return !/[^0-9\-\/]/.test(value);
    };

    nameValidate = (value) => {
        return !/^([^0-9]*)$/.test(value);
    };

    emailValidate = (value) => {
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    handleForward = () => {
        let paramsToValidate = {
            email: this.state.email,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            password: this.state.password,
            agree_2: this.state.agree_2,
            phone_number: this.state.phone_number,
            phone_country_prefix: this.state.phone_country_prefix,
            funnel_name: window.location.origin,
        };
        console.log(paramsToValidate);
        let submitResponse = this.props.validateParams(paramsToValidate);

        if (submitResponse.success) {
            this.props.handleSubmit(paramsToValidate);
            
        }
        else{
            this.setState({
                errors: submitResponse.errors
            })
        }
    };


    handleStepChange = (name, value) => {
        let errors = null;

        this.setState({
            [name]: value.replace(/^\s+|\s/g, ''), errors,
        })

        if (name === 'first_name') {

            let firstNameValue = value;
            if (this.nameValidate(firstNameValue)) {
                this.setState({
                    errors: ['Please enter name without digits']
                });
                return this.state.errors

            } else {
                this.setState({first_name: firstNameValue.replace(/^\s+|\s/g, '')});
            }

        } else if (name === 'last_name') {

            let SecondNameValue = value;
            if (this.nameValidate(SecondNameValue)) {

                this.setState({
                    errors: ['Please enter name without digits']
                });
                return this.state.errors

            } else {
                this.setState({last_name: SecondNameValue.replace(/^\s+|\s/g, '')});
            }

        } else if (name === 'password') {

            let passwordValue = value;
            this.setState({password: passwordValue.replace(/^\s+|\s/g, '')});

        } else if (name === 'email') {

            let emailValue = value;
            if(this.emailValidate(emailValue)) {
                this.setState({
                    errors: ['Invalid email format']
                });
                return this.state.errors

            } else {
                this.setState({email: emailValue.replace(/^\s+|\s/g, '')});
            }
        }
    };


    render() {
        let languageManager = this.props.languageManager();
        let { first_name, email } = this.state;

        if (!this.props.success) {
            return (
                <div className="SecondRegform">
                    <img src={logo} alt="logo" className="logo small"/>
                    <div className='inner'>
                        <div className='form-wrapper one'>
                            {/* {this.state.errors && <div className="errors">
                                    {this.state.errors[0]}
                                        </div>}*/}
                            <div className="row">
                                <div className="col-lg-6">
                                    <input className="inputfield fname small-input" type="text" name="first_name" value={first_name} placeholder={languageManager.fname} onChange={(e) => this.handleStepChange(e.target.name, e.target.value)}/>
                                </div>
                                <div className="col-lg-6">
                                    <input className="inputfield lname small-input" type="text" name="last_name" value={this.state.last_name} placeholder={languageManager.lname} onChange={(e) => this.handleStepChange(e.target.name, e.target.value)}/>
                                </div>
                            </div>
                            <input className="inputfield email small-input" type="text" name="email" placeholder={languageManager.email} value={email} autoComplete='off' onChange={(e) => this.handleStepChange(e.target.name, e.target.value)}/>
                            <input className="inputfield pass small-input" type="password" maxLength="8" value={this.state.password} onChange={(e) => this.handleStepChange(e.target.name, e.target.value)} name="password" placeholder={languageManager.pass}/>
                            <img src={hint} alt="hint" className="hint"/>
                            <IntlTelInput
                                preferredCountries={[this.props.countryCode]}
                                containerClassName="intl-tel-input"
                                inputClassName="inputfield tel small-input"
                                autoPlaceholder={true}
                                separateDialCode={true}
                                onSelectFlag={this.handleSelectFlag}
                                onPhoneNumberBlur={this.phoneNumberBlur}
                                onPhoneNumberChange={(status, value, countryData, number, id) => {
                                   if (value.length <= 15) {
                                        this.setState({
                                            phone_country_prefix: `${countryData.dialCode}`,
                                            dynamicNum: value.replace(/[^0-9]/g, '')
                                        })
                                   }
                                }}
                                value = {this.state.dynamicNum}
                            />
                            <button onClick={this.handleForward} className='start' >{languageManager.button_last}</button>
                        </div>
                    </div>
                </div>
            )
        }   else {
            return (
                <div className="Regform last-step">
                    <div className="inner">
                        <div className='form-wrapper three last-step-logo'>
                            <img src={logo} className="logo" alt=""/>
                        </div>
                    </div>
                </div>

            )
        }
    }  
}
