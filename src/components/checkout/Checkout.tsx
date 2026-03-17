import React from "react";
import ComProcessStepperCheckout from "./ComProcessStepperCheckout";
import Header from "../header/header";
import "./Checkout.css";

const Checkout: React.FC = () => {
  const checkoutSteps = [
    { stepNumber: "1", title: "Account", showSecureMessage: true, isActive: true },
    { stepNumber: "2", title: "Personal information", showSecureMessage: false, isActive: false },
    { stepNumber: "3", title: "Identification", showSecureMessage: false, isActive: false },
    { stepNumber: "4", title: "Delivery", showSecureMessage: false, isActive: false },
    { stepNumber: "5", title: "Appointment booking", showSecureMessage: false, isActive: false },
    { stepNumber: "6", title: "Provider change", showSecureMessage: false, isActive: false },
    { stepNumber: "7", title: "Payment", showSecureMessage: false, isActive: false },
    { stepNumber: "8", title: "Consents", showSecureMessage: false, isActive: false },
  ];

  return (
    <>
      <Header />
      <div className="page-wrapper">
        <div className="page-content-container">
          <div className="title-container">
            <div className="actions-container">
              <a
                className="ods-link-container"
                href="#"
                aria-label="Back"
              >
                ← Back
              </a>
            </div>
            <h1 className="title-text-container">Checkout</h1>
          </div>
          <div className="modul-section-list-container-container">
            {checkoutSteps.map((data) => (
              <div key={data.stepNumber} className="checkout-module-container">
                <ComProcessStepperCheckout
                  stepNumber={data.stepNumber}
                  title={data.title}
                  showSecureMessage={data.showSecureMessage}
                  isActive={data.isActive}
                  className="com-process-stepper-checkout-container"
                />
                {data.isActive && (
                  <div className="content-container">
                    <div className="registration-login-tdg-container">
                      <div className="options-container">
                        <label className="ods-card-choice-simple-private-container card-choice">
                          <input type="radio" name="account-type" />
                          <div className="left-content-container">
                            <span className="heading-text-container">New customer register</span>
                            <span className="label-bottom-text-container">
                              You will register and create your Telekom login
                            </span>
                          </div>
                        </label>
                        <label className="ods-card-choice-simple-business-container card-choice">
                          <input type="radio" name="account-type" />
                          <div className="left-content-container">
                            <span className="heading-text-container">Existing customer login</span>
                            <span className="label-bottom-text-container">
                              You will login with username, Email or phone number
                            </span>
                          </div>
                        </label>
                      </div>
                      <div className="action-buttons-container">
                        <button className="ods-button-continue-container checkout-btn-primary">
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
