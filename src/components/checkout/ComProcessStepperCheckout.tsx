import React from 'react';
import { ODSRow, ODSText } from '@telekom-ods/react-ui-kit';
import './ComProcessStepperCheckout.css';

interface ComProcessStepperCheckoutProps {
	stepNumber?: string;
	title?: string;
	showSecureMessage?: boolean;
	isActive?: boolean;
	className?: string;
}

const ComProcessStepperCheckout: React.FC<ComProcessStepperCheckoutProps> = ({
	stepNumber = "1",
	title = "Account",
	showSecureMessage = true,
	isActive = true,
	className = ""
}) => {
	return (
		<ODSRow className={`com-process-stepper-checkout-container ${className}`}>
			<ODSRow className="title-seciton-container">
				<div className={`badge-number-container ${!isActive ? 'inactive' : ''}`}>
					<ODSText as="span" className="badge-number-text">
						{stepNumber}
					</ODSText>
				</div>
				<ODSText as="h2" className={`title-text-container ${!isActive ? 'inactive' : ''}`}>
					{title}
				</ODSText>
			</ODSRow>
			{showSecureMessage && (
				<div className="secure-message-container">
					<div className="security-icon">
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path d="M8 1.33334L3.33333 3.33334V7.33334C3.33333 10.6667 5.66667 13.7333 8 14.6667C10.3333 13.7333 12.6667 10.6667 12.6667 7.33334V3.33334L8 1.33334Z" fill="#007845"/>
						</svg>
					</div>
					<ODSText as="span" className="secure-text">Secure</ODSText>
				</div>
			)}
		</ODSRow>
	);
};

export default ComProcessStepperCheckout;