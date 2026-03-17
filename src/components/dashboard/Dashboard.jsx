import {
  ODSAccordion,
  ODSAvatar,
  ODSButton,
  ODSColumn,
  ODSDivider,
  ODSLogo,
  ODSRow,
  ODSSwitch,
  ODSText,
  ODSToggleChip,
  ODSChipSet,
} from "@telekom-ods/react-ui-kit";
import Header from "../header/header";

import "./dashboard.css";

const Dashboard = () => {
  return (
    <>
      <Header />
      <ODSColumn className="plan-build-your-plan-container">
        <ODSColumn className="plan-page-content-container">
          <ODSColumn className="plan-build-your-plan-section-container">
            <ODSText
              as="h1"
              className="plan-build-your-plan-header-text-container"
            >
              Build your plan
            </ODSText>
            <ODSColumn className="plan-step-1-container">
              {/* TODO: Add the proper html tag under 'as' property */}
              <ODSText
                as="span"
                className="plan-plan-question-header-text-container"
              >
                How much data do you want?
              </ODSText>
              <ODSChipSet>
                <ODSToggleChip label="∞" showPicture={false} />
                <ODSToggleChip label="40GB" showPicture={false} />
                <ODSToggleChip label="20GB" showPicture={false} />
                <ODSToggleChip label="10GB" showPicture={false} />
                <ODSToggleChip label="5GB" showPicture={false} />
              </ODSChipSet>
            </ODSColumn>
            <ODSColumn className="plan-step-2-container">
              {/* TODO: Add the proper html tag under 'as' property */}
              <ODSText
                as="span"
                className="plan-plan-question-header-text-container"
              >
                How many cards?
              </ODSText>
              <ODSChipSet className="plan-card-chips-container">
                <ODSToggleChip label="1 Adult" showPicture={false} />
                <ODSToggleChip label="0 Data" showPicture={false} />
                <ODSToggleChip label="0 Kids" showPicture={false} />
              </ODSChipSet>
            </ODSColumn>
            <ODSColumn className="plan-step-3-container">
              {/* TODO: Add the proper html tag under 'as' property */}
              <ODSText
                as="span"
                className="plan-plan-question-header-text-container"
              >
                Select your contract legth
              </ODSText>
              <ODSChipSet>
                <ODSToggleChip label="24 mo Contract" showPicture={false} />
                <ODSToggleChip label="Flexible Contract" showPicture={false} />
              </ODSChipSet>
            </ODSColumn>
            <ODSColumn className="plan-existing-customer-container">
              <ODSSwitch className="plan-ods-switch-container" size="small" />
            </ODSColumn>
            <ODSButton
              buttonType="standard"
              label="Proceed to checkout"
              leftIcon={false}
              rightIcon={false}
              size="large"
              variant="primary"
            />
          </ODSColumn>
          <ODSDivider
            className="plan-ods-divider-container"
            inset={false}
            spacing={true}
            variant="horizontal"
          />
          <ODSColumn className="plan-fa-qs-section-container">
            <ODSRow className="plan-title-button-container">
              {/* TODO: Add the proper html tag under 'as' property */}
              <ODSText
                as="span"
                className="plan-frequently-asked-questions-header-text-container"
              >
                Frequently asked questions
              </ODSText>
              <ODSButton
                buttonType="standard"
                label="See all"
                leftIcon={false}
                rightIcon={false}
                size="small"
                variant="outline"
              />
            </ODSRow>
            <ODSColumn className="plan-fa-qs-container">
              <ODSAccordion
                className="plan-ods-accordion-container"
                contentText="Expanded content example. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor. Integer posuere erat a ante venenatis dapibus "
                headerText="What's new in the MagentaMobil portfolio?"
                size="large"
              />
              <ODSDivider
                className="plan-ods-divider-container"
                inset={false}
                spacing={false}
                variant="horizontal"
              />
              <ODSAccordion
                className="plan-ods-accordion-container"
                contentText="Expanded content example. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor. Integer posuere erat a ante venenatis dapibus "
                headerText="What does average price mean in relation to the new cell phone tariffs and how do you calculate it?"
                size="large"
              />
              <ODSDivider
                className="plan-ods-divider-container"
                inset={false}
                spacing={false}
                variant="horizontal"
              />
              <ODSAccordion
                className="plan-ods-accordion-container"
                headerText="What should I pay attention to with my new cell phone tariff?"
                size="large"
              />
              <ODSDivider
                className="plan-ods-divider-container"
                inset={false}
                spacing={false}
                variant="horizontal"
              />
              <ODSAccordion
                className="plan-ods-accordion-container"
                headerText="Cell phone contract or prepaid tariff?"
                size="large"
              />
            </ODSColumn>
          </ODSColumn>
        </ODSColumn>
      </ODSColumn>
    </>
  );
};

export default Dashboard;
