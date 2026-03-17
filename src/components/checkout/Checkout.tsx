import {
  ODSButton,
  ODSLink,
  ODSLogo,
  ODSText,
  ODSColumn,
  ODSRow,
  ODSCardChoiceV2,
} from "@telekom-ods/react-ui-kit";
import React from "react";
import ComProcessStepperCheckout from "./ComProcessStepperCheckout";
import Header from "../header/header";
import "./Checkout.css";

const Checkout: React.FC = () => {
  const checkoutSteps = [
    {
      stepNumber: "1",
      title: "Account",
      showSecureMessage: true,
      isActive: true,
    },
    {
      stepNumber: "2",
      title: "Personal information",
      showSecureMessage: false,
      isActive: false,
    },
    {
      stepNumber: "3",
      title: "Identification",
      showSecureMessage: false,
      isActive: false,
    },
    {
      stepNumber: "4",
      title: "Delivery",
      showSecureMessage: false,
      isActive: false,
    },
    {
      stepNumber: "5",
      title: "Appointment booking",
      showSecureMessage: false,
      isActive: false,
    },
    {
      stepNumber: "6",
      title: "Provider change",
      showSecureMessage: false,
      isActive: false,
    },
    {
      stepNumber: "7",
      title: "Payment",
      showSecureMessage: false,
      isActive: false,
    },
    {
      stepNumber: "8",
      title: "Consents",
      showSecureMessage: false,
      isActive: false,
    },
  ];

  return (
    <>
      <Header />
      <ODSColumn className="page-wrapper">
        <ODSColumn className="page-content-container">
          <ODSColumn className="title-container">
            <ODSRow className="actions-container">
              <ODSLink
                className="ods-link-container"
                alignment="left"
                label="Back"
                leftIcon="navigation-left-type-standard-size-small"
                type="primary"
              />
            </ODSRow>
            <ODSText as="h1" className="title-text-container">
              Checkout
            </ODSText>
          </ODSColumn>
          <ODSColumn className="modul-section-list-container-container">
            {checkoutSteps.map((data, index) => {
              return (
                <ODSColumn
                  key={data.stepNumber}
                  className="checkout-module-container"
                >
                  <ComProcessStepperCheckout
                    stepNumber={data.stepNumber}
                    title={data.title}
                    showSecureMessage={data.showSecureMessage}
                    isActive={data.isActive}
                    className="com-process-stepper-checkout-container"
                  />
                  {data.isActive && (
                    <ODSColumn className="content-container">
                      <ODSColumn className="registration-login-tdg-container">
                        <ODSColumn className="options-container">
                          {/* TODO: Add the proper data structure to the properties */}
                          <ODSCardChoiceV2
                            className="ods-card-choice-simple-private-container"
                            type="radioChoice"
                            contentSlot={
                              <ODSColumn className="left-content-container">
                                {/* TODO: Add the proper html tag under 'as' property */}
                                <ODSText
                                  as="span"
                                  className="heading-text-container"
                                >
                                  New customer register
                                </ODSText>
                                {/* TODO: Add the proper html tag under 'as' property */}
                                <ODSText
                                  as="span"
                                  className="label-bottom-text-container"
                                >
                                  You will register and create your Telekom
                                  login
                                </ODSText>
                              </ODSColumn>
                            }
                          />
                          {/* TODO: Add the proper data structure to the properties */}
                          <ODSCardChoiceV2
                            className="ods-card-choice-simple-business-container"
                            type="radioChoice"
                            contentSlot={
                              <ODSColumn className="left-content-container">
                                {/* TODO: Add the proper html tag under 'as' property */}
                                <ODSText
                                  as="span"
                                  className="heading-text-container"
                                >
                                  Existing customer login
                                </ODSText>
                                {/* TODO: Add the proper html tag under 'as' property */}
                                <ODSText
                                  as="span"
                                  className="label-bottom-text-container"
                                >
                                  You will login with username, Email or phone
                                  number
                                </ODSText>
                              </ODSColumn>
                            }
                          />
                        </ODSColumn>
                        <ODSColumn className="action-buttons-container">
                          {/* TODO: Add the proper data structure to the properties */}
                          <ODSButton
                            className="ods-button-continue-container"
                            buttonType="standard"
                            label="Continue"
                            leftIcon={false}
                            rightIcon={false}
                            size="large"
                            variant="primary"
                          />
                        </ODSColumn>
                      </ODSColumn>
                    </ODSColumn>
                  )}
                </ODSColumn>
              );
            })}
          </ODSColumn>
        </ODSColumn>
      </ODSColumn>
    </>
  );
};

export default Checkout;
